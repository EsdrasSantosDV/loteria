import { CommandUseCase } from 'src/common/application/use-cases/types-use-case';
import { CreateLotteryBetCommand } from '../commands/create-lottery-bet.command';
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

export type CreateLotteryBetError =
  | DrawNotFoundError
  | GameDefinitionNotFoundError
  | DrawNotOpenError;

export type CreateLotteryBetOutput = {
  betId: string;
  drawId: string;
  gameId: string;
  numbers: number[];
  price: {
    amount: number;
    currency: string;
  };
};

export abstract class CreateLotteryBetUseCase extends CommandUseCase<
  CreateLotteryBetCommand,
  CreateLotteryBetOutput,
  CreateLotteryBetError
> {}
