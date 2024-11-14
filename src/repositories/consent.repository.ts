import type { FastifyInstance } from 'fastify';
import { BaseRepository } from './base.repository';
import type { ConsentEvent, ConsentEventHistory } from '@models/consent';
import { DatabaseError, NotFoundError } from '@utils/errors';
import type { CreateConsentEventDto } from '@schemas/consent.schema';

interface ConsentEventDb {
  id: string;
  user_id: string;
  sms_notifications: boolean;
  email_notifications: boolean;
  created_at: Date;
}

export class ConsentEventRepository extends BaseRepository {
  constructor(fastify: FastifyInstance) {
    super(fastify);
  }

  private mapConsentEvent(consentEvent: ConsentEventDb): ConsentEvent {
    return {
      id: consentEvent.id,
      user: {
        id: consentEvent.user_id,
      },
      consents: {
        email_notifications: consentEvent.email_notifications,
        sms_notifications: consentEvent.sms_notifications,
      },
    };
  }

  public async create(data: CreateConsentEventDto) {
    try {
      const query =
        'INSERT INTO consent_events (user_id, sms_notifications, email_notifications) VALUES ($1, $2, $3) RETURNING *';

      const {
        rows: [consent_event],
      } = await this.query<ConsentEventDb>(query, [
        data.user.id,
        data.consents.sms_notifications,
        data.consents.email_notifications,
      ]);

      this.fastify.log.info('Created consent event', consent_event);

      return this.mapConsentEvent(consent_event);
    } catch (error) {
      this.fastify.log.error(error);

      // Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
      switch (error.code) {
        case '23503':
          throw DatabaseError.foreignKeyViolation(error.detail);
        case 'ECONNREFUSED':
          throw DatabaseError.connectionError('Could not connect to database');
        default:
          throw error;
      }
    }
  }

  public async getAllByUserId(userId: string): Promise<ConsentEventHistory> {
    const query = `
    SELECT user_id, sms_notifications, email_notifications, created_at 
    FROM consent_events 
    WHERE user_id = $1
    ORDER BY created_at DESC
    `;

    const { rows } = await this.query<ConsentEventDb>(query, [userId]);

    if (rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return {
      id: rows[0].user_id,
      consents: rows.map((consentEvent) => ({
        email_notifications: consentEvent.email_notifications,
        sms_notifications: consentEvent.sms_notifications,
        created_at: consentEvent.created_at,
      })),
    };
  }
}
