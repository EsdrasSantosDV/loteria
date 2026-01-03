import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { DomainError } from 'src/common/domain/validation/error';
import { ValueObject } from 'src/common/domain/value-object';
import { MessagesError } from 'src/common/domain/error/messages.error.enum';
import { NumberPool } from './number-pool.vo';
import { PickCount } from './pick-count.vo';

export class BetNumbers extends ValueObject {
  private readonly _numbers: readonly number[];

  private constructor(numbers: readonly number[]) {
    super();
    this._numbers = numbers;
  }

  static create(
    numbers: number[],
    pool: NumberPool,
    pick: PickCount,
  ): BetNumbers {
    if (!numbers || numbers.length === 0) {
      throw DomainException.with(
        new DomainError(MessagesError.BET_NUMBERS_EMPTY),
      );
    }

    const unique = Array.from(new Set(numbers)).sort((a, b) => a - b);
    BetNumbers.validate(unique, pool, pick);

    return new BetNumbers(unique);
  }

  get value(): readonly number[] {
    return this._numbers;
  }

  toStringFormatted(pool: NumberPool): string {
    return this._numbers.map((n) => pool.format(n)).join('-');
  }

  static fromJson(numbers: number[]): BetNumbers {
    if (!numbers || numbers.length === 0) {
      throw DomainException.with(
        new DomainError(MessagesError.BET_NUMBERS_EMPTY),
      );
    }
    const unique = Array.from(new Set(numbers)).sort((a, b) => a - b);
    return new BetNumbers(unique);
  }

  protected toPrimitive(): unknown {
    return this._numbers;
  }

  private static validate(
    numbers: readonly number[],
    pool: NumberPool,
    pick: PickCount,
  ): void {
    if (numbers.length < pick.min || numbers.length > pick.max) {
      throw DomainException.with(
        new DomainError(MessagesError.BET_NUMBERS_PICK_OUT_OF_RANGE),
      );
    }

    for (const n of numbers) {
      if (!pool.contains(n)) {
        throw DomainException.with(
          new DomainError(MessagesError.BET_NUMBERS_OUT_OF_POOL),
        );
      }
    }
  }
}
