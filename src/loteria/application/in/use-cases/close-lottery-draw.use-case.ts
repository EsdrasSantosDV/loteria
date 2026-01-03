import { CommandUseCase } from 'src/common/application/use-cases/types-use-case';
import { CloseLotteryDrawCommand } from '../commands/close-lottery-draw.command';
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

export class DrawNotOpenError extends AppError<
  'LOTTERY_DRAW_NOT_OPEN',
  'Sorteio não está aberto para apostas',
  { drawId: string }
> {
  constructor(drawId: string) {
    super({
      code: 'LOTTERY_DRAW_NOT_OPEN',
      message: 'Sorteio não está aberto para apostas',
      kind: 'INVARIANT',
      meta: { drawId },
    });
  }
}

export type CloseLotteryDrawError = DrawNotFoundError | DrawNotOpenError;

export type CloseLotteryDrawOutput = {
  drawId: string;
  status: string;
};

export abstract class CloseLotteryDrawUseCase extends CommandUseCase<
  CloseLotteryDrawCommand,
  CloseLotteryDrawOutput,
  CloseLotteryDrawError
> {}
