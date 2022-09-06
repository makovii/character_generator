import { faker } from '@faker-js/faker';

export const generateUser = (): {
  name: string;
  //email: string;
  phone: string;
  password: string;
} => ({
  name: faker.name.firstName(),
  //email: faker.internet.email(),
  phone: faker.phone.number(),
  password: '1234',
});
