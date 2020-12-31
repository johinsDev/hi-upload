import * as Faker from 'faker';
import { User } from '../../auth/user.entity';
import { define, factory } from 'typeorm-seeding';
import { File } from '../../files/file.entity';

define(File, (faker: typeof Faker) => {
  const file = new File();
  file.name = faker.lorem.word() + '.jgp';
  file.path = 'files/' + faker.lorem.word() + '.jgp';
  file.size = 500000;
  file.user = factory(User)() as any;
  return file;
});
