import { UserRepository } from '@repositories/user.repository';
import type { CreateUserDto } from '@schemas/user.schema';
import type { User } from '@models/user';
import type { FastifyInstance } from 'fastify';

export class UserService {
  private readonly repository: UserRepository;
  private readonly fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.repository = new UserRepository(fastify);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return this.repository.create(user);
  }

  async getUserById(id: string): Promise<User> {
    return this.repository.getById(id);
  }
}
