import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk';
@Injectable()
export class SharedStorageService {
  private BUCKET: string;
  public constructor(
    @InjectS3() private readonly s3: S3,
    private configService: ConfigService,
  ) {
    this.BUCKET = configService.get('storage.bucket') || 'biosimdev';
  }

  public async getBuckets(): Promise<AWS.S3.ListBucketsOutput> {
    return await this.loadObject('Bertozzi2020.omex');
  }
  public async loadObject(id) {
    const res = await this.s3
      .getObject({ Bucket: this.BUCKET, Key: id })
      .promise();
    if (res.$response.error) {
      console.log(res.$response.error.message);
    } else {
      return res.$response.data;
    }
  }
}
