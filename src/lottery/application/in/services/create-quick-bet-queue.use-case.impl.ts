import { Result } from 'src/common/application/result';
import { LotteryDrawRepositoryPort } from '../../out/repositories/lottery-draw-repository.port';
import { CreateQuickBetQueueCommand } from '../commands/create-quick-bet-queue.command';
import {
  CreateQuickBetQueueUseCase,
  CreateQuickBetQueueError,
  CreateQuickBetQueueOutput,
  DrawNotFoundError,
  InvalidCountError,
} from '../use-cases/create-quick-bet-queue.use-case';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { JobQueuePort } from '../../out/jobs/job-queue.port';

export class CreateQuickBetQueueUseCaseImpl extends CreateQuickBetQueueUseCase {
  constructor(
    private readonly drawRepo: LotteryDrawRepositoryPort,
    private readonly jobQueue: JobQueuePort,
  ) {
    super();
  }

  async doExecute(
    input: CreateQuickBetQueueCommand,
  ): Promise<Result<CreateQuickBetQueueOutput, CreateQuickBetQueueError>> {
    const { drawId, count } = input;

    if (count <= 0) {
      return Result.fail(new InvalidCountError(count));
    }

    const draw = await this.drawRepo.findById(LotteryDrawId.from(drawId));

    if (!draw) {
      return Result.fail(new DrawNotFoundError(drawId));
    }

    await this.jobQueue.enqueueCreateQuickBet({
      drawId,
      count,
    });

    return Result.ok({
      drawId,
      count,
      jobId: `create-quick-bet-${drawId}-${Date.now()}`,
    });
  }
}
