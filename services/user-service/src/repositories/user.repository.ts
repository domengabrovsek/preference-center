import type { FastifyInstance } from 'fastify';
import { BaseRepository } from './base.repository';
import type { CreateUserDto } from '../schemas/user.schema';
import type { User } from '@models/user';
import { DatabaseError, NotFoundError } from '@utils/errors';

interface UserDb {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository extends BaseRepository {
  constructor(fastify: FastifyInstance) {
    super(fastify);
  }

  private mapUser(user: UserDb): User {
    return {
      id: user.id,
      email: user.email,
      consents: [],
    };
  }

  public async create(data: CreateUserDto): Promise<User> {
    try {
      const {
        rows: [user],
      } = await this.query<UserDb>('INSERT INTO users (email) VALUES ($1) RETURNING *', [data.email]);

      return this.mapUser(user);
    } catch (error) {
      this.fastify.log.error(error);

      // Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
      switch (error.code) {
        case '23505':
          throw DatabaseError.uniqueViolation('email', data.email);
        case '23503':
          throw DatabaseError.foreignKeyViolation(error.detail);
        case 'ECONNREFUSED':
          throw DatabaseError.connectionError('Could not connect to database');
        default:
          throw error;
      }
    }
  }

  public async getById(id: string): Promise<User | null> {
    const {
      rows: [user],
    } = await this.query<UserDb>('SELECT id, email FROM users WHERE id = $1', [id]);

    if (!user) {
      throw NotFoundError.notFound();
    }

    return user ? this.mapUser(user) : null;
  }
}
