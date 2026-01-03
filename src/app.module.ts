import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LotteryModule } from './lottery/bootstrap/lottery.module';
import { CommonModule } from './common/bootstrap/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LotteryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
