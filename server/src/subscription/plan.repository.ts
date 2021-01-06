import { EntityRepository, Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';

@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {
  activate(id: string): Promise<Plan> {
    return this.save({
      id,
      isActive: true,
    });
  }

  deactivate(id: string): Promise<Plan> {
    return this.save({
      id,
      isActive: true,
    });
  }
}
