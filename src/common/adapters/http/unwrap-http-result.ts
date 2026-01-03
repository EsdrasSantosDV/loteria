import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppError } from '../../application/errors/app-error';
import { Result } from '../../application/result';

export function unwrapHttpResult<T>(result: Result<T, AppError>): T {
  if (Result.isOk(result)) return result.value;

  const error = result.error;

  switch (error.kind) {
    case 'VALIDATION':
    case 'INVARIANT':
      throw new BadRequestException(error);

    case 'NOT_FOUND':
      throw new NotFoundException(error);

    case 'CONFLICT':
      throw new ConflictException(error);

    case 'UNAUTHORIZED':
      throw new UnauthorizedException(error);

    case 'FORBIDDEN':
      throw new ForbiddenException(error);

    default:
      throw new InternalServerErrorException({
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
  }
}
