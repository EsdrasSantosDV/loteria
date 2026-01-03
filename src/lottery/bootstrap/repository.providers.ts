import { Provider } from '@nestjs/common';
import { InMemoryLotteryDefinitionRepositoryAdapter } from '../adapters/out/memory/in-memory-lottery-definition-repository.adapter';
import { LotteryDefinitionRepositoryPort } from '../application/out/repositories/lottery-definition-repository.port';
import { InMemoryLotteryBetRepositoryAdapter } from '../adapters/out/memory/in-memory-lottery-bet-repository.adapter';
import { InMemoryLotteryDrawRepositoryAdapter } from '../adapters/out/memory/in-memory-lottery-draw-repository.adapter';
import { LotteryBetRepositoryPort } from '../application/out/repositories/lottery-bet-repository.port';
import { LotteryDrawRepositoryPort } from '../application/out/repositories/lottery-draw-repository.port';
import { PrismaService } from 'src/common/adapters/prisma/prisma.service';
import { PrismaLotteryDefinitionRepositoryAdapter } from '../adapters/out/prisma/prisma-lottery-definition-repository.adapter';
import { PrismaLotteryDrawRepositoryAdapter } from '../adapters/out/prisma/prisma-lottery-draw-repository.adapter';
import { PrismaLotteryBetRepositoryAdapter } from '../adapters/out/prisma/prisma-lottery-bet-repository.adapter';

export const repositoryProviders: Provider[] = [
  {
    provide: LotteryDefinitionRepositoryPort,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
      const driver = process.env.ADAPTER_REPO;
      switch (driver) {
        case 'prisma':
          return new PrismaLotteryDefinitionRepositoryAdapter(prisma);

        case 'memory':
        default:
          return new InMemoryLotteryDefinitionRepositoryAdapter();
      }
    },
  },
  {
    provide: LotteryBetRepositoryPort,
    useFactory: (prisma: PrismaService) => {
      const driver = process.env.ADAPTER_REPO;
      switch (driver) {
        case 'prisma':
          return new PrismaLotteryBetRepositoryAdapter(prisma);

        case 'memory':
        default:
          return new InMemoryLotteryBetRepositoryAdapter();
      }
    },
    inject: [PrismaService],
  },
  {
    provide: LotteryDrawRepositoryPort,
    useFactory: (prisma: PrismaService) => {
      const driver = process.env.ADAPTER_REPO;
      switch (driver) {
        case 'prisma':
          return new PrismaLotteryDrawRepositoryAdapter(prisma);

        case 'memory':
        default:
          return new InMemoryLotteryDrawRepositoryAdapter();
      }
    },
    inject: [PrismaService, LotteryDefinitionRepositoryPort],
  },
];
