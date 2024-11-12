import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

type Environment = 'development' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Config {
  NODE_ENV: Environment;
  PORT: number;
  HOST: string;
  DATABASE_URL: string;
  LOG_LEVEL: LogLevel;
}

function validateEnv(env: string | undefined, validValues: string[]): string {
  if (!env || !validValues.includes(env)) {
    return validValues[0];
  }
  return env;
}

function validatePort(port: string | undefined): number {
  const defaultPort = 3001;
  if (!port) return defaultPort;

  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) return defaultPort;

  return parsedPort;
}

function validateDatabaseUrl(url: string | undefined): string {
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  try {
    new URL(url);
    if (!url.startsWith('postgres')) {
      throw new Error('DATABASE_URL must be a PostgreSQL connection string');
    }
    return url;
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }
}

function loadConfig(): Config {
  const config: Config = {
    NODE_ENV: validateEnv(process.env.NODE_ENV, ['development', 'production', 'test']) as Environment,
    PORT: validatePort(process.env.PORT),
    HOST: process.env.HOST || '0.0.0.0',
    DATABASE_URL: validateDatabaseUrl(process.env.DATABASE_URL),
    LOG_LEVEL: validateEnv(process.env.LOG_LEVEL, ['debug', 'info', 'warn', 'error']) as LogLevel,
  };

  return config;
}

export const config = loadConfig();
