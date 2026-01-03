import { CommandUseCase } from 'src/common/application/use-cases/types-use-case';
import { ApplyDrawResultCommand } from '../commands/apply-draw-result.command';
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

export class DrawAlreadyHasResultError extends AppError<
  'LOTTERY_DRAW_ALREADY_HAS_RESULT',
  'Sorteio já possui resultado',
  { drawId: string }
> {
  constructor(drawId: string) {
    super({
      code: 'LOTTERY_DRAW_ALREADY_HAS_RESULT',
      message: 'Sorteio já possui resultado',
      kind: 'INVARIANT',
      meta: { drawId },
    });
  }
}

export type ApplyDrawResultError =
  | DrawNotFoundError
  | GameDefinitionNotFoundError
  | DrawAlreadyHasResultError;

export type ApplyDrawResultOutput = {
  drawId: string;
  numbers: number[];
};

export abstract class ApplyDrawResultUseCase extends CommandUseCase<
  ApplyDrawResultCommand,
  ApplyDrawResultOutput,
  ApplyDrawResultError
> {}

