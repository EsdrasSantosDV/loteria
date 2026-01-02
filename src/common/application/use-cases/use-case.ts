import { Result, Fail } from '../result';
import { AppError } from '../errors/app-error';
import { UseCaseContext } from './use-case-context';

export abstract class UseCase<
  IN extends object,
  OUT,
  E extends AppError = AppError,
> {
  public async execute(
    input: IN,
    ctx: UseCaseContext = {},
  ): Promise<Result<OUT, E>> {
    const pre = await this.preValidate(input, ctx);
    if (pre) return pre;

    const result = await this.doExecute(input, ctx);

    await this.postExecute(input, result, ctx);

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async preValidate(
    _input: IN,
    _ctx: UseCaseContext,
  ): Promise<Fail<E> | null> {
    return null;
  }

  protected abstract doExecute(
    input: IN,
    ctx: UseCaseContext,
  ): Promise<Result<OUT, E>>;

  protected async postExecute(
    _input: IN,
    _result: Result<OUT, E>,
    _ctx: UseCaseContext,
  ): Promise<void> {}
}
