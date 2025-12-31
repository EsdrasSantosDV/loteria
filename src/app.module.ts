import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoteriaModule } from './loteria/loteria.module';

@Module({
  imports: [LoteriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
