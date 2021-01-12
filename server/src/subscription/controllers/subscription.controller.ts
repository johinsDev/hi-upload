import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubscriptionResource } from '../resources/subscription.resource';
import SubscriptionService from '../services/subscription.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('/me')
  async me(): Promise<SubscriptionResource> {
    const subscription = await this.subscriptionService.subscription();

    return new SubscriptionResource(subscription);
  }
}
