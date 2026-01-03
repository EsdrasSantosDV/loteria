import { AppError } from '../errors/app-error';
import { Result } from '../result';
import { UseCase } from './use-case';
import { CommandMeta } from './use-case-context';

export class Unit {
  private constructor() {}
  static readonly instance = new Unit();
}

export class NoInput {
  private constructor() {}
  static readonly instance = new NoInput();
}

export abstract class NoInputUseCase<
  OUT,
  E extends AppError = AppError,
> extends UseCase<NoInput, OUT, E> {
  public executeNoInput(ctx: CommandMeta = {}): Promise<Result<OUT, E>> {
    return super.execute(NoInput.instance, ctx);
  }
}

export abstract class UnitUseCase<
  IN extends object,
  E extends AppError = AppError,
> extends UseCase<IN, Unit, E> {}

export type Command = {
  correlationId?: string;
  idempotencyKey?: string;
  actorId?: string;
};

export abstract class CommandUseCase<
  IN extends object & Command,
  OUT,
  E extends AppError = AppError,
> extends UseCase<IN, OUT, E> {
  public execute(input: IN): Promise<Result<OUT, E>> {
    const ctx: CommandMeta = {
      correlationId: input.correlationId,
      idempotencyKey: input.idempotencyKey,
      actorId: input.actorId,
    };
    return super.execute(input, ctx);
  }
}
