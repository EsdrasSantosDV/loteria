import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain-exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errors = exception.getErrors();
    const payload = {
      code: 'DOMAIN_ERROR',
      message: exception.message || 'Erro de domínio',
      errors: errors.map((error) => ({
        message: error.message,
      })),
    };

    response.status(400).json(payload);
  }
}
