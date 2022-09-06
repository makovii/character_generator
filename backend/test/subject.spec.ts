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

  it('get all subjects, update by id, create, delete subjects', async () => {
    const newSubject = {
      name: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      strength: 2,
      agility: -1,
      endurance: -1,
      intellect: 0,
    };

    const resCreateSubject = await request(`${BASE_STRING}`)
      .post('/subject')
      .send(newSubject)
      .set('Authorization', `bearer ${adminToken}`);

    expect(resCreateSubject.body).toMatchObject({
      isActive: true,
      id: expect.any(Number),
      ...newSubject,
    });
    const subjectId = resCreateSubject.body.id;

    const newDescription = faker.lorem.sentence();
    const resUpdateSubject = await request(`${BASE_STRING}`)
      .patch(`/subject/${subjectId}`)
      .send({ description: newDescription })
      .set('Authorization', `bearer ${adminToken}`);

    expect(resUpdateSubject.body).toMatchObject({
      message: 'operation success',
    });

    const resGetAllSubjects = await request(`${BASE_STRING}`)
      .get('/subject')
      .set('Authorization', `bearer ${adminToken}`);

    expect(resGetAllSubjects.body).not.toBeNull();
    expect(resGetAllSubjects.body).not.toBe({ message: 'no access' });
    expect(resGetAllSubjects.body).not.toBe([]);

    const subjectFromDB = resGetAllSubjects.body.find(
      (item: { id: number }) => item.id === subjectId,
    );

    expect(subjectFromDB.description).toBe(newDescription);

    const resDeleteSubject = await request(`${BASE_STRING}`)
      .delete(`/subject/${subjectId}`)
      .set('Authorization', `bearer ${adminToken}`);

    expect(resDeleteSubject.body).toMatchObject({
      message: 'operation success',
    });

    const resAfterDeleteSubject = await request(`${BASE_STRING}`)
      .get('/subject')
      .set('Authorization', `bearer ${adminToken}`);

    expect(resAfterDeleteSubject.body).not.toBeNull();
    expect(resAfterDeleteSubject.body).not.toBe({ message: 'no access' });
    expect(resAfterDeleteSubject.body).not.toBe([]);

    const subjectAfterDelete = resAfterDeleteSubject.body.find(
      (item: { id: number }) => item.id === subjectId,
    );
    expect(subjectAfterDelete).toBe(undefined);
  });
});
