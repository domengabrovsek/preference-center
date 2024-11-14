import type { CreateUserDto, GetUserByIdDto } from '@schemas/user.schema';
import type { FastifyInstance } from 'fastify';
import { setupTestServer } from 'tests/setup';
import { randomUUID } from 'crypto';
import type { CreateConsentEventDto } from '@schemas/consent.schema';

let app: FastifyInstance;
const url = '/api/v1/users';

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await app.close();
});

describe('Get user tests', () => {
  it('should return 404 if user does not exist', async () => {
    const request: GetUserByIdDto = {
      id: randomUUID(),
    };

    const response = await app.inject({
      method: 'get',
      url: `${url}/${request.id}`,
      payload: request,
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 422 if user id not in correct format', async () => {
    const request: GetUserByIdDto = {
      id: '123',
    };

    const response = await app.inject({
      method: 'get',
      url: `${url}/${request.id}`,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 200 and successfully get user with empty consents', async () => {
    // create user
    const createUserRequest: CreateUserDto = {
      email: `${randomUUID()}@example.com`,
    };

    const createUserResponse = await app.inject({
      method: 'POST',
      url,
      payload: createUserRequest,
    });

    // get user
    const getUserRequest: GetUserByIdDto = { id: JSON.parse(createUserResponse.body).id };
    const getUserResponse = await app.inject({
      method: 'get',
      url: `${url}/${getUserRequest.id}`,
      payload: getUserRequest,
    });

    const { id, email, consents } = JSON.parse(getUserResponse.body);

    expect(createUserResponse.statusCode).toBe(201);
    expect(getUserResponse.statusCode).toBe(200);
    expect(id).toBe(getUserRequest.id);
    expect(email).toBe(createUserRequest.email);
    expect(consents).toEqual([]);
  });

  it('should return 200 and successfully get user with consents', async () => {
    // create user
    const createUserRequest: CreateUserDto = {
      email: `${randomUUID()}@example.com`,
    };

    const createUserResponse = await app.inject({
      method: 'POST',
      url,
      payload: createUserRequest,
    });

    // create consent event
    const createConsentEventRequest: CreateConsentEventDto = {
      user: { id: JSON.parse(createUserResponse.body).id },
      consents: {
        email_notifications: true,
        sms_notifications: true,
      },
    };

    await app.inject({
      method: 'POST',
      url: '/api/v1/events',
      payload: createConsentEventRequest,
    });

    // get user
    const getUserRequest: GetUserByIdDto = { id: JSON.parse(createUserResponse.body).id };
    const getUserResponse = await app.inject({
      method: 'get',
      url: `${url}/${getUserRequest.id}`,
      payload: getUserRequest,
    });

    const { id, email, consents } = JSON.parse(getUserResponse.body);

    expect(createUserResponse.statusCode).toBe(201);
    expect(getUserResponse.statusCode).toBe(200);
    expect(id).toBe(getUserRequest.id);
    expect(email).toBe(createUserRequest.email);
    expect(consents).toContainEqual({ id: 'email_notifications', enabled: true });
    expect(consents).toContainEqual({ id: 'sms_notifications', enabled: true });
  });

  it('should return 200 and successfully get user with consents (multiple consent events)', async () => {
    // create user
    const createUserRequest: CreateUserDto = {
      email: `${randomUUID()}@example.com`,
    };

    const createUserResponse = await app.inject({
      method: 'POST',
      url,
      payload: createUserRequest,
    });

    // create first consent event
    const createConsentEventRequest: CreateConsentEventDto = {
      user: { id: JSON.parse(createUserResponse.body).id },
      consents: {
        email_notifications: false,
        sms_notifications: false,
      },
    };

    await app.inject({
      method: 'POST',
      url: '/api/v1/events',
      payload: createConsentEventRequest,
    });

    // create second consent event
    const createConsentEventRequest2: CreateConsentEventDto = {
      user: { id: JSON.parse(createUserResponse.body).id },
      consents: {
        email_notifications: true,
        sms_notifications: false,
      },
    };

    await app.inject({
      method: 'POST',
      url: '/api/v1/events',
      payload: createConsentEventRequest2,
    });

    // create third consent event
    const createConsentEventRequest3: CreateConsentEventDto = {
      user: { id: JSON.parse(createUserResponse.body).id },
      consents: {
        email_notifications: true,
        sms_notifications: true,
      },
    };

    await app.inject({
      method: 'POST',
      url: '/api/v1/events',
      payload: createConsentEventRequest3,
    });

    // get user
    const getUserRequest: GetUserByIdDto = { id: JSON.parse(createUserResponse.body).id };
    const getUserResponse = await app.inject({
      method: 'get',
      url: `${url}/${getUserRequest.id}`,
      payload: getUserRequest,
    });

    const { id, email, consents } = JSON.parse(getUserResponse.body);

    expect(createUserResponse.statusCode).toBe(201);
    expect(getUserResponse.statusCode).toBe(200);
    expect(id).toBe(getUserRequest.id);
    expect(email).toBe(createUserRequest.email);
    expect(consents).toContainEqual({ id: 'email_notifications', enabled: true });
    expect(consents).toContainEqual({ id: 'sms_notifications', enabled: true });
  });
});
