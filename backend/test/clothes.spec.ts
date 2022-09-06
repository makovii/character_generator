import * as request from 'supertest';
import { BASE_STRING } from '../src/constants';
import { faker } from '@faker-js/faker';

describe('registration-login user, login admin', () => {
  let adminToken = '';

  it('login admin', async () => {
    const { body } = await request(`${BASE_STRING}`).get('/auth/login').send({
      email: 'admin@gmail.com',
      phone: '',
      password: '1234',
    });

    adminToken = body.token;
    expect(body).toMatchObject({
      token: expect.any(String),
    });
  });

  it('get all clothes, update by id, create, delete clothes', async () => {
    const newClothes = {
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      strength: 2,
      agility: -1,
      endurance: -1,
      intellect: 0,
    };

    const resCreateClothes = await request(`${BASE_STRING}`)
      .post('/clothes')
      .send(newClothes)
      .set('Authorization', `bearer ${adminToken}`);

    expect(resCreateClothes.body).toMatchObject({
      isActive: true,
      id: expect.any(Number),
      ...newClothes,
    });
    const clothesId = resCreateClothes.body.id;

    const newDescription = faker.lorem.sentence();
    const resUpdateClothes = await request(`${BASE_STRING}`)
      .patch(`/clothes/${clothesId}`)
      .send({ description: newDescription })
      .set('Authorization', `bearer ${adminToken}`);

    expect(resUpdateClothes.body).toMatchObject({
      message: 'operation success',
    });

    const resGetAllClothes = await request(`${BASE_STRING}`)
      .get('/clothes')
      .set('Authorization', `bearer ${adminToken}`);

    expect(resGetAllClothes.body).not.toBeNull();
    expect(resGetAllClothes.body).not.toBe({ message: 'no access' });
    expect(resGetAllClothes.body).not.toBe([]);

    const clothesFromDB = resGetAllClothes.body.find(
      (item: { id: number }) => item.id === clothesId,
    );

    expect(clothesFromDB.description).toBe(newDescription);

    const resDeleteClothes = await request(`${BASE_STRING}`)
      .delete(`/clothes/${clothesId}`)
      .set('Authorization', `bearer ${adminToken}`);

    expect(resDeleteClothes.body).toMatchObject({
      message: 'operation success',
    });

    const resAfterDeleteClothes = await request(`${BASE_STRING}`)
      .get('/clothes')
      .set('Authorization', `bearer ${adminToken}`);

    expect(resAfterDeleteClothes.body).not.toBeNull();
    expect(resAfterDeleteClothes.body).not.toBe({ message: 'no access' });
    expect(resAfterDeleteClothes.body).not.toBe([]);

    const clothesAfterDelete = resAfterDeleteClothes.body.find(
      (item: { id: number }) => item.id === clothesId,
    );
    expect(clothesAfterDelete).toBe(undefined);
  });
});
