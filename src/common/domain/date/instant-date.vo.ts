import { Temporal } from '@js-temporal/polyfill';
import { ValueObject } from '../value-object';

export class InstantVO extends ValueObject {
  private readonly _value: Temporal.Instant;

  private constructor(value: Temporal.Instant) {
    super();
    this._value = value;
  }

  public static now(): InstantVO {
    return new InstantVO(Temporal.Now.instant());
  }

  public static fromISO(isoInstant: string): InstantVO {
    return new InstantVO(Temporal.Instant.from(isoInstant));
  }

  public get value(): Temporal.Instant {
    return this._value;
  }

  public toISO(): string {
    return this._value.toString();
  }

  public plusSeconds(seconds: number): InstantVO {
    return new InstantVO(this._value.add({ seconds }));
  }

  public isBefore(other: InstantVO): boolean {
    return Temporal.Instant.compare(this._value, other._value) < 0;
  }

  protected override toPrimitive(): unknown {
    return this.toISO();
  }

  public toJSON(): string {
    return this.toISO();
  }
}
