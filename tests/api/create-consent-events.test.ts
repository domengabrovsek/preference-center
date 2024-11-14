import type { CreateConsentEventDto } from '@schemas/consent.schema';
import type { FastifyInstance } from 'fastify';
import { setupTestServer } from 'tests/setup';
import { randomUUID } from 'crypto';
import type { CreateUserDto } from '@schemas/user.schema';

let app: FastifyInstance;
const url = '/api/v1/events';

beforeAll(async () => {
  app = await setupTestServer();
});

afterAll(async () => {
  await app.close();
});

describe('Create consent event tests', () => {
  it('should return 422 if user does not exist', async () => {
    const request: CreateConsentEventDto = {
      user: {
        id: randomUUID(),
      },
      consents: {
        email_notifications: true,
        sms_notifications: false,
      },
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if request is empty', async () => {
    const request = {};

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if user id is not in valid format', async () => {
    const request: CreateConsentEventDto = {
      user: {
        id: '123',
      },
      consents: {
        email_notifications: true,
        sms_notifications: false,
      },
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if consents are missing', async () => {
    // we want to send a request with missing consents
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const request: any = {
      user: {
        id: randomUUID(),
      },
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if email consent is not specified', async () => {
    // we want to send a request with missing email_notifications
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const request: any = {
      user: {
        id: '123',
      },
      consents: {
        sms_notifications: false,
      },
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 422 if sms consent is not specified', async () => {
    // we want to send a request with missing sms_notifications
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const request: any = {
      user: {
        id: '123',
      },
      consents: {
        email_notifications: true,
      },
    };

    const response = await app.inject({
      method: 'POST',
      url,
      payload: request,
    });

    expect(response.statusCode).toBe(422);
  });

  it('should return 201 and successfully create a consent event', async () => {
    const createUserRequest: CreateUserDto = {
      email: `${randomUUID()}@example.com`,
    };

    const userResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: createUserRequest,
    });

    const createConsentEventRequest: CreateConsentEventDto = {
      user: {
        id: JSON.parse(userResponse.body).id,
      },
      consents: {
        email_notifications: true,
        sms_notifications: false,
      },
    };

    const consentEventResponse = await app.inject({
      method: 'POST',
      url,
      payload: createConsentEventRequest,
    });

    expect(consentEventResponse.statusCode).toBe(201);
  });
});
