import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import * as AWS from 'aws-sdk';

@Injectable()
export class SharedStorageService {
  private BUCKET: string;
  public constructor(
    @InjectS3() private readonly s3: S3,
    private configService: ConfigService,
  ) {
    this.BUCKET = configService.get('storage.bucket') || 'biosimdev';
    s3.config.update({region:"us-east-1"})
  }
  
  public async getObject(id: string): Promise<AWS.S3.GetObjectOutput> {
    const call =  this.s3
      .getObject({ Bucket: this.BUCKET, Key: id })
      .promise();

    const res = await call

    if (res.$response.error) {
      console.log(res.$response.error.message);
      throw res.$response.error.originalError
    } else {
      return res
    }
  }
}
