import { Result } from 'src/common/application/result';
import { LotteryDrawRepositoryPort } from '../../out/lottery-draw-repository.port';
import { LotteryDefinitionRepositoryPort } from '../../out/lottery-definition-repository.port';
import { LotteryBetRepositoryPort } from '../../out/lottery-bet-repository.port';
import { CreateLotteryBetCommand } from '../commands/create-lottery-bet.command';
import {
  CreateLotteryBetUseCase,
  CreateLotteryBetError,
  CreateLotteryBetOutput,
  DrawNotFoundError,
  GameDefinitionNotFoundError,
  DrawNotOpenError,
} from '../use-cases/create-lottery-bet.use-case';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { LotteryBetId } from 'src/lottery/domain/identifiers/lottery-bet.id';
import { DrawStatus } from 'src/lottery/domain/aggregates/lottery-draw.aggregate';
import { BetNumbers } from 'src/lottery/domain/vo/bet-numbers.vo';
import { LotteryBet } from 'src/lottery/domain/aggregates/lottery-bet.aggregate';

export class CreateLotteryBetUseCaseImpl extends CreateLotteryBetUseCase {
  constructor(
    private readonly drawRepo: LotteryDrawRepositoryPort,
    private readonly definitionRepo: LotteryDefinitionRepositoryPort,
    private readonly betRepo: LotteryBetRepositoryPort,
  ) {
    super();
  }

  async doExecute(
    input: CreateLotteryBetCommand,
  ): Promise<Result<CreateLotteryBetOutput, CreateLotteryBetError>> {
    const { drawId, numbers } = input;

    const draw = await this.drawRepo.findById(LotteryDrawId.from(drawId));

    if (!draw) {
      return Result.fail(new DrawNotFoundError(drawId));
    }

    if (draw.getStatus() !== DrawStatus.OPEN) {
      return Result.fail(new DrawNotOpenError(drawId));
    }

    const gameId = draw.getGameId();
    const definition = await this.definitionRepo.findById(gameId);

    if (!definition) {
      return Result.fail(new GameDefinitionNotFoundError(gameId.getValue()));
    }

    const betNumbers = BetNumbers.create(
      numbers,
      definition.getNumberPool(),
      definition.getPickCount(),
    );

    const price = definition.priceForPickCount(betNumbers.value.length);

    const betId = LotteryBetId.generate();
    const bet = LotteryBet.create({
      id: betId.getValue(),
      drawId,
      gameId: gameId.getValue(),
      numbers: betNumbers,
      price,
    });

    await this.betRepo.save(bet);

    return Result.ok({
      betId: bet.getId().getValue(),
      drawId: bet.getDrawId().getValue(),
      gameId: bet.getGameId().getValue(),
      numbers: [...bet.getNumbers().value],
      price: {
        amount: bet.getPrice().amountCents / 100,
        currency: bet.getPrice().currency,
      },
    });
  }
}
