import {
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/user.entity';
import { Subscription } from '../entities/subscription.entity';
import SubscriptionService from '../services/subscription.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // @Post()
  // async store(): Promise<Subscription> {
  //   return this.subscriptionService.create();
  // }

  @Patch('swap')
  async swap(): Promise<any> {
    return this.subscriptionService.canUseFeature('storage');
  }
}
