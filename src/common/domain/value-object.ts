export abstract class ValueObject {
  protected abstract toPrimitive(): unknown;

  public equals(other?: ValueObject): boolean {
    if (!other) return false;
    if (this === other) return true;
    if (this.constructor !== other.constructor) return false;

    const a = this.toPrimitive();
    const b = other.toPrimitive();

    const replacer = (_: string, value: unknown) =>
      typeof value === 'bigint' ? value.toString() : value;

    return JSON.stringify(a, replacer) === JSON.stringify(b, replacer);
  }
}
