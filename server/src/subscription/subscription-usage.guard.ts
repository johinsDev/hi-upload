import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import SubscriptionService from './services/subscription.service';

@Injectable()
export class SubscriptionUsageGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async canActivate(
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const feature = this.reflector.get<string>('feature', context.getHandler());

    if (!feature) {
      return false;
    }

    if (await this.subscriptionService.canUseFeature(feature)) {
      return true;
    }

    throw new HttpException(
      'No puedes hacer uso del feature ' + feature,
      HttpStatus.FORBIDDEN,
    );
  }
}
