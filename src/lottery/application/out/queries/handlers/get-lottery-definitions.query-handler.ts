import { LotteryGameCode } from 'src/lottery/domain/aggregates/lottery-game-definition.aggregate';
import { GetLotteryDefinitionsQuery } from '../query/get-lottery-definitions.query';
import {
  PageResult,
  QueryHandler,
} from 'src/common/application/query-handlers/types-query-handler';
import {
  AppError,
  ErrorMetadata,
} from 'src/common/application/errors/app-error';

export type LotteryDefinitionListItem = {
  id: string;
  name: string;
  description: string;
  gameCode: LotteryGameCode;
  numberPoolMaxNumbers: number;
  minPicks: number;
  maxPicks: number;
  icon: string;
};

export class GetLotteryDefinitionsQueryError extends AppError<
  string,
  string,
  ErrorMetadata
> {
  constructor(message: string) {
    super({
      code: 'GET_LOTTERY_DEFINITIONS_QUERY_ERROR',
      message,
      kind: 'INTERNAL',
      meta: {
        error: message,
      },
    });
  }
}

export abstract class GetLotteryDefinitionsQueryHandler extends QueryHandler<
  GetLotteryDefinitionsQuery,
  PageResult<LotteryDefinitionListItem>,
  GetLotteryDefinitionsQueryError
> {}
