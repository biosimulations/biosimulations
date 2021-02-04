import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import * as AWS from 'aws-sdk';
@Injectable()
export class SharedStorageService {
  private BUCKET: string;
  public constructor(
    @InjectS3() private readonly s3: S3,
    configService: ConfigService,
  ) {
    this.BUCKET = configService.get('storage.bucket') || 'biosimdev';
    this.s3.config;
  }

  public async getBuckets(): Promise<AWS.S3.ListBucketsOutput> {
    const res = await this.s3.listBuckets().promise();
    const data = res.$response.data;
    if (!data || res.$response.error) {
      throw new Error(
        JSON.stringify(res.$response?.error) ?? ' Error Fetching Data',
      );
    } else {
      return data;
    }
  }
}
