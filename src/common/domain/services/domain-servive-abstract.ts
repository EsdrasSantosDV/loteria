import { NotificationValidationHandler } from '../validation/notification-validation-handler';
import { DomainException } from '../exceptions/domain-exception';
import { ValidationHandler } from '../validation/validation-handler';

export type DomainServiceResult = unknown;

export abstract class DomainService<
  TParams extends object,
  TResult extends DomainServiceResult = void,
> {
  public execute(params: TParams): TResult {
    const handler = this.createValidationHandler();

    this.preValidate(params, handler);

    if (handler.hasError && handler.hasError()) {
      throw DomainException.with(handler.getErrors?.()[0] ?? undefined);
    }

    const result = this.doExecute(params);

    this.postExecute(params, result);

    return result;
  }

  protected preValidate(_params: TParams, _handler: ValidationHandler): void {}

  protected abstract doExecute(params: TParams): TResult;

  protected postExecute(_params: TParams, _result: TResult): void {}

  protected createValidationHandler(): ValidationHandler {
    return NotificationValidationHandler.create();
  }
}
