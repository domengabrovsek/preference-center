import type { FastifyPluginAsync } from 'fastify';
import { UserService } from '@services/user.service';
import { createUserSchema, getUserByIdSchema, type CreateUserDto, type GetUserByIdDto } from '@schemas/user.schema';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const userService = new UserService(fastify);

  // POST /api/v1/users
  fastify.post<{ Body: CreateUserDto }>('/', {
    schema: { body: createUserSchema, tags: ['users'] },
    handler: async (request, reply) => {
      const user = await userService.createUser(request.body);
      reply.status(201).send(user);
    },
  });

  // GET /api/v1/users/:id
  fastify.get<{ Params: GetUserByIdDto }>('/:id', {
    schema: { params: getUserByIdSchema, tags: ['users'] },
    handler: async (request, reply) => {
      const user = await userService.getUserById(request.params.id);
      reply.status(200).send(user);
    },
  });

  // GET /api/v1/users
  fastify.get('/', {
    schema: { tags: ['users'] },
    handler: async (request, reply) => {
      const users = await userService.getUsers();
      reply.status(200).send(users);
    },
  });

  // DELETE /api/v1/users/:email
  // TODO: Implement
};

export default userRoutes;
