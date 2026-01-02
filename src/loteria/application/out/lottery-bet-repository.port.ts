import { RepositoryPort } from 'src/common/application/ports/repository.port';
import { LotteryBet } from 'src/loteria/domain/aggregates/lottery-bet.aggregate';
import { LotteryBetId } from 'src/loteria/domain/identifiers/lottery-bet.id';

export abstract class LotteryBetRepositoryPort extends RepositoryPort<
  LotteryBet,
  LotteryBetId
> {}
