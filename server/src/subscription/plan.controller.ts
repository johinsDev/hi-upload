import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Plan } from './entities/plan.entity';
import PlanService from './plan.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get(':id')
  async find(@Param('id') id: string): Promise<Plan> {
    return this.planService.find(id);
  }

  @Get()
  async index(): Promise<Plan[]> {
    return this.planService.getAll();
  }

  @Post()
  async store(): Promise<Plan> {
    return this.planService.create();
  }
}
