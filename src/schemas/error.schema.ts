import { Type } from '@sinclair/typebox';

export const internalServerErrorSchema = Type.Object(
  {
    message: Type.String(),
  },
  {
    $id: 'InternalServerErrorSchema',
    title: 'Internal Server Error',
    description: 'Schema for a generic internal server error response',
    examples: [
      {
        message: 'An unexpected error occurred',
      },
    ],
    additionalProperties: false,
  },
);

export const notFoundErrorSchema = Type.Object(
  {
    message: Type.String(),
  },
  {
    $id: 'NotFoundErrorSchema',
    title: 'Not Found Error',
    description: 'Schema for a generic not found error response',
    examples: [
      {
        message: 'Entity not found',
      },
    ],
    additionalProperties: false,
  },
);

export const unprocessableEntityErrorSchema = Type.Object(
  {
    message: Type.String(),
  },
  {
    $id: 'UnprocessableEntityErrorSchema',
    title: 'Unprocessable Entity Error',
    description: 'Schema for a generic unprocessable entity error response',
    examples: [
      {
        message: 'Referenced entity does not exist',
      },
    ],
    additionalProperties: false,
  },
);
