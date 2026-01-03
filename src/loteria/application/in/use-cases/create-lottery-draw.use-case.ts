import { CommandUseCase } from 'src/common/application/use-cases/types-use-case';
import { CreateLotteryDrawCommand } from '../commands/create-lottery-draw.command';
import { AppError } from 'src/common/application/errors/app-error';

export class InvalidScheduledAtError extends AppError<
  'INVALID_SCHEDULED_AT',
  'scheduledAt inválido',
  { scheduledAt: string }
> {
  constructor(scheduledAt: string) {
    super({
      code: 'INVALID_SCHEDULED_AT',
      message: 'scheduledAt inválido',
      kind: 'VALIDATION',
      meta: { scheduledAt },
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

export class DrawAlreadyExistsError extends AppError<
  'LOTTERY_DRAW_ALREADY_EXISTS',
  'Sorteio já existe para este concurso',
  { gameId: string; contestNumber: number }
> {
  constructor(gameId: string, contestNumber: number) {
    super({
      code: 'LOTTERY_DRAW_ALREADY_EXISTS',
      message: 'Sorteio já existe para este concurso',
      kind: 'CONFLICT',
      meta: { gameId, contestNumber },
    });
  }
}

export type CreateLotteryDrawError =
  | InvalidScheduledAtError
  | GameDefinitionNotFoundError
  | DrawAlreadyExistsError;

export type CreateLotteryDrawOutput = {
  drawId: string;
};

export abstract class CreateLotteryDrawUseCase extends CommandUseCase<
  CreateLotteryDrawCommand,
  CreateLotteryDrawOutput,
  CreateLotteryDrawError
> {}
