import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

export async function setupTestServer(): Promise<FastifyInstance> {
  const app = await buildApp();
  await app.ready();

  return app;
}
