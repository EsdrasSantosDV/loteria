import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { LOTTERY_QUEUE } from 'src/common/bootstrap/queue.module';
import {
  JobQueuePort,
  SettleDrawJob,
  CreateQuickBetJob,
} from 'src/lottery/application/out/jobs/job-queue.port';

export const JOB_SETTLE_DRAW = 'SETTLE_DRAW';
export const JOB_CREATE_QUICK_BET = 'CREATE_QUICK_BET';

@Injectable()
export class BullMqJobQueueAdapter extends JobQueuePort {
  constructor(@InjectQueue(LOTTERY_QUEUE) private readonly queue: Queue) {
    super();
  }

  async enqueueSettleDraw(payload: SettleDrawJob): Promise<void> {
    const sanitizedDrawId = payload.drawId.replace(/:/g, '-');
    const jobId = `settle-${sanitizedDrawId}`;

    const job = await this.queue.add(JOB_SETTLE_DRAW, payload, {
      jobId,
      attempts: 10,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    });
  }

  async enqueueCreateQuickBet(payload: CreateQuickBetJob): Promise<void> {
    const sanitizedDrawId = payload.drawId.replace(/:/g, '-');
    const jobId = `create-quick-bet-${sanitizedDrawId}-${Date.now()}`;

    const job = await this.queue.add(JOB_CREATE_QUICK_BET, payload, {
      jobId,
      attempts: 10,
      backoff: { type: 'exponential', delay: 5_000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    });
  }
}
