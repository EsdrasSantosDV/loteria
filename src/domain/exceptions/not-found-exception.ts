import { AggregateRoot } from '../aggregate-root';
import { Identifier } from '../identifier';
import { DomainException } from './domain-exception';

export class NotFoundException extends DomainException {
  protected constructor(message: string) {
    super(message, []);
  }

  public static forAggregate(
    aggregate: { new (...args: any[]): AggregateRoot<any> },
    id: Identifier,
  ): NotFoundException {
    const message = `${aggregate.name} with ID ${id.value} was not found`;
    return new NotFoundException(message);
  }
}
