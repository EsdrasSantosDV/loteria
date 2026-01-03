import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LotteryModule } from './lottery/bootstrap/lottery.module';
import { CommonModule } from './common/bootstrap/common.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/bootstrap/prisma.module';
import { AuthModule } from './common/bootstrap/auth.module';

@Module({
  imports: [
    LotteryModule,
    PrismaModule,
    CommonModule,
    AuthModule.register({
      environmentKey: 'ENVIRONMENT',
      localValue: 'local',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
