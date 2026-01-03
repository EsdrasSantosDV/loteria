import { RepositoryPort } from 'src/common/application/ports/repository.port';
import { LotteryBet } from 'src/lottery/domain/aggregates/lottery-bet.aggregate';
import { LotteryBetId } from 'src/lottery/domain/identifiers/lottery-bet.id';

import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';

export type PaginatedBetsResult = {
  items: LotteryBet[];
  nextCursor: string | null;
};

export type ListBetsByDrawParams = {
  drawId: LotteryDrawId;
  cursor: string | null;
  limit: number;
};

export abstract class LotteryBetRepositoryPort extends RepositoryPort<
  LotteryBet,
  LotteryBetId
> {
  abstract count(): Promise<number>;
  abstract findAll(): Promise<LotteryBet[]>;
  abstract listByDrawPaginated(
    params: ListBetsByDrawParams,
  ): Promise<PaginatedBetsResult>;
  abstract saveMany(bets: LotteryBet[]): Promise<void>;
}
