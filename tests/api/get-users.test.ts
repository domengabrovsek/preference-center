import { randomUUID } from 'crypto';
import type { FastifyInstance } from 'fastify';
import { setupTestServer } from 'tests/setup';

let app: FastifyInstance;
const url = '/api/v1/users';

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await app.close();
});

describe('Get users tests', () => {
  it('should return 200 and successfully get users', async () => {
    await app.inject({
      method: 'POST',
      url,
      payload: {
        email: `${randomUUID()}@example.com`,
      },
    });

    await app.inject({
      method: 'POST',
      url,
      payload: {
        email: `${randomUUID()}@example.com`,
      },
    });

    const getUsersResponse = await app.inject({
      method: 'get',
      url,
    });

    const users = JSON.parse(getUsersResponse.body);

    expect(getUsersResponse.statusCode).toBe(200);
    expect(users.length).toBeGreaterThanOrEqual(2);
  });
});
