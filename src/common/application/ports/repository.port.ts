export abstract class RepositoryPort<A, ID> {
  abstract findById(id: ID): Promise<A | null>;
  abstract existsById(id: ID): Promise<boolean>;
  abstract save(aggregate: A): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
}
