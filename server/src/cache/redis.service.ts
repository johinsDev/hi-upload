import { Inject, Injectable } from '@nestjs/common';
import IORedis, { KeyType, ValueType, Ok } from 'ioredis';

export interface CacheInterface {
  get(key: KeyType): Promise<any>;
  put(key: KeyType, value: ValueType, minutes?: number): Promise<Ok>;
  forever(key: KeyType, value: ValueType): Promise<Ok>;
  remember(
    key: KeyType,
    cb: () => Promise<any>,
    minutes?: number,
  ): Promise<any>;
  forget(key: KeyType): Promise<number>;
}

@Injectable()
export class RedisService implements CacheInterface {
  constructor(@Inject('client') private readonly client: IORedis.Redis) {}

  async get(key: KeyType): Promise<any> {
    const value = await this.client.get(key);

    if (value) {
      return JSON.parse(value);
    }

    return value;
  }

  put(key: KeyType, value: ValueType, minutes?: number): Promise<Ok> {
    minutes = minutes ?? null;

    if (minutes === null) {
      return this.forever(key, value);
    }

    return this.client.setex(
      key,
      Number(Math.max(1, minutes) * 60),
      JSON.stringify(value),
    );
  }

  forever(key: KeyType, value: ValueType): Promise<Ok> {
    return this.client.set(key, JSON.stringify(value));
  }

  async remember(
    key: KeyType,
    cb: () => Promise<any>,
    minutes?: number,
  ): Promise<any> {
    const value = await this.get(key);

    if (value !== null) {
      return value;
    }

    const newValue = await cb();

    this.put(key, JSON.stringify(newValue), minutes);

    return newValue;
  }

  forget(key: KeyType): Promise<number> {
    return this.client.del(key);
  }
}
