import { WithQueryMeta } from 'src/common/application/query-handlers/query-context';
import { PageRequest } from 'src/common/application/query-handlers/types-query-handler';

export type GetLotteryDefinitionsQuery = WithQueryMeta<
  {
    search?: string;
  } & PageRequest
>;
