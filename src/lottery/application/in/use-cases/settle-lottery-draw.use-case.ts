import { UnitUseCase } from 'src/common/application/use-cases/types-use-case';
import { SettleLotteryDrawCommand } from '../commands/settle-lottery-draw.command';
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

export class GameDefinitionNotFoundError extends AppError<
  'LOTTERY_GAME_DEFINITION_NOT_FOUND',
  'Definição do jogo não encontrada',
  { gameId: string }
> {
  constructor(gameId: string) {
    super({
      code: 'LOTTERY_GAME_DEFINITION_NOT_FOUND',
      message: 'Definição do jogo não encontrada',
      kind: 'NOT_FOUND',
      meta: { gameId },
    });
  }
}

export class DrawNotDrawnError extends AppError<
  'LOTTERY_DRAW_NOT_DRAWN',
  'Sorteio ainda não foi realizado',
  { drawId: string }
> {
  constructor(drawId: string) {
    super({
      code: 'LOTTERY_DRAW_NOT_DRAWN',
      message: 'Sorteio ainda não foi realizado',
      kind: 'INVARIANT',
      meta: { drawId },
    });
  }
}

export type SettleLotteryDrawError =
  | DrawNotFoundError
  | GameDefinitionNotFoundError
  | DrawNotDrawnError;

export abstract class SettleLotteryDrawUseCase extends UnitUseCase<
  SettleLotteryDrawCommand,
  SettleLotteryDrawError
> {}
