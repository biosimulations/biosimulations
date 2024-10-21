import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSError } from 'aws-sdk';
import { PassThrough, Readable } from 'stream';

import {
  DeleteObjectCommand,
  DeleteObjectOutput,
  GetObjectCommand,
  GetObjectOutput,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  HeadObjectOutput,
  ListObjectsCommand,
  ListObjectsOutput,
  PutObjectCommand,
  PutObjectOutput,
  PutObjectRequest,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class SharedStorageService {
  private BUCKET: string;

  private MAX_EGRESS_BYTES_PER_SEC = 4e9; // 4 Gbps (for e2-standard-2 machines as of 2/26/2022)
  private UPLOAD_CONCURRENCY = 8;
  private UPLOAD_TIMEOUT_SAFETY_FACTOR = 10;
  private client: S3Client;

  private logger = new Logger(SharedStorageService.name);

  public constructor(private configService: ConfigService) {
    this.BUCKET = configService.get('storage.bucket') || 'files.biosimulations.dev';
    this.client = new S3Client({
      credentials: {
        accessKeyId: configService.get('storage.accessKey') || '',
        secretAccessKey: configService.get('storage.secret') || '',
      },
      forcePathStyle: true,
      endpoint: this.configService.get('storage.endpoint'),
      region: this.configService.get('storage.region'),
      maxAttempts: 0,
    });
  }

  public async getObjectInfo(key: string): Promise<HeadObjectOutput> {
    return await this.client.send(new HeadObjectCommand({ Bucket: this.BUCKET, Key: key }));
  }

  public async listObjects(key: string): Promise<ListObjectsOutput> {
    return await this.client.send(new ListObjectsCommand({ Bucket: this.BUCKET, Prefix: key }));
  }

  public async isObject(key: string): Promise<boolean> {
    try {
      const headObjectOutput: HeadObjectCommandOutput = await this.client.send(
        new HeadObjectCommand({ Bucket: this.BUCKET, Key: key }),
      );
      return headObjectOutput.$metadata.httpStatusCode === HttpStatus.NOT_FOUND;
    } catch (error) {
      if ((error as AWSError).statusCode === HttpStatus.NOT_FOUND) {
        return false;
      } else {
        throw error;
      }
    }
  }

  public async getObject(key: string): Promise<GetObjectOutput> {
    try {
      return await this.client.send(new GetObjectCommand({ Bucket: this.BUCKET, Key: key }));
    } catch (error) {
      this.logger.error(`Object with key '${key}' could not be retrieved: ${error}`);
      throw error;
    }
  }

  public async putObject(
    key: string,
    data: Readable | Buffer,
    isPrivate = false,
    length: number,
  ): Promise<PutObjectOutput> {
    const acl = isPrivate ? 'private' : 'public-read';
    const timeoutMs = Math.max(this.calcS3UploadTimeOutMs(Math.max(length, 8 * 1e6)), 10 * 1e3);
    const body = Buffer.isBuffer(data) ? Readable.from(data) : data;
    const request: PutObjectRequest = {
      Key: key,
      Body: body,
      Bucket: this.BUCKET,
      ACL: acl,
      ContentLength: length,
    };

    const call = this.client.send(new PutObjectCommand(request), { requestTimeout: timeoutMs });

    if (isReadableStream(data)) {
      (data as Readable).pipe(request.Body as PassThrough);
    }

    return await call;
  }

  public async deleteObject(key: string): Promise<DeleteObjectOutput> {
    return this.client.send(new DeleteObjectCommand({ Bucket: this.BUCKET, Key: key }));
  }

  private calcS3UploadTimeOutMs(sizeBytes: number): number {
    return (
      (sizeBytes / (this.MAX_EGRESS_BYTES_PER_SEC / this.UPLOAD_CONCURRENCY)) * 1e3 * this.UPLOAD_TIMEOUT_SAFETY_FACTOR
    );
  }
}

export function isStream(stream: any): boolean {
  return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
}

export function isReadableStream(stream: any): boolean {
  return (
    isStream(stream) &&
    stream.readable !== false &&
    typeof stream._read === 'function' &&
    typeof stream._readableState === 'object'
  );
}
