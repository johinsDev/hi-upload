import { User } from '../../auth/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)({ roles: [] }).createMany(10000);
  }
}
