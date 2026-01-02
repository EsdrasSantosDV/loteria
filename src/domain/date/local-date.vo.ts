import { Temporal } from '@js-temporal/polyfill';
import { ValueObject } from '../value-object';

export class LocalDateVO extends ValueObject {
  private readonly _value: Temporal.PlainDate;

  private constructor(value: Temporal.PlainDate) {
    super();
    this._value = value;
  }

  public static fromISO(isoDate: string): LocalDateVO {
    return new LocalDateVO(Temporal.PlainDate.from(isoDate));
  }

  public static fromYMD(year: number, month: number, day: number): LocalDateVO {
    return new LocalDateVO(new Temporal.PlainDate(year, month, day));
  }

  public get value(): Temporal.PlainDate {
    return this._value;
  }

  public toISO(): string {
    return this._value.toString();
  }

  public plusDays(days: number): LocalDateVO {
    return new LocalDateVO(this._value.add({ days }));
  }

  public minusDays(days: number): LocalDateVO {
    return new LocalDateVO(this._value.subtract({ days }));
  }

  public isBefore(other: LocalDateVO): boolean {
    return Temporal.PlainDate.compare(this._value, other._value) < 0;
  }

  public isAfter(other: LocalDateVO): boolean {
    return Temporal.PlainDate.compare(this._value, other._value) > 0;
  }

  public override toString(): string {
    return this.toISO();
  }

  protected override toPrimitive(): unknown {
    return this.toISO();
  }

  public toJSON(): string {
    return this.toISO();
  }
}
