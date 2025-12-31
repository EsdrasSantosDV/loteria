import { BaseValidationHandler } from './validation-handler-base';
import { DomainException } from '../exceptions/domain-exception';

export class NotificationValidationHandler extends BaseValidationHandler {
  public static create(): NotificationValidationHandler {
    return new NotificationValidationHandler();
  }

  public throwIfAny(): void {
    if (this.hasError()) {
      throw DomainException.withErrors(this.getErrors());
    }
  }
}
