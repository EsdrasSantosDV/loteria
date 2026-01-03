import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LotteryModule } from './lottery/bootstrap/lottery.module';
import { CommonModule } from './common/bootstrap/common.module';

@Module({
  imports: [LotteryModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
