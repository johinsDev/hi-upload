import { JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClientConfiguration } from 'aws-sdk/clients/s3';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (): {
  jwt: JwtModuleOptions;
  port: number;
  database: TypeOrmModuleOptions;
  s3: ClientConfiguration & { bucket?: string };
} => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connection: process.env.DB_CONNECTION || 'postgres',
  } as TypeOrmModuleOptions,
  jwt: {
    secret: process.env.jWT_SECRET || 'myHArdSecret',
    signOptions: {
      expiresIn: process.env.jWT_EXPIRE_IN || '15d',
    },
  },
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
    bucket: process.env.AWS_BUCKET,
  },
});
