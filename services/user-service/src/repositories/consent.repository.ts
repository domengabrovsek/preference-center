import type { FastifyInstance } from 'fastify';
import { BaseRepository } from './base.repository';
import type { ConsentEvent } from '@models/consent';
import { DatabaseError } from '@utils/errors';
import type { CreateConsentEventDto } from '@schemas/consent.schema';

interface ConsentEventDb {
  id: string;
  user_id: string;
  sms_notifications: boolean;
  email_notifications: boolean;
  created_at: Date;
  updated_at: Date;
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
        (data.user.id, data.consents.sms_notifications, data.consents.email_notifications),
      ]);

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

  public async getAllByUserId(userId: string): Promise<ConsentEvent[]> {
    const { rows } = await this.query<ConsentEventDb>(
      'SELECT user_id, sms_notifications, email_notifications FROM consent_events WHERE user_id = $1',
      [userId],
    );

    return rows.map((consentEvent) => this.mapConsentEvent(consentEvent));
  }
}
