import { Injectable } from '@nestjs/common';

import { PlanRepository } from '../repositories/plan.repository';
import { Plan } from '../entities/plan.entity';

@Injectable()
export default class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}

  index(): Promise<Plan[]> {
    return this.planRepository
      .createQueryBuilder('plans')
      .leftJoinAndSelect('plans.features', 'features')
      .where('plans.isActive = true')
      .orderBy('plans.price', 'ASC')
      .getMany();
  }
}
