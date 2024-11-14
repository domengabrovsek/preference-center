import { join } from 'path';
import migrate from 'node-pg-migrate';
import type { FastifyInstance } from 'fastify';
import { config } from '@config/config';

export async function runMigrations(app: FastifyInstance) {
  const databaseUrl = config.DATABASE_URL;
  const migrationsTable = 'migrations';

  app.log.info('Running database migrations...');
  app.log.info(`Database url: ${databaseUrl}`);
  app.log.info(`Migrations directory: ${import.meta.dirname}/migrations`);

  try {
    const result = await migrate({
      databaseUrl,
      migrationsTable,
      dir: `${join(import.meta.dirname, '../../', 'migrations')}`,
      direction: 'up',
    });

    if (result.length === 0) {
      app.log.info('No new migrations to run');
    } else {
      app.log.info(`Executed migrations: ${JSON.stringify(result)}`);
    }

    app.log.info('Database migrations completed successfully');
  } catch (error) {
    app.log.error('Database migration failed:', error);
    throw error;
  }
}
