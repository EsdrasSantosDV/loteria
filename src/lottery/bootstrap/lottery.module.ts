import { Module } from '@nestjs/common';
import { DrawsController } from '../adapters/in/controllers/draws.controller';
import { BetsController } from '../adapters/in/controllers/bets.controller';

import { serviceProviders } from './service.providers';
import { repositoryProviders } from './repository.providers';

@Module({
  imports: [],
  providers: [...serviceProviders, ...repositoryProviders],
  controllers: [DrawsController, BetsController],
})
export class LotteryModule {}
