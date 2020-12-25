import { User } from '../../auth/user.entity';
import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const email = faker.internet.email();

  const user = new User();
  user.name = `${firstName} ${lastName}`;
  user.email = email;
  user.password = '';
  return user;
});
