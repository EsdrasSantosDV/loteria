import { RepositoryPort } from 'src/common/application/ports/repository.port';
import { LotteryDraw } from 'src/lottery/domain/aggregates/lottery-draw.aggregate';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';

export abstract class LotteryDrawRepositoryPort extends RepositoryPort<
  LotteryDraw,
  LotteryDrawId
> {
  abstract existsByGameAndContest(
    gameId: string,
    contestNumber: number,
  ): Promise<boolean>;
}
