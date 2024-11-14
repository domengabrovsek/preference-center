import { ConsentEventRepository } from '@repositories/consent.repository';
import type { FastifyInstance } from 'fastify';
import type { CreateConsentEventDto } from '@schemas/consent.schema';
import type { ConsentEvent } from '@models/consent';

export class ConsentEventService {
  private readonly repository: ConsentEventRepository;
  private readonly fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.repository = new ConsentEventRepository(fastify);
  }

  async createConsentEvent(consentEvent: CreateConsentEventDto) {
    return this.repository.create(consentEvent);
  }

  async getConsentEventsByUserId(userId: string): Promise<ConsentEvent[]> {
    return this.repository.getAllByUserId(userId);
  }
}
