import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

const userIdSchema = Type.String({
  format: 'uuid',
  description: 'UUID v4 format identifier of the user',
  examples: ['ba1ad90d-b471-45a1-b5ca-b4a339e16ccf'],
});

const userEmailSchema = Type.String({
  format: 'email',
  description: 'Valid email address',
  examples: ['user@example.com'],
});

const consentSchema = Type.Object({
  id: Type.String({
    description: 'Consent identifier',
    enum: ['email_notifications', 'sms_notifications'],
  }),
  enabled: Type.Boolean({
    description: 'Consent status',
  }),
});

export const createUserSchema = Type.Object(
  {
    email: userEmailSchema,
  },
  {
    $id: 'CreateUserSchema',
    title: 'Create User Request',
    description: 'Schema for creating a new user',
    examples: [
      {
        email: 'newuser@example.com',
      },
    ],
    additionalProperties: false,
  },
);

export const createUserResponseSchema = Type.Object(
  {
    id: userIdSchema,
    email: userEmailSchema,
    consents: Type.Array(Type.Object({})),
  },
  {
    $id: 'CreateUserResponseSchema',
    title: 'Create User Response',
    description: 'Schema for the response of a successful user creation',
    examples: [
      {
        id: 'ba1ad90d-b471-45a1-b5ca-b4a339e16ccf',
        email: 'user@example.com',
        consents: [],
      },
    ],

    additionalProperties: false,
  },
);

export const getUserByIdSchema = Type.Object(
  {
    id: userIdSchema,
  },
  {
    $id: 'GetUserByIdSchema',
    title: 'Get User By Id Request',
    description: 'Parameters for retrieving a specific user by their UUID',
    examples: [
      {
        id: 'ba1ad90d-b471-45a1-b5ca-b4a339e16ccf',
      },
    ],
    additionalProperties: false,
  },
);

export const getUserByIdResponseSchema = Type.Object(
  {
    id: userIdSchema,
    email: userEmailSchema,
    consents: Type.Array(consentSchema),
  },
  {
    $id: 'GetUserByIdResponseSchema',
    title: 'Get User By Id Response',
    description: 'Schema for the response of a successful user retrieval',
    examples: [
      {
        id: 'ba1ad90d-b471-45a1-b5ca-b4a339e16ccf',
        email: 'user@example.com',
        consents: [
          { id: 'email_notifications', enabled: true },
          { id: 'sms_notifications', enabled: false },
        ],
      },
    ],
    additionalProperties: false,
  },
);

export type CreateUserDto = Static<typeof createUserSchema>;
export type GetUserByIdDto = Static<typeof getUserByIdSchema>;
