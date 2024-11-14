import fastify, { type FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPostgres from '@fastify/postgres';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { config } from '@config/config';
import userRoutes from '@routes/user.routes';
import consentRoutes from '@routes/consent.routes';
import { runMigrations } from '@db/migrate';
import { DatabaseError, NotFoundError } from '@utils/errors';
import { databaseErrorCode } from '@constants/db';

async function checkDatabaseConnection(app: FastifyInstance) {
  try {
    app.log.info('Verifying database connection...');
    await app.pg.pool.query('SELECT NOW()');
    app.log.info('Database connection verified');
  } catch (error) {
    app.log.error(`Database connection error: ${error.message}`);
    throw new Error('Unable to connect to the database. Please check your configuration.');
  }
}

export async function buildApp() {
  const app = fastify({
    logger: { level: config.LOG_LEVEL },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(`Handling error: ${error.message} ${error.stack} ${error.code}`);

    // Handle database errors
    if (error instanceof DatabaseError) {
      if (error.code === databaseErrorCode.ConnectionError) {
        return reply.status(503).send({
          error: 'Service Unavailable',
          message: 'Database connection error',
        });
      }
      if (error.code === databaseErrorCode.UniqueVolation) {
        return reply.status(422).send({
          error: 'Conflict',
          message: 'User with this username already exists',
        });
      }

      if (error.code === databaseErrorCode.ForeignKeyViolation) {
        return reply.status(422).send({
          error: 'Conflict',
          message: 'Referenced entity does not exist',
        });
      }
    }

    // Handle not found errors
    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Entity not found',
      });
    }

    // Handle validation errors
    if (error.validation) {
      return reply.status(422).send({
        error: 'Validation Error',
        message: error.message,
      });
    }

    // Handle unknown errors
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  });

  // Register Swagger plugin
  app.log.info('Registering Swagger plugin');
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Preferences management API',
        description: 'API for managing user preferences',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3001', description: 'Dev' }],
    },
  });

  // Register Swagger UI plugin
  app.log.info('Registering Swagger UI plugin');
  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // Register postgres plugin
  app.log.info('Registering database plugin');
  await app.register(fastifyPostgres, {
    connectionString: config.DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });

  // Check database connection
  await checkDatabaseConnection(app);

  // Run database migrations
  if (config.MIGRATE) {
    await runMigrations(app);
  }

  // Register user routes
  app.log.info('Registering user routes');
  await app.register(userRoutes, { prefix: '/api/v1/users' });

  // Register consent routes
  app.log.info('Registering consent routes');
  await app.register(consentRoutes, { prefix: '/api/v1/events' });

  return app;
}
