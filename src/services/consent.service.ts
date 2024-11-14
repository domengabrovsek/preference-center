import { ConsentEventRepository } from '@repositories/consent.repository';
import type { FastifyInstance } from 'fastify';
import type { CreateConsentEventDto } from '@schemas/consent.schema';
import type { ConsentEvent, ConsentEventHistory } from '@models/consent';

export class ConsentEventService {
  private readonly repository: ConsentEventRepository;
  private readonly fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.repository = new ConsentEventRepository(fastify);
  }

  async createConsentEvent(consentEvent: CreateConsentEventDto): Promise<ConsentEvent> {
    this.fastify.log.info('Creating consent event', consentEvent);
    return this.repository.create(consentEvent);
  }

  async getConsentEventsByUserId(userId: string): Promise<ConsentEventHistory> {
    return this.repository.getAllByUserId(userId);
  }
}
