import { Module } from '@nestjs/common';
import { LoteriaController } from '../loteria.controller';
import { LoteriaService } from '../loteria.service';

@Module({
  imports: [],
  controllers: [LoteriaController],
  providers: [LoteriaService],
})
export class LoteriaModule {}
