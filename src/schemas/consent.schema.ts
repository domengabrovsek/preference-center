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

export type CreateConsentEventDto = Static<typeof createConsentEventSchema>;
