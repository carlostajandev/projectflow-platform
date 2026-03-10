import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// ── Auth ───────────────────────────────────────────────────────────────────────
export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid email or password');
  }
}

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token has expired');
  }
}

// ── User ───────────────────────────────────────────────────────────────────────
export class UserNotFoundException extends NotFoundException {
  constructor(identifier: string | number) {
    super(`User with identifier "${identifier}" not found`);
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Email "${email}" is already registered`);
  }
}

// ── Project ────────────────────────────────────────────────────────────────────
export class ProjectNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Project with id "${id}" not found`);
  }
}

export class ProjectOwnershipException extends ForbiddenException {
  constructor() {
    super('You do not have permission to access or modify this project');
  }
}

// ── Task ───────────────────────────────────────────────────────────────────────
export class TaskNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Task with id "${id}" not found`);
  }
}

export class TaskNotInProjectException extends BadRequestException {
  constructor(taskId: string, projectId: string) {
    super(`Task "${taskId}" does not belong to project "${projectId}"`);
  }
}

// ── Comment ────────────────────────────────────────────────────────────────────
export class CommentNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Comment with id "${id}" not found`);
  }
}
