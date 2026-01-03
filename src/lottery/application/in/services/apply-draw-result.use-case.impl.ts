import { Result } from 'src/common/application/result';
import { LotteryDrawRepositoryPort } from '../../out/lottery-draw-repository.port';
import { LotteryDefinitionRepositoryPort } from '../../out/lottery-definition-repository.port';
import { ApplyDrawResultCommand } from '../commands/apply-draw-result.command';
import {
  ApplyDrawResultUseCase,
  ApplyDrawResultError,
  ApplyDrawResultOutput,
  DrawNotFoundError,
  GameDefinitionNotFoundError,
  DrawAlreadyHasResultError,
} from '../use-cases/apply-draw-result.use-case';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { DrawStatus } from 'src/lottery/domain/aggregates/lottery-draw.aggregate';
import { RecordDrawDomainService } from 'src/lottery/domain/services/abstract/record-draw.domain-service';

export class ApplyDrawResultUseCaseImpl extends ApplyDrawResultUseCase {
  constructor(
    private readonly drawRepo: LotteryDrawRepositoryPort,
    private readonly definitionRepo: LotteryDefinitionRepositoryPort,
    private readonly recordDrawDomainService: RecordDrawDomainService,
  ) {
    super();
  }

  async doExecute(
    input: ApplyDrawResultCommand,
  ): Promise<Result<ApplyDrawResultOutput, ApplyDrawResultError>> {
    const { drawId, numbers } = input;
    const draw = await this.drawRepo.findById(LotteryDrawId.from(drawId));

    if (!draw) {
      return Result.fail(new DrawNotFoundError(drawId));
    }

    if (draw.getStatus() === DrawStatus.DRAWN) {
      return Result.fail(new DrawAlreadyHasResultError(drawId));
    }

    const gameId = draw.getGameId();
    const definition = await this.definitionRepo.findById(gameId);

    if (!definition) {
      return Result.fail(new GameDefinitionNotFoundError(gameId.getValue()));
    }

    const updatedDraw = this.recordDrawDomainService.execute({
      draw,
      game: definition,
      numbers,
    });
    await this.drawRepo.save(updatedDraw);

    return Result.ok({
      drawId: updatedDraw.getId().getValue(),
      numbers: updatedDraw.getDrawNumbers()?.values ?? [],
    });
  }
}
