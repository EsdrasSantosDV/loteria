import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoteriaModule } from './loteria/bootstrap/loteria.module';
import { CommonModule } from './common/bootstrap/common.module';

@Module({
  imports: [LoteriaModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
