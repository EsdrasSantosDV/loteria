import { Provider } from '@nestjs/common';
import { GetLotteryDefinitionsQueryHandler } from '../application/out/queries/handlers/get-lottery-definitions.query-handler';
import { GetLotteryDefinitionsQueryHandlerImpl } from '../adapters/out/query-handlers/get-lottery-definitions.query-handler.impl';
import { LotteryDefinitionRepositoryPort } from '../application/out/repositories/lottery-definition-repository.port';

export const queryProviders: Provider[] = [
  {
    provide: GetLotteryDefinitionsQueryHandler,
    useFactory: (defRepo: LotteryDefinitionRepositoryPort) =>
      new GetLotteryDefinitionsQueryHandlerImpl(defRepo),
    inject: [LotteryDefinitionRepositoryPort],
  },
];
