import { Result, Fail } from '../result';
import { AppError } from '../errors/app-error';
import { CommandMeta } from './use-case-context';

export abstract class UseCase<
  IN extends object & CommandMeta,
  OUT,
  E extends AppError = AppError,
> {
  public async execute(
    input: IN,
    ctx: CommandMeta = {},
  ): Promise<Result<OUT, E>> {
    const pre = await this.preValidate(input, ctx);
    if (pre) return pre;

    const result = await this.doExecute(input, ctx);

    await this.postExecute(input, result, ctx);

    return result;
  }

  protected async preValidate(
    _input: IN,
    _ctx: CommandMeta,
  ): Promise<Fail<E> | null> {
    return null;
  }

  protected abstract doExecute(
    input: IN,
    ctx: CommandMeta,
  ): Promise<Result<OUT, E>>;

  protected async postExecute(
    _input: IN,
    _result: Result<OUT, E>,
    _ctx: CommandMeta,
  ): Promise<void> {}
}
