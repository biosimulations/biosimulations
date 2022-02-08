import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk';
import { Readable, PassThrough } from 'stream';
import unzipper, { File } from 'unzipper';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';

@Injectable()
export class SharedStorageService {
  private static RETRY_ERROR_CODES = [
    HttpStatus.REQUEST_TIMEOUT,
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpStatus.BAD_GATEWAY,
    HttpStatus.GATEWAY_TIMEOUT,
    HttpStatus.SERVICE_UNAVAILABLE,
    HttpStatus.TOO_MANY_REQUESTS,
    undefined,
    null,
  ];
  private static NUM_RETRIES = 10;
  private static MIN_TIMEOUT = 100; // 100 ms

  private BUCKET: string;
  private S3_UPLOAD_TIMEOUT_TIME = 10 * 60 * 1000; // 10 minutes;
  private logger = new Logger(SharedStorageService.name);

  public constructor(
    @InjectS3() private readonly s3: S3,
    private configService: ConfigService,
  ) {
    this.BUCKET =
      configService.get('storage.bucket') || 'files.biosimulations.dev';
    s3.config.update({ region: 'us-east-1' });
  }

  public getObjectUrl(key: string): string {
    const url = this.s3.getSignedUrl('headObject', {
      Bucket: this.BUCKET,
      Key: key,
    });
    return url.split('?')[0];
  }

  public async getObjectInfo(key: string): Promise<AWS.S3.HeadObjectOutput> {
    const call = this.s3
      .headObject({ Bucket: this.BUCKET, Key: key })
      .promise();

    const res = await call;

    if (res.$response.error) {
      throw res.$response.error.originalError;
    } else {
      return res;
    }
  }

  public async listObjects(key: string): Promise<AWS.S3.ListObjectsOutput> {
    const call = this.s3
      .listObjects({ Bucket: this.BUCKET, Prefix: key })
      .promise();

    const res = await call;

    if (res.$response.error) {
      throw res.$response.error.originalError;
    } else {
      return res;
    }
  }

  public async isObject(key: string): Promise<boolean> {
    const call = this.s3
      .headObject({ Bucket: this.BUCKET, Key: key })
      .promise();

    try {
      await call;
      return true;
    } catch (error) {
      if ((error as AWSError).statusCode === HttpStatus.NOT_FOUND) {
        return false;
      } else {
        throw error;
      }
    }
  }

  public async getObject(key: string): Promise<AWS.S3.GetObjectOutput> {
    const call = this.s3.getObject({ Bucket: this.BUCKET, Key: key }).promise();

    const res = await call;

    if (res.$response.error) {
      this.logger.error(
        `Object with key '${key}' could not be retrieved: ${res.$response.error.message}`,
      );
      throw res.$response.error.originalError;
    } else {
      return res;
    }
  }

  public async extractZipObject(
    zipFile: string,
    destination: string,
    isPrivate = false,
  ): Promise<AWS.S3.ManagedUpload.SendData[]> {
    const zipStreamPromise = unzipper.Open.s3(this.s3, {
      Bucket: this.BUCKET,
      Key: zipFile,
    });

    const zipStream = await zipStreamPromise;

    const promises: Promise<AWS.S3.ManagedUpload.SendData>[] =
      // using flatmap instead of map makes it easier to handle the empty case
      zipStream.files.flatMap(
        (entry: File): Promise<AWS.S3.ManagedUpload.SendData>[] => {
          const type = entry.type;
          if (type === 'File') {
            const fileName = entry.path;
            const s3Path = `${destination}/${fileName}`;
            const upload = this.putObject(s3Path, entry.stream(), isPrivate);
            return [upload];
          } else {
            return [];
          }
        },
      );
    const resolved = Promise.all(promises);
    return resolved;
  }

  public async putObject(
    key: string,
    data: Buffer | Readable,
    isPrivate = false,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const acl = isPrivate ? 'private' : 'public-read';
    const request: AWS.S3.PutObjectRequest = {
      Key: key,
      Body: isReadableStream(data) ? new PassThrough() : data,
      Bucket: this.BUCKET,
      ACL: acl,
    };

    const call = this.s3.upload(request).promise();
    if (isReadableStream(data)) {
      (data as Readable).pipe(request.Body as PassThrough);
    }

    const timeoutErr = Symbol();

    try {
      const res = await this.timeout(
        call,
        this.S3_UPLOAD_TIMEOUT_TIME,
        timeoutErr,
      );

      return res;
    } catch (err) {
      if (err === timeoutErr) {
        this.logger.error(
          `Timeout when uploading '${key}' to storage in ${this.S3_UPLOAD_TIMEOUT_TIME} ms.`,
        );
        throw new BiosimulationsException(
          HttpStatus.REQUEST_TIMEOUT,
          'File could not be saved',
          'Timeout when uploading file to storage.',
        );
      } else {
        const details =
          err instanceof Error && err.message
            ? err?.message
            : `Error when uploading ${key} to storage.`;
        this.logger.error(details);

        const message =
          err instanceof Error && err.message
            ? err?.message
            : 'Error when uploading file to storage.';
        throw new BiosimulationsException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'File could not be saved',
          message,
        );
      }
    }
  }

  public async deleteObject(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const call = this.s3
      .deleteObject({ Bucket: this.BUCKET, Key: key })
      .promise();

    const res = await call;

    if (res.$response.error) {
      throw res.$response.error.originalError;
    } else {
      return res;
    }
  }

  private timeout<Type>(
    prom: Promise<Type>,
    time: number,
    exception: symbol,
  ): Promise<Type> {
    let timer: NodeJS.Timeout;
    return Promise.race([
      prom,
      new Promise(
        (_resolve, reject) =>
          (timer = global.setTimeout(reject, time, exception)),
      ),
    ]).finally(() => clearTimeout(Number(timer))) as Promise<Type>;
  }
}

export function isStream(stream: any): boolean {
  return (
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function'
  );
}

export function isReadableStream(stream: any): boolean {
  return (
    isStream(stream) &&
    stream.readable !== false &&
    typeof stream._read === 'function' &&
    typeof stream._readableState === 'object'
  );
}
