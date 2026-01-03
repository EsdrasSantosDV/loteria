import { RepositoryPort } from 'src/common/application/ports/repository.port';
import { LotteryBet } from 'src/lottery/domain/aggregates/lottery-bet.aggregate';
import { LotteryBetId } from 'src/lottery/domain/identifiers/lottery-bet.id';

export abstract class LotteryBetRepositoryPort extends RepositoryPort<
  LotteryBet,
  LotteryBetId
> {
  abstract count(): Promise<number>;
  abstract findAll(): Promise<LotteryBet[]>;
}
