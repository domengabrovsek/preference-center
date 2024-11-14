import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { userIdSchema } from './common.schema';

export const createConsentEventSchema = Type.Object(
  {
    user: Type.Object({
      id: userIdSchema,
    }),
    consents: Type.Object({
      email_notifications: Type.Boolean({
        description: 'Consent to receive email notifications',
        examples: [true, false],
      }),

      sms_notifications: Type.Boolean({
        description: 'Consent to receive SMS notifications',
        examples: [true, false],
      }),
    }),
  },
  {
    $id: 'CreateConsentEventSchema',
    description: 'Create a new consent event',
    examples: [
      {
        user: {
          id: '0c947021-0888-4230-9082-bf94a6e9f661',
        },
        consents: {
          email_notifications: true,
          sms_notifications: false,
        },
      },
    ],
  },
);

export const createConsentEventResponseSchema = Type.Object(
  {
    user: Type.Object({
      id: userIdSchema,
    }),
    consents: Type.Object({
      email_notifications: Type.Boolean({
        description: 'Consent to receive email notifications',
        examples: [true, false],
      }),

      sms_notifications: Type.Boolean({
        description: 'Consent to receive SMS notifications',
        examples: [true, false],
      }),
    }),
  },
  {
    $id: 'CreateConsentEventResponseSchema',
    description: 'Response for creating a new consent event',
    examples: [
      {
        user: {
          id: '0c947021-0888-4230-9082-bf94a6e9f661',
        },
        consents: {
          email_notifications: true,
          sms_notifications: false,
        },
      },
    ],
  },
);

export const getConsentEventsByUserIdSchema = Type.Object(
  {
    id: userIdSchema,
  },
  {
    $id: 'GetConsentEventsByUserIdSchema',
    description: 'Get consent events by user ID',
    examples: [
      {
        id: '0c947021-0888-4230-9082-bf94a6e9f661',
      },
    ],
  },
);

export const getConsentEventsByUserIdResponseSchema = Type.Object(
  {
    id: userIdSchema,
    consents: Type.Array(
      Type.Object({
        email_notifications: Type.Boolean({
          description: 'Consent to receive email notifications',
          examples: [true, false],
        }),
        sms_notifications: Type.Boolean({
          description: 'Consent to receive SMS notifications',
          examples: [true, false],
        }),
        created_at: Type.String({
          format: 'date-time',
          description: 'Date and time the consent event was created',
        }),
      }),
    ),
  },
  {
    $id: 'GetConsentEventsByUserIdResponseSchema',
    description: 'Response for getting consent events by user ID',
    examples: [
      {
        id: '0c947021-0888-4230-9082-bf94a6e9f661',
        consents: [
          {
            email_notifications: true,
            sms_notifications: false,
            created_at: '2021-07-31T12:00:00Z',
          },
        ],
      },
    ],
  },
);

export type CreateConsentEventDto = Static<typeof createConsentEventSchema>;
export type GetConsentEventsDto = Static<typeof getConsentEventsByUserIdSchema>;
