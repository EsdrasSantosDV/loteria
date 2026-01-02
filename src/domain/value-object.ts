export abstract class ValueObject {
  protected abstract toPrimitive(): unknown;

  public equals(other?: ValueObject): boolean {
    if (!other) return false;
    if (this === other) return true;
    if (this.constructor !== other.constructor) return false;

    return (
      JSON.stringify(this.toPrimitive()) === JSON.stringify(other.toPrimitive())
    );
  }
}
