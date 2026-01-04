import { Result, Fail } from '../result';
import { AppError } from '../errors/app-error';
import { QueryMeta, Query } from './query-context';
import { UseCase } from '../use-cases/use-case';

export abstract class QueryHandler<
  IN extends object & Query,
  OUT,
  E extends AppError = AppError,
> extends UseCase<IN & QueryMeta, OUT, E> {
  public execute(input: IN): Promise<Result<OUT, E>> {
    const ctx: QueryMeta = {
      correlationId: input.correlationId,
      actorId: input.actorId,
      requestedAt: input.requestedAt,
      locale: input.locale,
      readConsistency: input.readConsistency,
      cache: input.cache,
    };

    return super.execute(input as IN & QueryMeta, ctx);
  }
}

export class NoQueryInput {
  private constructor() {}
  static readonly instance = new NoQueryInput();
}

export abstract class NoInputQueryHandler<
  OUT,
  E extends AppError = AppError,
> extends UseCase<NoQueryInput & QueryMeta, OUT, E> {
  public executeNoInput(ctx: QueryMeta = {}): Promise<Result<OUT, E>> {
    return super.execute(Object.assign(NoQueryInput.instance, ctx), ctx);
  }
}

export type PageRequest = {
  page: number;
  pageSize: number;
};

export type PageResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
};
