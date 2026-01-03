import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LOTTERY_QUEUE } from 'src/common/bootstrap/queue.module';
import { JOB_SETTLE_DRAW } from './bull-mq-job-queue.adapter';

@Processor(LOTTERY_QUEUE)
export class LotteryProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job): Promise<unknown> {
    switch (job.name) {
      case JOB_SETTLE_DRAW:
        return { ok: true };
      default:
        return { ignored: true };
    }
  }
}
