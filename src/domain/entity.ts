import { ValidationHandler } from './validation/validation-handler';
import { Identifier } from './identifier';

export abstract class Entity<ID extends Identifier = Identifier> {
  protected readonly _id: ID;

  protected constructor(id: ID) {
    if (!id) {
      throw new Error(`'id' should not be null`);
    }
    this._id = id;
  }

  public abstract validate(handler: ValidationHandler): void;

  public getId(): ID {
    return this._id;
  }

  public equals(object?: unknown): boolean {
    if (this === object) return true;
    if (!object || object === null) return false;

    const other = object as Entity<ID>;
    if (other.constructor !== this.constructor) return false;

    return this.getId().equals(other.getId());
  }

  public hashCode(): string {
    return this.getId().toString();
  }
}
