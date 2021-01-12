import slugify from 'slugify';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Plan } from '../entities/plan.entity';

@EventSubscriber()
export class PlanSubscriber implements EntitySubscriberInterface<Plan> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Plan;
  }

  beforeInsert(event: InsertEvent<Plan>): void {
    event.entity.slug = slugify(event.entity.name, {
      replacement: '-',
      lower: true,
      strict: true,
    });
  }
}
