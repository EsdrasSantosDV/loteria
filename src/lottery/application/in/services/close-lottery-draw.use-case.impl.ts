import { Result } from 'src/common/application/result';
import { LotteryDrawRepositoryPort } from '../../out/repositories/lottery-draw-repository.port';
import { CloseLotteryDrawCommand } from '../commands/close-lottery-draw.command';
import {
  CloseLotteryDrawUseCase,
  CloseLotteryDrawError,
  CloseLotteryDrawOutput,
  DrawNotFoundError,
  DrawNotOpenError,
} from '../use-cases/close-lottery-draw.use-case';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { DrawStatus } from 'src/lottery/domain/aggregates/lottery-draw.aggregate';

export class CloseLotteryDrawUseCaseImpl extends CloseLotteryDrawUseCase {
  constructor(private readonly drawRepo: LotteryDrawRepositoryPort) {
    super();
  }

  async doExecute(
    input: CloseLotteryDrawCommand,
  ): Promise<Result<CloseLotteryDrawOutput, CloseLotteryDrawError>> {
    const { drawId } = input;
    const draw = await this.drawRepo.findById(LotteryDrawId.from(drawId));

    if (!draw) {
      return Result.fail(new DrawNotFoundError(drawId));
    }

    if (draw.getStatus() !== DrawStatus.OPEN) {
      return Result.fail(new DrawNotOpenError(drawId));
    }

    const updatedDraw = draw.closeBets();
    await this.drawRepo.save(updatedDraw);

    return Result.ok({
      drawId: updatedDraw.getId().getValue(),
      status: updatedDraw.getStatus(),
    });
  }
}
