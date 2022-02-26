import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk';
import { Readable, PassThrough } from 'stream';
import unzipper, { File } from 'unzipper';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import pLimit from 'p-limit';

interface ResolvedSendData {
  fileName: string;
  value?: AWS.S3.ManagedUpload.SendData;
  error?: any;
}

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

  private BUCKET: string;

  private S3_CONNECTION_TIMEOUT_TIME_MS = 2 * 1000; // 2 seconds

  private MAX_FILE_SIZE_BYTES = 1e10 * 8; // 10 Gigabytes
  private MAX_EGRESS_BYTES_PER_SEC = 4e9; // 4 Gbps (for e2-standard-2 machines as of 2/26/2022)
  private EXTRACTION_CONCURRENCY = 8;
  private UPLOAD_TIMEOUT_SAFETY_FACTOR = 10;

  private calcS3UploadTimeOutMs(sizeBytes: number): number {
    return (
      sizeBytes
      / (this.MAX_EGRESS_BYTES_PER_SEC / this.EXTRACTION_CONCURRENCY)
      * 1e3
      * this.UPLOAD_TIMEOUT_SAFETY_FACTOR
    );
  }
    
  private logger = new Logger(SharedStorageService.name);

  public constructor(
    @InjectS3() private readonly s3Get: S3,
    private configService: ConfigService,
  ) {
    this.BUCKET =
      configService.get('storage.bucket') || 'files.biosimulations.dev';
    s3Get.config.update({ region: configService.get('storage.region') }); // has to be set here because the NestJS wrapper doesn't appear to correctly set this
  }

  public getObjectUrl(key: string): string {
    const url = this.s3Get.getSignedUrl('headObject', {
      Bucket: this.BUCKET,
      Key: key,
    });
    return url.split('?')[0];
  }

  public async getObjectInfo(key: string): Promise<AWS.S3.HeadObjectOutput> {
    const call = this.s3Get
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
    const call = this.s3Get
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
    const call = this.s3Get
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
    const call = this.s3Get.getObject({ Bucket: this.BUCKET, Key: key }).promise();

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
    const zipStreamPromise = unzipper.Open.s3(this.s3Get, {
      Bucket: this.BUCKET,
      Key: zipFile,
    });

    const zipStream = await zipStreamPromise;
    const files = zipStream.files
      .filter((entry: File): boolean => {
        return entry.type === 'File';
      });

    const promiseLimit = pLimit(this.EXTRACTION_CONCURRENCY);
    const promises: Promise<ResolvedSendData>[] =
      files
        .map((entry: File, iEntry: number): Promise<ResolvedSendData> => {
          return promiseLimit(() => {
            if (iEntry % 25 === 0) {
              this.logger.debug(`Uploading file ${iEntry + 1} of ${files.length} for '${destination}': '${entry.path}'`);
            }
            return this.uploadExtractedZipFile(destination, entry, isPrivate);
          });
        },
      );
    const resolvedPromises = await Promise.all(promises);

    const failedPromises = resolvedPromises.flatMap(
      (resolvedPromise: ResolvedSendData): ResolvedSendData[] => {
        if (resolvedPromise?.error !== undefined) {
          return [resolvedPromise];
        } else {
          return [];
        }
      });
    if (failedPromises.length) {
      const msgs = failedPromises.map((resolvedPromise: ResolvedSendData): string => {
        this.logger.error(resolvedPromise.error)
        return `{resolvedPromise.fileName}: {resolvedPromise.error}`;
      });
      throw new BiosimulationsException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Files could not be saved',
          `{failedPromises.length} files could not be saved:\n  - {msgs.join('\n  - ')}`,
        );
    }

    return resolvedPromises.flatMap(
      (resolvedPromise: ResolvedSendData): AWS.S3.ManagedUpload.SendData[] => {
        if (resolvedPromise?.value !== undefined) {
          return [resolvedPromise.value];
        } else {
          return [];
        }
      });
  }

  private async uploadExtractedZipFile(destination: string, entry: File, isPrivate: boolean): Promise<ResolvedSendData> {
    const fileName = entry.path;
    const s3Path = `${destination}/${fileName}`;
    const upload = await this.putObject(s3Path, entry.stream(), isPrivate, entry.uncompressedSize)
      .then((value: AWS.S3.ManagedUpload.SendData): ResolvedSendData => {
        return {
          fileName,
          value,
        };
      })
      .catch((error: any): ResolvedSendData => {
        this.logger.error(`${s3Path} could not be uploaded: ${error}`);
        return {
          fileName,
          error,
        }
      });
    return upload;
  }

  public async putObject(
    key: string,
    data: Buffer | Readable,
    isPrivate = false,
    length: number,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const acl = isPrivate ? 'private' : 'public-read';
    const request: AWS.S3.PutObjectRequest = {
      Key: key,
      Body: isReadableStream(data) ? new PassThrough() : data,
      Bucket: this.BUCKET,
      ACL: acl,
    };

    const timeoutMs = Math.max(this.calcS3UploadTimeOutMs(Math.max(length, 8 * 1e6)), 10 * 1e3);    

    const s3Post = new AWS.S3({
      credentials: {
        accessKeyId: this.configService.get('storage.accessKey') || '',
        secretAccessKey: this.configService.get('storage.secret') || '',
      },
      endpoint: this.configService.get('storage.endpoint'),
      region: this.configService.get('storage.region'),
      s3ForcePathStyle: true,
      maxRetries: 0,
      httpOptions: {
        connectTimeout: this.S3_CONNECTION_TIMEOUT_TIME_MS, // time to wait for starting the call
        timeout: timeoutMs, // time to wait for a response
      },
    });

    const call = s3Post.upload(request).promise();
    if (isReadableStream(data)) {
      (data as Readable).pipe(request.Body as PassThrough);
    }

    const res = await call;
    return res;
  }

  public async deleteObject(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const call = this.s3Get
      .deleteObject({ Bucket: this.BUCKET, Key: key })
      .promise();

    const res = await call;

    if (res.$response.error) {
      throw res.$response.error.originalError;
    } else {
      return res;
    }
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
