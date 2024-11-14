import type { CreateUserDto, GetUserByIdDto } from '@schemas/user.schema';
import type { FastifyInstance } from 'fastify';
import { setupTestServer } from 'tests/setup';
import { randomUUID } from 'crypto';

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

  it('should return 200 and successfully get user', async () => {
    const uniqueEmail = `${randomUUID()}@example.com`;
    const request: CreateUserDto = {
      email: uniqueEmail,
    };

    const createUserResponse = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

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
    expect(email).toBe(request.email);
    expect(consents).toEqual([]);
  });
});
