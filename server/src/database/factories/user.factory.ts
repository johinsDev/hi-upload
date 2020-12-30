import { User } from '../../auth/user.entity';
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const email = faker.internet.email();

  const user = new User();
  user.name = `${firstName} ${lastName}`;
  user.email = email;
  user.password = bcrypt.hashSync('123456', 10);
  return user;
});
