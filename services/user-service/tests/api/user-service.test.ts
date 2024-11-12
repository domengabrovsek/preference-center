import type { CreateUserDto } from '@schemas/user.schema';
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

describe('User service tests', () => {
  it('should return 422 if email is an empty string', async () => {
    const request: CreateUserDto = {
      email: '',
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if email is not defined', async () => {
    const request = {};

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if email is not valid', async () => {
    const request: CreateUserDto = {
      email: 'example.com',
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if user already exists', async () => {
    const uniqueEmail = `${randomUUID()}@example.com`;

    const request: CreateUserDto = {
      email: uniqueEmail,
    };

    const firstRequest = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    const secondRequest = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(firstRequest.statusCode).toBe(201);
    expect(secondRequest.statusCode).toBe(422);
  });

  it('should return 500 if database throws an unexpected error', async () => {
    vi.spyOn(app.pg.pool, 'query').mockRejectedValueOnce(() => {
      new Error('Unexpected error');
    });

    const uniqueEmail = `${randomUUID()}@example.com`;

    const request: CreateUserDto = {
      email: uniqueEmail,
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(500);
  });

  it('should return 201 and successfully create a new user', async () => {
    const uniqueEmail = `${randomUUID()}@example.com`;

    const request: CreateUserDto = {
      email: uniqueEmail,
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(201);
  });
});
