import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LOTTERY_QUEUE } from 'src/common/bootstrap/queue.module';
import {
  JOB_SETTLE_DRAW,
  JOB_CREATE_QUICK_BET,
} from './bull-mq-job-queue.adapter';
import { SettleLotteryDrawUseCase } from 'src/lottery/application/in/use-cases/settle-lottery-draw.use-case';
import { CreateQuickBetUseCase } from 'src/lottery/application/in/use-cases/create-quick-bet.use-case';
import { CloseLotteryDrawUseCase } from 'src/lottery/application/in/use-cases/close-lottery-draw.use-case';
import { ApplyDrawResultUseCase } from 'src/lottery/application/in/use-cases/apply-draw-result.use-case';
import { LotteryDrawRepositoryPort } from 'src/lottery/application/out/repositories/lottery-draw-repository.port';
import { LotteryDefinitionRepositoryPort } from 'src/lottery/application/out/repositories/lottery-definition-repository.port';
import { RandomNumberGeneratorDomainService } from 'src/lottery/domain/services/abstract/random-number-generator.domain-service';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';

@Processor(LOTTERY_QUEUE)
export class LotteryProcessor extends WorkerHost {
  constructor(
    private readonly settleLotteryDrawUseCase: SettleLotteryDrawUseCase,
    private readonly createQuickBetUseCase: CreateQuickBetUseCase,
    private readonly closeLotteryDrawUseCase: CloseLotteryDrawUseCase,
    private readonly applyDrawResultUseCase: ApplyDrawResultUseCase,
    private readonly drawRepo: LotteryDrawRepositoryPort,
    private readonly definitionRepo: LotteryDefinitionRepositoryPort,
    private readonly randomNumberGenerator: RandomNumberGeneratorDomainService,
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

      case JOB_CREATE_QUICK_BET: {
        const { drawId, count } = job.data as { drawId: string; count: number };

        for (let i = 0; i < count; i++) {
          await this.createQuickBetUseCase.execute({
            drawId,
            correlationId: `${job.id}-${i}`,
          });
        }

        const draw = await this.drawRepo.findById(LotteryDrawId.from(drawId));
        if (!draw) {
          return { ok: false, error: 'Draw not found' };
        }

        const gameId = draw.getGameId();
        const definition = await this.definitionRepo.findById(gameId);
        if (!definition) {
          return { ok: false, error: 'Game definition not found' };
        }

        await this.closeLotteryDrawUseCase.execute({
          drawId,
          correlationId: `${job.id}-close`,
        });

        const randomNumbers = this.randomNumberGenerator.execute({
          pool: definition.getNumberPool(),
          count: definition.getDrawCount(),
        });

        await this.applyDrawResultUseCase.execute({
          drawId,
          numbers: randomNumbers,
          correlationId: `${job.id}-apply-result`,
        });

        return { ok: true, created: count, numbers: randomNumbers };
      }

      default:
        return { ignored: true };
    }
  }
}
