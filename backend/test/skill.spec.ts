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

  it('get all skills, update by id, create, delete skill', async () => {
    const newSkill = {
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      strength: 2,
      agility: -1,
      endurance: -1,
      intellect: 0,
    };

    const resCreateSkill = await request(`${BASE_STRING}`)
      .post('/skill')
      .send(newSkill)
      .set('Authorization', `bearer ${adminToken}`);

    expect(resCreateSkill.body).toMatchObject({
      isActive: true,
      id: expect.any(Number),
      ...newSkill,
    });
    const skillId = resCreateSkill.body.id;

    const newDescription = faker.lorem.sentence();
    const resUpdateSkill = await request(`${BASE_STRING}`)
      .patch(`/skill/${skillId}`)
      .send({ description: newDescription })
      .set('Authorization', `bearer ${adminToken}`);

    expect(resUpdateSkill.body).toMatchObject({
      message: 'operation success',
    });

    const resGetAllSkill = await request(`${BASE_STRING}`)
      .get('/skill')
      .set('Authorization', `bearer ${adminToken}`);

    expect(resGetAllSkill.body).not.toBeNull();
    expect(resGetAllSkill.body).not.toBe({ message: 'no access' });
    expect(resGetAllSkill.body).not.toBe([]);

    const skillFromDB = resGetAllSkill.body.find(
      (item: { id: number }) => item.id === skillId,
    );

    expect(skillFromDB.description).toBe(newDescription);

    const resDeleteSkill = await request(`${BASE_STRING}`)
      .delete(`/skill/${skillId}`)
      .set('Authorization', `bearer ${adminToken}`);

    expect(resDeleteSkill.body).toMatchObject({
      message: 'operation success',
    });

    const resAfterDeleteSkill = await request(`${BASE_STRING}`)
      .get('/skill')
      .set('Authorization', `bearer ${adminToken}`);

    expect(resAfterDeleteSkill.body).not.toBeNull();
    expect(resAfterDeleteSkill.body).not.toBe({ message: 'no access' });
    expect(resAfterDeleteSkill.body).not.toBe([]);

    const skillAfterDelete = resAfterDeleteSkill.body.find(
      (item: { id: number }) => item.id === skillId,
    );
    expect(skillAfterDelete).toBe(undefined);
  });
});
