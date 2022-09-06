import * as request from 'supertest';
import { BASE_STRING } from '../src/constants';
import { generateUser } from './generateUser';

describe('character', () => {
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

  it('registration-login-get page, edit character', async () => {
    const newUser = generateUser();
    const userForChangeName = generateUser();

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

    const description = `description about ${userForChangeName.name}`;
    const resEditCharacter = await request(`${BASE_STRING}`)
      .patch('/character')
      .send({
        name: userForChangeName.name,
        description: description,
      })
      .set('Authorization', `bearer ${userToken}`);

    expect(resEditCharacter.body).toMatchObject({
      message: 'operation success',
    });

    const resGetPageAfterChange = await request(`${BASE_STRING}`)
      .get('/character')
      .set('Authorization', `bearer ${userToken}`);

    expect(resGetPageAfterChange.body).toMatchObject({
      id: expect.any(Number),
      name: userForChangeName.name,
      description: description,
      strength: expect.any(Number),
      agility: expect.any(Number),
      endurance: expect.any(Number),
      intellect: expect.any(Number),
    });
  });

  it('get one/all character(s)', async () => {
    const resGetAllCharacters = await request(`${BASE_STRING}`)
      .get('/character/all')
      .set('Authorization', `bearer ${adminToken}`);

    expect(resGetAllCharacters.body).not.toBeNull();
    expect(resGetAllCharacters.body).not.toBe({ message: 'no access' });
    expect(resGetAllCharacters.body).not.toBe([]);

    const idCharacter = resGetAllCharacters.body[0].id;
    const resGetOneCharacters = await request(`${BASE_STRING}`)
      .get('/character/admin')
      .send({ id: idCharacter })
      .set('Authorization', `bearer ${adminToken}`);

    expect(resGetOneCharacters.body).toMatchObject({
      id: idCharacter,
      name: expect.any(String),
      strength: expect.any(Number),
      agility: expect.any(Number),
      endurance: expect.any(Number),
      intellect: expect.any(Number),
    });
  });
});
