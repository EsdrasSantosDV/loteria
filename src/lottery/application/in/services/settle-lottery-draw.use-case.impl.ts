import { Result } from 'src/common/application/result';
import { Unit } from 'src/common/application/use-cases/types-use-case';
import { LotteryDrawRepositoryPort } from '../../out/repositories/lottery-draw-repository.port';
import { LotteryDefinitionRepositoryPort } from '../../out/repositories/lottery-definition-repository.port';
import { LotteryBetRepositoryPort } from '../../out/repositories/lottery-bet-repository.port';
import { SettleLotteryDrawCommand } from '../commands/settle-lottery-draw.command';
import {
  SettleLotteryDrawUseCase,
  SettleLotteryDrawError,
  DrawNotFoundError,
  GameDefinitionNotFoundError,
  DrawNotDrawnError,
} from '../use-cases/settle-lottery-draw.use-case';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { DrawStatus } from 'src/lottery/domain/aggregates/lottery-draw.aggregate';
import { BetStatus } from 'src/lottery/domain/aggregates/lottery-bet.aggregate';

export class SettleLotteryDrawUseCaseImpl extends SettleLotteryDrawUseCase {
  private static readonly BATCH_SIZE = 2_000;

  constructor(
    private readonly drawRepo: LotteryDrawRepositoryPort,
    private readonly betRepo: LotteryBetRepositoryPort,
    private readonly defRepo: LotteryDefinitionRepositoryPort,
  ) {
    super();
  }

  async doExecute(
    input: SettleLotteryDrawCommand,
  ): Promise<Result<Unit, SettleLotteryDrawError>> {
    const { drawId } = input;
    const drawIdVO = LotteryDrawId.from(drawId);

    const draw = await this.drawRepo.findById(drawIdVO);

    if (!draw) {
      return Result.fail(new DrawNotFoundError(drawId));
    }

    if (draw.isSettled()) {
      return Result.ok(Unit.instance);
    }

    if (draw.getStatus() !== DrawStatus.DRAWN) {
      return Result.fail(new DrawNotDrawnError(drawId));
    }

    const gameId = draw.getGameId();
    const game = await this.defRepo.findById(gameId);

    if (!game) {
      return Result.fail(new GameDefinitionNotFoundError(gameId.getValue()));
    }

    const drawNumbers = draw.getDrawNumbers();
    if (!drawNumbers) {
      return Result.fail(new DrawNotDrawnError(drawId));
    }

    const prizePolicy = game.getPrizePolicy();

    let cursor: string | null = null;

    while (true) {
      const page = await this.betRepo.listByDrawPaginated({
        drawId: drawIdVO,
        cursor,
        limit: SettleLotteryDrawUseCaseImpl.BATCH_SIZE,
      });

      if (page.items.length === 0) break;

      const betsToSettle = page.items.filter(
        (bet) => bet.getStatus() === BetStatus.PLACED,
      );

      if (betsToSettle.length === 0) {
        cursor = page.nextCursor;
        if (!cursor) break;
        continue;
      }

      for (const bet of betsToSettle) {
        bet.settle({ drawNumbers: drawNumbers.values, prizePolicy });
      }

      await this.betRepo.saveMany(betsToSettle);
      cursor = page.nextCursor;
      if (!cursor) break;
    }

    draw.markSettled();
    await this.drawRepo.save(draw);

    return Result.ok(Unit.instance);
  }
}
