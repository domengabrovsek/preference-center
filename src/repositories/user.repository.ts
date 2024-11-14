import type { FastifyInstance } from 'fastify';
import { BaseRepository } from './base.repository';
import type { CreateUserDto } from '../schemas/user.schema';
import type { User } from '@models/user';
import { DatabaseError, NotFoundError } from '@utils/errors';

interface UserDb {
  id: string;
  email: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository extends BaseRepository {
  constructor(fastify: FastifyInstance) {
    super(fastify);
  }

  private mapUser(user: UserDb): User {
    const mappedUser: User = {
      id: user.id,
      email: user.email,
      consents: [],
    };

    if (user.email_notifications) {
      mappedUser.consents.push({ id: 'email_notifications', enabled: user.email_notifications });
    }

    if (user.sms_notifications) {
      mappedUser.consents.push({ id: 'sms_notifications', enabled: user.sms_notifications });
    }

    return mappedUser;
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

  public async getById(id: string): Promise<User> {
    const query = `
   
    SELECT u.id, u.email, c.email_notifications, c.sms_notifications, c.created_at
    FROM users u
    LEFT JOIN consent_events c ON u.id = c.user_id
    WHERE u.id = $1
    ORDER BY c.created_at DESC
    LIMIT 1

    `;

    const {
      rows: [user],
    } = await this.query<UserDb>(query, [id]);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.mapUser(user);
  }

  public async getAll(): Promise<User[]> {
    const { rows } = await this.query<UserDb>('SELECT id, email FROM users');

    return rows.map((user) => this.mapUser(user));
  }
}
