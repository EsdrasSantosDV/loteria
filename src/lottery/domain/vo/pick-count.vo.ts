import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { DomainError } from 'src/common/domain/validation/error';
import { ValueObject } from 'src/common/domain/value-object';
import { MessagesError } from 'src/common/domain/error/messages.error.enum';

export class PickCount extends ValueObject {
  private readonly _min: number;
  private readonly _max: number;

  private constructor(min: number, max: number) {
    super();
    this._min = min;
    this._max = max;
  }

  static create(min: number, max: number): PickCount {
    PickCount.validate(min, max);
    return new PickCount(min, max);
  }

  get min(): number {
    return this._min;
  }
  get max(): number {
    return this._max;
  }

  protected toPrimitive(): unknown {
    return { min: this._min, max: this._max };
  }

  private static validate(min: number, max: number): void {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw DomainException.with(
        new DomainError(MessagesError.PICK_COUNT_BOUNDS_MUST_BE_INTEGER),
      );
    }
    if (min <= 0) {
      throw DomainException.with(
        new DomainError(MessagesError.PICK_COUNT_MIN_MUST_BE_GT_ZERO),
      );
    }
    if (max < min) {
      throw DomainException.with(
        new DomainError(MessagesError.PICK_COUNT_MAX_MUST_BE_GE_MIN),
      );
    }
  }
}
