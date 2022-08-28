export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UserNotFoundError extends BaseError {
  constructor() {
    super('User not found');
  }
}

export class NameConflictError extends BaseError {
  constructor() {
    super('Name conflict');
  }
}
