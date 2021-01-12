import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { PlanResource } from '../resources/plan.resource';
import PlanService from '../services/plan.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async index(): Promise<PlanResource[]> {
    const plans = await this.planService.index();

    return plans.map(p => new PlanResource(p));
  }
}
