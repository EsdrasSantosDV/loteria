import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LOTTERY_QUEUE } from 'src/common/bootstrap/queue.module';
import { JOB_SETTLE_DRAW } from './bull-mq-job-queue.adapter';
import { SettleLotteryDrawUseCase } from 'src/lottery/application/in/use-cases/settle-lottery-draw.use-case';

@Processor(LOTTERY_QUEUE)
export class LotteryProcessor extends WorkerHost {
  constructor(
    private readonly settleLotteryDrawUseCase: SettleLotteryDrawUseCase,
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    switch (job.name) {
      case JOB_SETTLE_DRAW:
        await this.settleLotteryDrawUseCase.execute({
          drawId: String(job.data?.drawId ?? ''),
          correlationId: String(job.id ?? ''),
        });
        return { ok: true };

      default:
        return { ignored: true };
    }
  }
}
