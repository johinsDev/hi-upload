import { DynamicModule, Global, Module, ModuleMetadata } from '@nestjs/common';
import IORedis, { RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
}

// useClass useEXisting, forRoot, dynamic token name by connection
// inject by interface
// create memory cache
// Manager cache

@Global()
@Module({})
export class RedisModule {
  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          provide: 'OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: 'client',
          useFactory(redisOptions: RedisOptions): IORedis.Redis {
            return new IORedis(redisOptions);
          },
          inject: ['OPTIONS'],
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
