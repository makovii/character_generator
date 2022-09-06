import * as path from 'path';
import * as request from 'supertest';
import { BASE_STRING } from '../src/constants';
import { generateUser } from './generateUser';

describe('upload-get image', () => {
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

  it('registration-login-get page-patch clothes user', async () => {
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

    const newImage = await request(`${BASE_STRING}`)
      .post('/character/image')
      .set('Authorization', `bearer ${userToken}`)
      .attach('image', path.resolve(__dirname, './okay.jpg'));

    expect(newImage.body).toMatchObject({
      message: 'operation success',
    });

    const newPlayerFromDB = (
      await request(`${BASE_STRING}`)
        .get('/character')
        .set('Authorization', `bearer ${userToken}`)
    ).body;

    expect(newPlayerFromDB.pathPhoto).toBeDefined();
    expect(newPlayerFromDB.pathPhoto).not.toBeNull;

    const getImage = await request(`${BASE_STRING}`)
      .get('/character/image')
      .set('Authorization', `bearer ${userToken}`);

    expect(getImage.text).toBe(`${BASE_STRING}/${newPlayerFromDB.pathPhoto}`);
  });
});
