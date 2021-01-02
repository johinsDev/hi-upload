import { Injectable } from '@nestjs/common';
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

  constructor() {
    this.$driver = new S3({
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
    });

    this.$bucket = '';
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
