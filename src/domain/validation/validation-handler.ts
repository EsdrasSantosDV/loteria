import { DomainError } from './error';

export interface ValidationHandler {
  append(error: DomainError): this;
  append(handler: ValidationHandler): this;

  validate<T>(validation: ValidationHandler.Validation<T>): T;

  getErrors(): DomainError[];

  hasError(): boolean;
  firstError(): DomainError | null;
}

export namespace ValidationHandler {
  export interface Validation<T> {
    validate(): T;
  }
}
