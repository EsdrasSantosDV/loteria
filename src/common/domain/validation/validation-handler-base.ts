import { DomainError } from './error';
import { ValidationHandler } from './validation-handler';

export abstract class BaseValidationHandler implements ValidationHandler {
  protected readonly errors: DomainError[] = [];

  append(error: DomainError): this;
  append(handler: ValidationHandler): this;

  append(arg: DomainError | ValidationHandler): this {
    if (!arg) {
      return this;
    }

    if (arg instanceof DomainError) {
      this.errors.push(arg);
    } else {
      const otherErrors = arg.getErrors();
      if (otherErrors && otherErrors.length > 0) {
        this.errors.push(...otherErrors);
      }
    }

    return this;
  }

  validate<T>(validation: ValidationHandler.Validation<T>): T {
    return validation.validate();
  }

  getErrors(): DomainError[] {
    return [...this.errors];
  }

  hasError(): boolean {
    return this.errors.length > 0;
  }

  firstError(): DomainError | null {
    return this.errors.length > 0 ? this.errors[0] : null;
  }
}
