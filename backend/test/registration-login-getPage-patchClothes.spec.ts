import * as request from 'supertest';
import { BASE_STRING } from '../src/constants';
import { generateUser } from './generateUser';

describe('registration-login user, login admin', () => {
  let adminToken = '';
  let userToken = '';

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

  it('registration-login-get page - patch clothes user', async () => {
    const newUser = generateUser();

    await request(`${BASE_STRING}`).post('/auth/registration').send(newUser);

    const candidate = await request(`${BASE_STRING}`)
      .get('/user/getCandidate')
      .set('Authorization', `bearer ${adminToken}`)
      .send({ phone: newUser.phone });

    await request(`${BASE_STRING}`).post('/auth/confirmPhone').send({
      name: newUser.name,
      phone: newUser.phone,
      code: candidate.body.code,
    });

    const resLogin = await request(`${BASE_STRING}`).get('/auth/login').send({
      email: '',
      phone: newUser.phone,
      password: newUser.password,
    });

    userToken = resLogin.body.token;
    expect(resLogin.body).toMatchObject({
      token: expect.any(String),
    });

    const resGetPage = await request(`${BASE_STRING}`)
      .get('/character')
      .set('Authorization', `bearer ${userToken}`);

    expect(resGetPage.body).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      strength: expect.any(Number),
      agility: expect.any(Number),
      endurance: expect.any(Number),
      intellect: expect.any(Number),
    });

    const resEditFeature = await request(`${BASE_STRING}`)
      .patch('/character/characteristics')
      .set('Authorization', `bearer ${userToken}`)
      .send({
        clothes: [1, 2],
        skills: [],
        subjects: [],
      });

    expect(resEditFeature.body).toMatchObject({
      message: 'operation failed',
    });

    const resInsertOpenedClothes = await request(`${BASE_STRING}`)
      .post('/user/insert/openedClothes')
      .set('Authorization', `bearer ${adminToken}`)
      .send({ id: resGetPage.body.id, clothesId: [1, 2, 3, 4] });

    expect(resInsertOpenedClothes.body).toMatchObject({
      message: 'operation success',
    });

    const resEditFeature2 = await request(`${BASE_STRING}`)
      .patch('/character/characteristics')
      .set('Authorization', `bearer ${userToken}`)
      .send({
        clothes: [1, 2],
        skills: [],
        subjects: [],
      });

    expect(resEditFeature2.body).toMatchObject({
      message: 'operation success',
    });
  });
});
