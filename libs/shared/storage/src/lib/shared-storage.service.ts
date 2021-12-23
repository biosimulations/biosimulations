import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk';
import { Readable } from 'stream';
import unzipper from 'unzipper';
@Injectable()
export class SharedStorageService {
  private BUCKET: string;
  private PUBLIC_ENDPOINT: string;
  private S3_UPLOAD_TIMEOUT_TIME = 60000;
  private logger = new Logger(SharedStorageService.name);
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

  public async isObject(id: string): Promise<boolean> {
    const call = this.s3.headObject({ Bucket: this.BUCKET, Key: id }).promise();

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
    const call = this.s3.getObject({ Bucket: this.BUCKET, Key: id }).promise();

    const res = await call;

    if (res.$response.error) {
      console.log(res.$response.error.message);
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
    const zipStream = await unzipper.Open.s3(this.s3, {
      Bucket: this.BUCKET,
      Key: zipFile,
    });
    const promises: Promise<AWS.S3.ManagedUpload.SendData>[] = [];
    for await (const entry of zipStream.files) {
      const type = entry.type;
      if (type === 'File') {
        const fileName = entry.path;
        const s3Path = `${destination}/${fileName}`;
        const upload = this.putObject(s3Path, entry.stream(), isPrivate);
        promises.push(upload);
      }
    }
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
    const call = this.s3.upload(request);
    const timeoutErr = Symbol();

    try {
      const res = await this.timeout(
        call.promise(),
        this.S3_UPLOAD_TIMEOUT_TIME,
        timeoutErr,
      );
      res.Location = public_url;
      return res;
    } catch (err) {
      if (err === timeoutErr) {
        this.logger.error(`Timeout when uploading '${id}' to storage in ${this.S3_UPLOAD_TIMEOUT_TIME} ms.`)
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
    const call = this.s3
      .deleteObject({ Bucket: this.BUCKET, Key: id })
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
        (_r, rej) => (timer = global.setTimeout(rej, time, exception)),
      ),
    ]).finally(() => clearTimeout(Number(timer))) as Promise<Type>;
  }
}
