import { DomainError } from '../validation/error';

export class DomainException extends Error {
  private readonly _errors: DomainError[];

  protected constructor(message: string, errors: DomainError[]) {
    super(message || 'Domain Exception');
    this.name = this.constructor.name;
    this._errors = errors;
  }

  public static with(error: DomainError): DomainException {
    return new DomainException(error.message, [error]);
  }

  public static withErrors(errors: DomainError[]): DomainException {
    return new DomainException('', errors);
  }

  public getErrors(): DomainError[] {
    return [...this._errors];
  }
}
