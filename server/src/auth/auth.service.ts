import { Injectable } from '@nestjs/common';
import { RedisService } from '../cache/redis.service';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly redis: RedisService) {}
  async users(): Promise<User[]> {
    return this.redis.remember(
      'users4',
      async () =>
        await User.find({
          take: 100,
        }),
    );
  }
}
