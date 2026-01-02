import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { DomainError } from 'src/common/domain/validation/error';
import { ValueObject } from 'src/common/domain/value-object';
import { MessagesError } from '../../../common/domain/error/messages.error.enum';

export class NumberPool extends ValueObject {
  private readonly _min: number;
  private readonly _max: number;
  private readonly _zeroPaddedWidth?: number;

  private constructor(min: number, max: number, zeroPaddedWidth?: number) {
    super();
    this._min = min;
    this._max = max;
    this._zeroPaddedWidth = zeroPaddedWidth;
  }

  public static create(
    min: number,
    max: number,
    zeroPaddedWidth?: number,
  ): NumberPool {
    NumberPool.validate(min, max, zeroPaddedWidth);
    return new NumberPool(min, max, zeroPaddedWidth);
  }

  private static validate(
    min: number,
    max: number,
    zeroPaddedWidth?: number,
  ): void {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw DomainException.with(
        new DomainError(MessagesError.NUMBER_POOL_LIMITS_MUST_BE_INTEGERS),
      );
    }

    if (min >= max) {
      throw DomainException.with(
        new DomainError(MessagesError.NUMBER_POOL_MIN_MUST_BE_LESS_THAN_MAX),
      );
    }

    if (zeroPaddedWidth !== undefined) {
      if (!Number.isInteger(zeroPaddedWidth)) {
        throw DomainException.with(
          new DomainError(
            MessagesError.NUMBER_POOL_ZERO_PADDED_WIDTH_MUST_BE_INTEGER,
          ),
        );
      }

      if (zeroPaddedWidth < 1) {
        throw DomainException.with(
          new DomainError(
            MessagesError.NUMBER_POOL_ZERO_PADDED_WIDTH_MUST_BE_GREATER_THAN_ZERO,
          ),
        );
      }

      if (zeroPaddedWidth > 2) {
        throw DomainException.with(
          new DomainError(
            MessagesError.NUMBER_POOL_ZERO_PADDED_WIDTH_MUST_BE_LESS_OR_EQUAL_TO_TWO,
          ),
        );
      }
    }
  }

  contains(n: number): boolean {
    return Number.isInteger(n) && n >= this._min && n <= this._max;
  }

  size(): number {
    return this._max - this._min + 1;
  }

  format(n: number): string {
    if (!this._zeroPaddedWidth) return String(n);
    return String(n).padStart(this._zeroPaddedWidth, '0');
  }

  protected toPrimitive(): unknown {
    return {
      min: this._min,
      max: this._max,
      zeroPaddedWidth: this._zeroPaddedWidth ?? null,
    };
  }
}
