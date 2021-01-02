import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

export interface Response {
  raw: unknown;
}

export interface SignedUrlOptions {
  expiry?: number;
}

export interface SignedUrlResponse extends Response {
  signedUrl: string;
}

@Injectable()
export default class S3Service {
  protected $driver: S3;
  protected $bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.$driver = new S3({
      accessKeyId: this.configService.get('s3.accessKeyId'),
      secretAccessKey: this.configService.get('s3.secretAccessKey'),
      region: this.configService.get('s3.region'),
    });

    this.$bucket = this.configService.get('s3.bucket');
  }

  public async getSignedUrl(
    location: string,
    options: SignedUrlOptions = {},
  ): Promise<S3.PresignedPost> {
    const { expiry = 900 } = options;

    try {
      const params = {
        Fields: {
          'Content-Type': `image/${location.split('.')?.[1]}`,
          key: location,
        },
        Bucket: this.$bucket,
        Expires: expiry,
        Conditions: [['content-length-range', 100, 10000000]],
      };
      // console.log(await this.$driver.getSignedUrlPromise('putObject', params));

      return this.$driver.createPresignedPost(params);
    } catch (e) {
      console.log(e);

      // throw handleError(e, location, this.$bucket);
    }
  }
}
