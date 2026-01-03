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
        const host = cfg.get<string>('redis.host', 'localhost');
        const port = Number(cfg.get<string>('redis.port', '6379'));
        const password = cfg.get<string>('redis.password', '');
        const db = Number(cfg.get<string>('redis.db', '0'));

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
