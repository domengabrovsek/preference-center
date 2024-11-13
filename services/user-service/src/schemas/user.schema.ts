import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const createUserSchema = Type.Object(
  {
    email: Type.String({
      format: 'email',
      description: 'Valid email address',
      examples: ['user@example.com'],
    }),
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

export const getUserByIdSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'User id',
    }),
  },
  {
    $id: 'GetUserByIdSchema',
    title: 'Get User By Id Request',
    description: 'Schema for getting a user by id',
    examples: [
      {
        id: 'ba1ad90d-b471-45a1-b5ca-b4a339e16ccf',
      },
    ],
    additionalProperties: false,
  },
);

export type CreateUserDto = Static<typeof createUserSchema>;
export type GetUserByIdDto = Static<typeof getUserByIdSchema>;
