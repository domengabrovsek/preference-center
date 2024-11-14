import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const createConsentEventSchema = Type.Object(
  {
    user: Type.Object({
      id: Type.String({
        format: 'uuid',
        description: 'Valid user id',
        examples: ['0c947021-0888-4230-9082-bf94a6e9f661'],
      }),
    }),
    consents: Type.Object({
      email_notifications: Type.Boolean({
        description: 'Consent to receive email notifications',
        examples: [true],
      }),

      sms_notifications: Type.Boolean({
        description: 'Consent to receive SMS notifications',
        examples: [true],
      }),
    }),
  },
  {
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

export type CreateConsentEventDto = Static<typeof createConsentEventSchema>;
