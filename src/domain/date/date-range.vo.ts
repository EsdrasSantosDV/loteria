import { ValueObject } from '../value-object';
import { LocalDateVO } from './local-date.vo';

export class DateRangeVO extends ValueObject {
  private readonly _start: LocalDateVO;
  private readonly _end: LocalDateVO;

  private constructor(start: LocalDateVO, end: LocalDateVO) {
    super();

    if (end.isBefore(start)) {
      throw new Error(`DateRange: 'end' must be >= 'start'`);
    }

    this._start = start;
    this._end = end;
  }

  public static create(start: LocalDateVO, end: LocalDateVO): DateRangeVO {
    return new DateRangeVO(start, end);
  }

  public get start(): LocalDateVO {
    return this._start;
  }

  public get end(): LocalDateVO {
    return this._end;
  }

  public contains(date: LocalDateVO): boolean {
    const afterOrEqStart = !date.isBefore(this._start);
    const beforeOrEqEnd = !date.isAfter(this._end);
    return afterOrEqStart && beforeOrEqEnd;
  }

  public overlaps(other: DateRangeVO): boolean {
    return !this._start.isAfter(other._end) && !other._start.isAfter(this._end);
  }

  public toString(): string {
    return `${this._start.toISO()}..${this._end.toISO()}`;
  }

  protected override toPrimitive(): unknown {
    return { start: this._start.toISO(), end: this._end.toISO() };
  }

  public toJSON(): { start: string; end: string } {
    return { start: this._start.toISO(), end: this._end.toISO() };
  }
}
