import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions & { seeds: string[]; factories: string[] } = {
  type: process.env.DB_CONNECTION as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  seeds: [__dirname + '/database/seeds/*{.ts,.js}'],
  factories: [__dirname + '/database/factories/*{.ts,.js}'],
  cli: {
    migrationsDir: './src/database/migrations',
  },
};

export = config;
