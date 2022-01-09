import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk';
import { Readable } from 'stream';
import unzipper, { File } from 'unzipper';
import { promiseRetry } from './promise-retry/promise-retry';

@Injectable()
export class SharedStorageService {
  private BUCKET: string;
  private PUBLIC_ENDPOINT: string;
  private S3_UPLOAD_TIMEOUT_TIME = 10 * 60 * 1000; // 10 minutes;
  private logger = new Logger(SharedStorageService.name);
  static RETRY_ERROR_CODES = [
    HttpStatus.REQUEST_TIMEOUT,
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpStatus.BAD_GATEWAY,
    HttpStatus.GATEWAY_TIMEOUT,
    HttpStatus.SERVICE_UNAVAILABLE,
    HttpStatus.TOO_MANY_REQUESTS,
    undefined,
    null,
  ];
  static NUM_RETRIES = 10;
  static MIN_TIMEOUT = 100; // 100 ms

  public constructor(
    @InjectS3() private readonly s3: S3,
    private configService: ConfigService,
  ) {
    this.BUCKET = configService.get('storage.bucket') || 'biosimdev';
    this.PUBLIC_ENDPOINT =
      configService.get('storage.publicEndpoint') ||
      'https://files-dev.biosimulations.org/s3/';
    s3.config.update({ region: 'us-east-1' });
  }

  public async listObjects(id: string): Promise<AWS.S3.ListObjectsOutput> {
    const call = this.retryS3<any>(async (): Promise<any> => {
      return this.s3.listObjects({ Bucket: this.BUCKET, Prefix: id }).promise();
    });

    const res = await call;

    if (res.$response.error) {
      throw res.$response.error.originalError;
    } else {
      return res;
    }
  }

  public async headObject(id: string): Promise<AWS.S3.HeadObjectOutput> {
    return await this.retryS3<any>(async (): Promise<any> => {
      return this.s3.headObject({ Bucket: this.BUCKET, Key: id }).promise();
    });
  }

  public async isObject(id: string): Promise<boolean> {
    const call = this.headObject(id);

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

  public async getObject(id: string): Promise<AWS.S3.GetObjectOutput> {
    const call = this.retryS3<any>(async (): Promise<any> => {
      return this.s3.getObject({ Bucket: this.BUCKET, Key: id }).promise();
    });

    const res = await call;

    if (res.$response.error) {
      console.error(res.$response.error.message);
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
    const zipStreamPromise = this.retryS3<any>(async (): Promise<any> => {
      return unzipper.Open.s3(this.s3, {
        Bucket: this.BUCKET,
        Key: zipFile,
      });
    });
    const zipStream = await zipStreamPromise;
    const promises: Promise<AWS.S3.ManagedUpload.SendData>[] =
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
    id: string,
    data: Buffer | Readable,
    isPrivate = false,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const acl = isPrivate ? 'private' : 'public-read';
    const request: AWS.S3.PutObjectRequest = {
      Key: id,
      Body: data,
      Bucket: this.BUCKET,
      ACL: acl,
    };

    const public_url = this.PUBLIC_ENDPOINT + id;
    const call = this.retryS3<any>(async (): Promise<any> => {
      return this.s3.upload(request).promise();
    });

    const timeoutErr = Symbol();

    try {
      const res = await this.timeout(
        call,
        this.S3_UPLOAD_TIMEOUT_TIME,
        timeoutErr,
      );
      res.Location = public_url;
      return res;
    } catch (err) {
      if (err === timeoutErr) {
        this.logger.error(
          `Timeout when uploading '${id}' to storage in ${this.S3_UPLOAD_TIMEOUT_TIME} ms.`,
        );
        throw new Error('Timeout when uploading file to storage.');
      } else {
        const details =
          err instanceof Error && err.message
            ? err?.message
            : `Error when uploading ${id} to storage.`;
        this.logger.error(details);

        const message =
          err instanceof Error && err.message
            ? err?.message
            : 'Error when uploading file to storage.';
        throw new Error(message);
      }
    }
  }

  public async deleteObject(id: string): Promise<AWS.S3.DeleteObjectOutput> {
    const call = this.retryS3<any>(async (): Promise<any> => {
      return this.s3.deleteObject({ Bucket: this.BUCKET, Key: id }).promise();
    });

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
        (_r, rej) => (timer = global.setTimeout(rej, time, exception)),
      ),
    ]).finally(() => clearTimeout(Number(timer))) as Promise<Type>;
  }

  private async retryS3<T>(func: () => Promise<T>): Promise<T> {
    return promiseRetry<T>(
      async (retry): Promise<T> => {
        return func().catch((error: any) => {
          if (
            SharedStorageService.RETRY_ERROR_CODES.includes(
              error.status || error.statusCode,
            )
          ) {
            retry(error);
          }
          throw error;
        });
      },
      {
        retries: SharedStorageService.NUM_RETRIES,
        minTimeout: SharedStorageService.MIN_TIMEOUT,
      },
    );
  }
}
