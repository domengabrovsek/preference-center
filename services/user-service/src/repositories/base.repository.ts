import type { FastifyInstance } from 'fastify';
import type { Pool, QueryResult } from 'pg';

export class BaseRepository {
  protected readonly pool: Pool;
  protected readonly fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.pool = fastify.pg.pool;
    this.fastify = fastify;
  }

  protected async query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    try {
      return await this.pool.query<T>(sql, params);
    } catch (error) {
      this.fastify.log.error(error);
      throw error;
    }
  }
}
