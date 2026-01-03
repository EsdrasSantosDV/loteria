import { Module } from '@nestjs/common';
import { DrawsController } from '../adapters/in/controllers/draws.controller';

import { serviceProviders } from './service.providers';
import { repositoryProviders } from './repository.providers';

@Module({
  imports: [],
  providers: [...serviceProviders, ...repositoryProviders],
  controllers: [DrawsController],
})
export class LotteryModule {}
