import type { FastifyPluginAsync } from 'fastify';
import { ConsentEventService } from '@services/consent.service';
import { createConsentEventResponseSchema, createConsentEventSchema, type CreateConsentEventDto } from '@schemas/consent.schema';
import { unprocessableEntityErrorSchema, internalServerErrorSchema } from '@schemas/error.schema';

const consentRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ConsentEventService(fastify);

  // POST /api/v1/events
  fastify.post<{ Body: CreateConsentEventDto }>('/', {
    schema: {
      description: 'Create a new consent event',
      body: createConsentEventSchema,
      response: {
        201: createConsentEventResponseSchema,
        422: unprocessableEntityErrorSchema,
        500: internalServerErrorSchema,
      },
      tags: ['consent events'],
    },
    handler: async (request, reply) => {
      const consentEvent = await service.createConsentEvent(request.body);
      reply.status(201).send(consentEvent);
    },
  });
};

export default consentRoutes;
