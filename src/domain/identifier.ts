import { ValueObject } from './value-object';

export abstract class Identifier<T = string> extends ValueObject {
  protected readonly _value: T;

  protected constructor(value: T) {
    super();
    if (value === null || value === undefined) {
      throw new Error(`'value' must not be null`);
    }
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public toString(): string {
    return String(this._value);
  }

  public equals(other?: Identifier<T>): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this.value === other.value;
  }
}
