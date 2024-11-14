import type { CreateConsentEventDto, GetConsentEventsDto } from '@schemas/consent.schema';
import type { FastifyInstance } from 'fastify';
import { setupTestServer } from 'tests/setup';
import { randomUUID } from 'crypto';
import type { CreateUserDto } from '@schemas/user.schema';
import type { ConsentEventHistory } from '@models/consent';

let app: FastifyInstance;
const url = '/api/v1/events';

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await app.close();
});

describe('Get consent event history tests', () => {
  it('should return 201 and successfully create a consent event', async () => {
    // create a user
    const createUserRequest: CreateUserDto = {
      email: `${randomUUID()}@example.com`,
    };

    const userResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: createUserRequest,
    });

    // create first consent event
    const createConsentEventRequest: CreateConsentEventDto = {
      user: {
        id: JSON.parse(userResponse.body).id,
      },
      consents: {
        email_notifications: true,
        sms_notifications: false,
      },
    };

    await app.inject({
      method: 'POST',
      url,
      payload: createConsentEventRequest,
    });

    // create second consent event
    const createConsentEventRequest2: CreateConsentEventDto = {
      user: {
        id: JSON.parse(userResponse.body).id,
      },
      consents: {
        email_notifications: true,
        sms_notifications: false,
      },
    };

    await app.inject({
      method: 'POST',
      url,
      payload: createConsentEventRequest2,
    });

    // get consent event history
    const getConsentEventsRequest: GetConsentEventsDto = {
      id: JSON.parse(userResponse.body).id,
    };

    const getConsentEventsResponse = await app.inject({
      method: 'GET',
      url: `${url}/${JSON.parse(userResponse.body).id}`,
      payload: getConsentEventsRequest,
    });

    const responseBody = JSON.parse(getConsentEventsResponse.body) as ConsentEventHistory;

    expect(getConsentEventsResponse.statusCode).toBe(200);
    expect(responseBody.consents.length).toBe(2);
  });
});
