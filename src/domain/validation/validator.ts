import { ValidationHandler } from './validation-handler';

export abstract class Validator {
  protected readonly handler: ValidationHandler;

  protected constructor(handler: ValidationHandler) {
    this.handler = handler;
  }

  public abstract validate(): void;

  protected validationHandler(): ValidationHandler {
    return this.handler;
  }
}
