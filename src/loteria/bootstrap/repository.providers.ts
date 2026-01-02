import { Provider } from '@nestjs/common';
import { InMemoryLotteryDefinitionRepositoryAdapter } from '../adapters/out/memory/in-memory-lottery-definition-repository.adapter';
import { LotteryDefinitionRepositoryPort } from '../application/out/lottery-definition-repository.port';
import { InMemoryLotteryBetRepositoryAdapter } from '../adapters/out/memory/in-memory-lottery-bet-repository.adapter';
import { InMemoryLotteryDrawRepositoryAdapter } from '../adapters/out/memory/in-memory-lottery-draw-repository.adapter';
import { LotteryBetRepositoryPort } from '../application/out/lottery-bet-repository.port';
import { LotteryDrawRepositoryPort } from '../application/out/lottery-draw-repository.port';

export const repositoryProviders: Provider[] = [
  {
    provide: LotteryDefinitionRepositoryPort,
    useClass: InMemoryLotteryDefinitionRepositoryAdapter,
  },
  {
    provide: LotteryBetRepositoryPort,
    useClass: InMemoryLotteryBetRepositoryAdapter,
  },
  {
    provide: LotteryDrawRepositoryPort,
    useClass: InMemoryLotteryDrawRepositoryAdapter,
  },
];
