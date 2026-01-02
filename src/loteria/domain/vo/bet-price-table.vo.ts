import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { DomainError } from 'src/common/domain/validation/error';
import { ValueObject } from 'src/common/domain/value-object';
import { MessagesError } from 'src/common/domain/error/messages.error.enum';
import { Money } from './money.vo';

export class BetPriceTable extends ValueObject {
  private readonly _table: ReadonlyMap<number, Money>;

  private constructor(table: ReadonlyMap<number, Money>) {
    super();
    this._table = table;
  }

  static create(
    entries: Array<{ pickCount: number; price: Money }>,
  ): BetPriceTable {
    BetPriceTable.validate(entries);

    const map = new Map<number, Money>();
    for (const e of entries) {
      if (map.has(e.pickCount)) {
        throw DomainException.with(
          new DomainError(MessagesError.PRICE_TABLE_DUPLICATED_PICK),
        );
      }
      map.set(e.pickCount, e.price);
    }

    return new BetPriceTable(map);
  }

  priceFor(pickCount: number): Money {
    const price = this._table.get(pickCount);
    if (!price) {
      throw DomainException.with(
        new DomainError(MessagesError.PRICE_TABLE_MISSING_PICK),
      );
    }
    return price;
  }

  protected toPrimitive(): unknown {
    return Array.from(this._table.entries()).map(([pickCount, price]) => ({
      pickCount,
      price: price,
    }));
  }

  private static validate(
    entries: Array<{ pickCount: number; price: Money }>,
  ): void {
    if (!entries || entries.length === 0) {
      throw DomainException.with(
        new DomainError(MessagesError.PRICE_TABLE_EMPTY),
      );
    }

    for (const e of entries) {
      if (!Number.isInteger(e.pickCount) || e.pickCount <= 0) {
        throw DomainException.with(
          new DomainError(MessagesError.PICK_COUNT_MUST_BE_POSITIVE_INTEGER),
        );
      }
      if (!e.price) {
        throw DomainException.with(
          new DomainError(MessagesError.MONEY_INVALID_CENTS),
        );
      }
    }
  }
}
