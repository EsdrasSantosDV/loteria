import { DomainService } from './domain-servive-abstract';

export abstract class AggregateDomainService<
  TParams extends object,
  TResult = void,
> extends DomainService<TParams, TResult> {}
