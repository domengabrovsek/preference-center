# Preferences Management API

A RESTful API service for managing user preferences and tracking user consent events.
Built with [Fastify](https://www.fastify.io/), [TypeScript](https://www.typescriptlang.org/), and [PostgreSQL](https://www.postgresql.org/).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Assumptions](#assumptions)

## Prerequisites

Before running this application, make sure you have the following installed on your system:

### Node.js

- Node.js version 22.x (specified in `.nvmrc`)
- I recommend using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage Node.js versions

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use the correct Node.js version using .nvmrc
nvm install
nvm use
```

### Docker

- Docker Engine 24.x or higher
- Docker Compose V2
- Installation guides:
  - [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - [Docker for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Docker for Linux](https://docs.docker.com/engine/install/)

### Verify Installation

You can verify your installations by running:

```bash
# Check Node.js version (should be 22.x)
node --version

# Check Docker version
docker --version

# Check Docker Compose version
docker compose version
```

## Getting Started

1. Clone the repository

```bash
git clone git@github.com:domengabrovsek/preference-center.git
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (leave default)

```bash
cp .env.example .env
```

4. Start the database server

```bash
docker compose up -d
```

5. Start the application

```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

## API Documentation

Once the application is running, you can access the OpenAPI (Swagger) documentation at:

```
http://localhost:3001/docs
```

### Key Endpoints

#### Users

- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/:id` - Get user with latest consent state by user id

#### Consent Events

- `POST /api/v1/events` - Create a consent event
- `GET /api/v1/events/:id` - Get a history of consent events by user id

## Available Scripts

- `npm run dev` - Start the application in development mode with hot reload
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run migrate:create` - Create a new migration

## Database Migrations

To create a new migration:

```bash
npm run migrate:create my_migration_name
```

## Testing

Run the test suite:

```bash
npm test
```

## Assumptions

To keep the project as simple as possible a few assumptions were made:

- there is a single deployment unit due to the simple api requirements
- there is no authorization/authentication mechanisms implemented
- there is no caching implemented
- there is no queue or event driven approach for handling events
- tests are kept to a bare minimum to ensure the basic functionality is working
- when creating a new consent event, it is assumed that explicit approval/denial consent is given for both sms/email notifications
