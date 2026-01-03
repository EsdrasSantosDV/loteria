import { Result } from 'src/common/application/result';
import { LotteryDrawRepositoryPort } from '../../out/lottery-draw-repository.port';
import { OpenLotteryDrawCommand } from '../commands/open-lottery-draw.command';
import {
  OpenLotteryDrawUseCase,
  OpenLotteryDrawError,
  OpenLotteryDrawOutput,
  DrawNotFoundError,
  DrawAlreadyDrawnError,
} from '../use-cases/open-lottery-draw.use-case';
import { LotteryDrawId } from 'src/loteria/domain/identifiers/lottery-draw.id';
import { DrawStatus } from 'src/loteria/domain/aggregates/lottery-draw.aggregate';

export class OpenLotteryDrawUseCaseImpl extends OpenLotteryDrawUseCase {
  constructor(private readonly drawRepo: LotteryDrawRepositoryPort) {
    super();
  }

  async doExecute(
    input: OpenLotteryDrawCommand,
  ): Promise<Result<OpenLotteryDrawOutput, OpenLotteryDrawError>> {
    const { drawId } = input;
    const draw = await this.drawRepo.findById(LotteryDrawId.from(drawId));

    if (!draw) {
      return Result.fail(new DrawNotFoundError(drawId));
    }

    if (draw.getStatus() === DrawStatus.DRAWN) {
      return Result.fail(new DrawAlreadyDrawnError(drawId));
    }

    const updatedDraw = draw.open();
    await this.drawRepo.save(updatedDraw);

    return Result.ok({
      drawId: updatedDraw.getId().getValue(),
      status: updatedDraw.getStatus(),
    });
  }
}
