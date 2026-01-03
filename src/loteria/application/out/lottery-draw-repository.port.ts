import { RepositoryPort } from 'src/common/application/ports/repository.port';
import { LotteryDraw } from 'src/loteria/domain/aggregates/lottery-draw.aggregate';
import { LotteryDrawId } from 'src/loteria/domain/identifiers/lottery-draw.id';

export abstract class LotteryDrawRepositoryPort extends RepositoryPort<
  LotteryDraw,
  LotteryDrawId
> {
  abstract existsByGameAndContest(
    gameId: string,
    contestNumber: number,
  ): Promise<boolean>;
}
