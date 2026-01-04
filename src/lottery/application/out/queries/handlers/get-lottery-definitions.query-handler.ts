import { LotteryGameCode } from 'src/lottery/domain/aggregates/lottery-game-definition.aggregate';
import { GetLotteryDefinitionsQuery } from '../query/get-lottery-definitions.query';
import {
  PageResult,
  QueryHandler,
} from 'src/common/application/query-handlers/types-query-handler';

export type LotteryDefinitionListItem = {
  id: string;
  name: string;
  description: string;
  gameCode: LotteryGameCode;
  minPicks: number;
  maxPicks: number;
  icon: string;
};

export abstract class GetLotteryDefinitionsQueryHandler extends QueryHandler<
  GetLotteryDefinitionsQuery,
  PageResult<LotteryDefinitionListItem>
> {}
