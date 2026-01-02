import { Temporal } from '@js-temporal/polyfill';
import { ValueObject } from '../value-object';
import { InstantVO } from './instant-date.vo';
import { LocalDateVO } from './local-date.vo';

export class ZonedDateTimeVO extends ValueObject {
  private readonly _value: Temporal.ZonedDateTime;

  private constructor(value: Temporal.ZonedDateTime) {
    super();
    this._value = value;
  }

  public static nowIn(timeZone: string): ZonedDateTimeVO {
    return new ZonedDateTimeVO(Temporal.Now.zonedDateTimeISO(timeZone));
  }

  public static fromISO(isoZdt: string): ZonedDateTimeVO {
    return new ZonedDateTimeVO(Temporal.ZonedDateTime.from(isoZdt));
  }

  public toISO(): string {
    return this._value.toString();
  }

  public toInstant(): InstantVO {
    return InstantVO.fromISO(this._value.toInstant().toString());
  }

  public toPlainDate(): LocalDateVO {
    return LocalDateVO.fromISO(this._value.toPlainDate().toString());
  }

  protected override toPrimitive(): unknown {
    return this.toISO();
  }

  public toJSON(): string {
    return this.toISO();
  }
}
