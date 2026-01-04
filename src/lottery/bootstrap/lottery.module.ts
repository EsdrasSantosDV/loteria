import { Module } from '@nestjs/common';
import { DrawsController } from '../adapters/in/controllers/draws.controller';
import { BetsController } from '../adapters/in/controllers/bets.controller';

import { serviceProviders } from './service.providers';
import { repositoryProviders } from './repository.providers';
import { QueueModule } from 'src/common/bootstrap/queue.module';
import { LotteryProcessor } from '../adapters/out/queue/lottery.processor';
import { queryProviders } from './query.providers';
import { LotteryController } from '../adapters/in/controllers/lottery.controller';

@Module({
  imports: [QueueModule],
  providers: [
    ...serviceProviders,
    ...repositoryProviders,
    ...queryProviders,
    LotteryProcessor,
  ],
  controllers: [DrawsController, BetsController, LotteryController],
})
export class LotteryModule {}
