import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const LOTTERY_QUEUE = 'lottery';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const host = cfg.get<string>('REDIS_HOST', 'localhost');
        const port = Number(cfg.get<string>('REDIS_PORT', '6379'));
        const password = cfg.get<string>('REDIS_PASSWORD', '');
        const db = Number(cfg.get<string>('REDIS_DB', '0'));

        return {
          connection: {
            host,
            port,
            db,
            ...(password ? { password } : {}),
          },
          defaultJobOptions: { removeOnComplete: 1000, removeOnFail: 5000 },
        };
      },
    }),

    BullModule.registerQueue({
      name: LOTTERY_QUEUE,
      defaultJobOptions: { removeOnComplete: 1000, removeOnFail: 5000 },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
