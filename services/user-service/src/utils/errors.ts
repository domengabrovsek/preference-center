import { databaseErrorCode } from '@/constants/db';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: string,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }

  static uniqueViolation(field: string, value: string): DatabaseError {
    return new DatabaseError(
      `Duplicate entry for ${field}`,
      databaseErrorCode.UniqueVolation,
      `Entity with ${field} '${value}' already exists`,
    );
  }

  static foreignKeyViolation(details?: string): DatabaseError {
    return new DatabaseError('Referenced entity does not exist', databaseErrorCode.ForeignKeyViolation, details);
  }

  static connectionError(details?: string): DatabaseError {
    return new DatabaseError('Database connection error', databaseErrorCode.ConnectionError, details);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }

  static notFound(message: string): NotFoundError {
    return new NotFoundError(message);
  }
}
