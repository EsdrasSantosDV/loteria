import { DomainService } from 'src/common/domain/services/domain-servive-abstract';
import { LotteryBet } from '../../aggregates/lottery-bet.aggregate';
import { LotteryDraw } from '../../aggregates/lottery-draw.aggregate';
import { PrizePolicy, PrizeTier } from '../../policies/prize-policy';

export type SettleBetResult = {
  matches: number;
  prizeTier: PrizeTier | null;
};

export type SettleBetParams = {
  bet: LotteryBet;
  draw: LotteryDraw;
  prizePolicy: PrizePolicy;
};

export abstract class SettleBetDomainService extends DomainService<
  SettleBetParams,
  void
> {}
