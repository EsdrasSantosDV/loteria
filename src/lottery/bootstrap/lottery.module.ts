import { Module } from '@nestjs/common';
import { DrawsController } from '../adapters/in/controllers/draws.controller';
import { BetsController } from '../adapters/in/controllers/bets.controller';

import { serviceProviders } from './service.providers';
import { repositoryProviders } from './repository.providers';
import { QueueModule } from 'src/common/bootstrap/queue.module';
import { LotteryProcessor } from '../adapters/out/queue/lottery.processor';

@Module({
  imports: [QueueModule],
  providers: [...serviceProviders, ...repositoryProviders, LotteryProcessor],
  controllers: [DrawsController, BetsController],
})
export class LotteryModule {}
