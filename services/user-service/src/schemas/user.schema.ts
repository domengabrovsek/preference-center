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

export type CreateUserDto = Static<typeof createUserSchema>;
