import type { FastifyPluginAsync } from 'fastify';
import { ConsentEventService } from '@services/consent.service';
import { createConsentEventSchema, type CreateConsentEventDto } from '@schemas/consent.schema';

const consentRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ConsentEventService(fastify);

  // POST /api/v1/events
  fastify.post<{ Body: CreateConsentEventDto }>('/', {
    schema: { body: createConsentEventSchema, tags: ['consent events'] },
    handler: async (request, reply) => {
      const consentEvent = await service.createConsentEvent(request.body);
      reply.status(201).send(consentEvent);
    },
  });
};

export default consentRoutes;
