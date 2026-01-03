import { CommandUseCase } from 'src/common/application/use-cases/types-use-case';
import { CreateQuickBetQueueCommand } from '../commands/create-quick-bet-queue.command';
import { AppError } from 'src/common/application/errors/app-error';

export class DrawNotFoundError extends AppError<
  'LOTTERY_DRAW_NOT_FOUND',
  'Sorteio não encontrado',
  { drawId: string }
> {
  constructor(drawId: string) {
    super({
      code: 'LOTTERY_DRAW_NOT_FOUND',
      message: 'Sorteio não encontrado',
      kind: 'NOT_FOUND',
      meta: { drawId },
    });
  }
}

export class InvalidCountError extends AppError<
  'INVALID_COUNT',
  'Quantidade deve ser maior que zero',
  { count: number }
> {
  constructor(count: number) {
    super({
      code: 'INVALID_COUNT',
      message: 'Quantidade deve ser maior que zero',
      kind: 'INVARIANT',
      meta: { count },
    });
  }
}

export type CreateQuickBetQueueError = DrawNotFoundError | InvalidCountError;

export type CreateQuickBetQueueOutput = {
  drawId: string;
  count: number;
  jobId: string;
};

export abstract class CreateQuickBetQueueUseCase extends CommandUseCase<
  CreateQuickBetQueueCommand,
  CreateQuickBetQueueOutput,
  CreateQuickBetQueueError
> {}
