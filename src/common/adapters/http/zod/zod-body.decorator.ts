import { Body, Param, Query } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

export function ZodBody<T>(schema: ZodSchema<T>) {
  return Body(new ZodValidationPipe(schema));
}

export function ZodQuery<T>(schema: ZodSchema<T>) {
  return Query(new ZodValidationPipe(schema));
}

export function ZodParam<T>(schema: ZodSchema<T>) {
  return Param(new ZodValidationPipe(schema));
}
