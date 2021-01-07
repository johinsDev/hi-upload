import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './files/file.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RedisModule } from './cache/redis.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

// filter for response all with data
// compression
// helmet
// csrf
// rate limiting
// terminus
// docker
// docker-compose

// auth 2fa
// auth social
// auth email, verification
// auth phone, verification
// storage
// swagger
// class-validator --> database validators
// queue
// notification
// mailer
// sms
// rate limiting
// i18n
// i18n models
// cron
// excel, pdf, sharp, omnipay
// audit, role, supcriptions
// locust, jest, sonarQube, continuos deployment aws, terraform
// terraform all servies on aws
// cache typeorm with redis
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('database.connection'),
          host: configService.get('database.host'),
          port: +configService.get<number>('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          logging: false,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          host: '127.0.0.1',
          port: 6379,
        };
      },
    }),
    AuthModule,
    FileModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
