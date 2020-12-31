import { Factory, Seeder } from 'typeorm-seeding';
import { File } from '../../files/file.entity';

export default class CreateFiles implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(File)().createMany(10);
  }
}
