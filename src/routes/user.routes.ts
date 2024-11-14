import type { FastifyPluginAsync } from 'fastify';
import { UserService } from '@services/user.service';
import {
  createUserResponseSchema,
  createUserSchema,
  getUserByIdResponseSchema,
  getUserByIdSchema,
  type CreateUserDto,
  type GetUserByIdDto,
} from '@schemas/user.schema';
import { internalServerErrorSchema, notFoundErrorSchema, unprocessableEntityErrorSchema } from '@schemas/error.schema';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const userService = new UserService(fastify);

  // POST /api/v1/users
  fastify.post<{ Body: CreateUserDto }>('/', {
    schema: {
      description: 'Create a new user',
      body: createUserSchema,
      response: {
        201: createUserResponseSchema,
        422: unprocessableEntityErrorSchema,
        500: internalServerErrorSchema,
      },
      tags: ['users'],
    },
    handler: async (request, reply) => {
      const user = await userService.createUser(request.body);
      reply.status(201).send(user);
    },
  });

  // GET /api/v1/users/:id
  fastify.get<{ Params: GetUserByIdDto }>('/:id', {
    schema: {
      description: 'Get a user with the latest consent status',
      params: getUserByIdSchema,
      response: {
        200: getUserByIdResponseSchema,
        404: notFoundErrorSchema,
        422: unprocessableEntityErrorSchema,
        500: internalServerErrorSchema,
      },
      tags: ['users'],
    },
    handler: async (request, reply) => {
      const user = await userService.getUserById(request.params.id);
      reply.status(200).send(user);
    },
  });

  // DELETE /api/v1/users/:id
  fastify.delete<{ Params: GetUserByIdDto }>('/:id', {
    schema: {
      description: 'Delete a user and its event history',
      params: getUserByIdSchema,
      response: {
        200: {},
        404: notFoundErrorSchema,
        422: unprocessableEntityErrorSchema,
        500: internalServerErrorSchema,
      },
      tags: ['users'],
    },
    handler: async (request, reply) => {
      await userService.deleteUserById(request.params.id);
      reply.status(200).send();
    },
  });
};

export default userRoutes;
