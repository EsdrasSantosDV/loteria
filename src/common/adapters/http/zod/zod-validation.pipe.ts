import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export type ZodIssueDTO = {
  path: string;
  message: string;
  code: string;
};

export type ZodBadRequestDTO = {
  code: 'INVALID_REQUEST';
  message: 'Payload inválido';
  issues: ZodIssueDTO[];
};

function toIssues(error: ZodError): ZodIssueDTO[] {
  return error.issues.map((i) => ({
    path: i.path.join('.'),
    message: i.message,
    code: i.code,
  }));
}

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      const payload: ZodBadRequestDTO = {
        code: 'INVALID_REQUEST',
        message: 'Payload inválido',
        issues: toIssues(parsed.error),
      };
      throw new BadRequestException(payload);
    }
    return parsed.data;
  }
}
