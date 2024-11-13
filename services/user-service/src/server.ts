import { buildApp } from './app';
import { config } from './config/config';

async function start() {
  let app;

  try {
    app = await buildApp();
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`Server listening on ${config.PORT}`);
  } catch (error) {
    // if the server fails to start, fastify logger is not available
    /* eslint-disable-next-line no-console */
    console.error(`Error starting server: ${error}`);
    process.exit(1);
  }
}

start();
