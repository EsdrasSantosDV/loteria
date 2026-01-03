import { Module } from '@nestjs/common';
import { LoteriaController } from '../adapters/in/controllers/loteria.controller';

import { serviceProviders } from './service.providers';
import { repositoryProviders } from './repository.providers';

@Module({
  imports: [],
  providers: [...serviceProviders, ...repositoryProviders],
  controllers: [LoteriaController],
})
export class LoteriaModule {}
