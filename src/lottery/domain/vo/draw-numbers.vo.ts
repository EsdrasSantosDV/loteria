import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { DomainError } from 'src/common/domain/validation/error';
import { ValueObject } from 'src/common/domain/value-object';
import { MessagesError } from 'src/common/domain/error/messages.error.enum';
import { NumberPool } from './number-pool.vo';

export class DrawNumbers extends ValueObject {
  private readonly _numbers: number[];

  private constructor(numbers: number[]) {
    super();
    this._numbers = [...numbers];
  }

  public static create(params: {
    numbers: number[];
    pool: NumberPool;
    drawCount: number;
  }): DrawNumbers {
    const numbers = params.numbers ?? [];

    if (!Array.isArray(numbers) || numbers.length === 0) {
      throw DomainException.with(
        new DomainError(MessagesError.DRAW_NUMBERS_EMPTY),
      );
    }

    if (!Number.isInteger(params.drawCount) || params.drawCount <= 0) {
      throw DomainException.with(
        new DomainError(MessagesError.DRAW_NUMBERS_DRAW_COUNT_INVALID),
      );
    }

    if (numbers.length !== params.drawCount) {
      throw DomainException.with(
        new DomainError(
          `${MessagesError.DRAW_NUMBERS_COUNT_MISMATCH}: esperado ${params.drawCount}, recebido ${numbers.length}`,
        ),
      );
    }

    const normalized = numbers.map((n) => Number(n));

    for (const n of normalized) {
      if (!params.pool.contains(n)) {
        throw DomainException.with(
          new DomainError(`${MessagesError.DRAW_NUMBERS_OUT_OF_POOL}: '${n}'`),
        );
      }
    }

    const unique = new Set(normalized);
    if (unique.size !== normalized.length) {
      throw DomainException.with(
        new DomainError(MessagesError.DRAW_NUMBERS_DUPLICATED),
      );
    }

    normalized.sort((a, b) => a - b);
    return new DrawNumbers(normalized);
  }

  public get values(): number[] {
    return [...this._numbers];
  }

  public has(n: number): boolean {
    return this._numbers.includes(n);
  }

  protected toPrimitive(): unknown {
    return { numbers: [...this._numbers] };
  }

  public static fromJson(json: { numbers: number[] }): DrawNumbers {
    return new DrawNumbers(json.numbers);
  }
}
