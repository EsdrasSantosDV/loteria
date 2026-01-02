import { Module } from '@nestjs/common';
import { LoteriaController } from '../loteria.controller';
import { LoteriaService } from '../loteria.service';
import { serviceProviders } from './service.providers';
import { repositoryProviders } from './repository.providers';

@Module({
  imports: [],
  providers: [...serviceProviders, ...repositoryProviders, LoteriaService],
  controllers: [LoteriaController],
})
export class LoteriaModule {}
