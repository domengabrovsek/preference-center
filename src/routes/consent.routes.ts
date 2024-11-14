import type { FastifyPluginAsync } from 'fastify';
import { ConsentEventService } from '@services/consent.service';
import {
  createConsentEventResponseSchema,
  createConsentEventSchema,
  getConsentEventsByUserIdResponseSchema,
  getConsentEventsByUserIdSchema,
  type CreateConsentEventDto,
  type GetConsentEventsDto,
} from '@schemas/consent.schema';
import { unprocessableEntityErrorSchema, internalServerErrorSchema } from '@schemas/error.schema';

const consentRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ConsentEventService(fastify);

  // POST /api/v1/events
  fastify.post<{ Body: CreateConsentEventDto }>('/', {
    schema: {
      description: 'Create a new consent event for a user',
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

  // GET /api/v1/events/:userId
  fastify.get<{ Params: GetConsentEventsDto }>('/:id', {
    schema: {
      description: 'Get full consent events history for a user',
      params: getConsentEventsByUserIdSchema,
      response: {
        200: getConsentEventsByUserIdResponseSchema,
        422: unprocessableEntityErrorSchema,
        500: internalServerErrorSchema,
      },
      tags: ['consent events'],
    },
    handler: async (request, reply) => {
      const consentEvents = await service.getConsentEventsByUserId(request.params.id);
      reply.status(200).send(consentEvents);
    },
  });
};

export default consentRoutes;
