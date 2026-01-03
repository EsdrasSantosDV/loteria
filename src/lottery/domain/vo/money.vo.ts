import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { DomainError } from 'src/common/domain/validation/error';
import { ValueObject } from 'src/common/domain/value-object';
import { ECurrency } from './ecurrency.enum';
import { MessagesError } from '../../../common/domain/error/messages.error.enum';

export class Money extends ValueObject {
  private readonly _amountCents: number;
  private readonly _currency: ECurrency;

  private constructor(amountCents: number, currency: ECurrency) {
    super();
    this._amountCents = amountCents;
    this._currency = currency;
  }

  static ofCents(amountCents: number, currency: ECurrency): Money {
    Money.validateCents(amountCents);
    Money.validateCurrency(currency);

    if (amountCents < 0) {
      throw DomainException.with(
        new DomainError(MessagesError.MONEY_NEGATIVE_NOT_ALLOWED),
      );
    }

    return new Money(amountCents, currency);
  }

  static ofDecimal(amount: number, currency: ECurrency): Money {
    if (!Number.isFinite(amount)) {
      throw DomainException.with(
        new DomainError(MessagesError.MONEY_INVALID_CENTS),
      );
    }
    const cents = Math.round(amount * 100);
    return Money.ofCents(cents, currency);
  }

  get amountCents(): number {
    return this._amountCents;
  }

  get currency(): ECurrency {
    return this._currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.ofCents(
      this._amountCents + other._amountCents,
      this._currency,
    );
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor < 0) {
      throw DomainException.with(
        new DomainError(MessagesError.MONEY_INVALID_CENTS),
      );
    }
    const cents = Math.round(this._amountCents * factor);
    return Money.ofCents(cents, this._currency);
  }

  format(locale = 'pt-BR'): string {
    const value = this._amountCents / 100;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this._currency,
    }).format(value);
  }

  protected toPrimitive(): unknown {
    return {
      amountCents: this._amountCents,
      currency: this._currency,
    };
  }

  private static validateCents(amountCents: number): void {
    if (!Number.isInteger(amountCents)) {
      throw DomainException.with(
        new DomainError(MessagesError.MONEY_INVALID_CENTS),
      );
    }
  }

  private static validateCurrency(currency: ECurrency): void {
    if (!currency) {
      throw DomainException.with(
        new DomainError(MessagesError.MONEY_CURRENCY_REQUIRED),
      );
    }
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw DomainException.with(
        new DomainError(MessagesError.MONEY_CURRENCY_MISMATCH),
      );
    }
  }
}
