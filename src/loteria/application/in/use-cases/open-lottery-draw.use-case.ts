import { CommandUseCase } from 'src/common/application/use-cases/types-use-case';
import { OpenLotteryDrawCommand } from '../commands/open-lottery-draw.command';
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

export class DrawAlreadyDrawnError extends AppError<
  'LOTTERY_DRAW_ALREADY_DRAWN',
  'Sorteio já foi realizado',
  { drawId: string }
> {
  constructor(drawId: string) {
    super({
      code: 'LOTTERY_DRAW_ALREADY_DRAWN',
      message: 'Sorteio já foi realizado',
      kind: 'INVARIANT',
      meta: { drawId },
    });
  }
}

export type OpenLotteryDrawError = DrawNotFoundError | DrawAlreadyDrawnError;

export type OpenLotteryDrawOutput = {
  drawId: string;
  status: string;
};

export abstract class OpenLotteryDrawUseCase extends CommandUseCase<
  OpenLotteryDrawCommand,
  OpenLotteryDrawOutput,
  OpenLotteryDrawError
> {}
