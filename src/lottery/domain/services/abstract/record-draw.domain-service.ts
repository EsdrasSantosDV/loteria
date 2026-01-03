import { AggregateDomainService } from 'src/common/domain/services/aggregate-domain-service';
import { LotteryDraw } from '../../aggregates/lottery-draw.aggregate';
import { LotteryGameDefinition } from '../../aggregates/lottery-game-definition.aggregate';

export type RecordDrawParams = {
  draw: LotteryDraw;
  game: LotteryGameDefinition;
  numbers: number[];
};

export abstract class RecordDrawDomainService extends AggregateDomainService<
  RecordDrawParams,
  LotteryDraw
> {}
