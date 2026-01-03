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
import { LotteryDrawId } from 'src/loteria/domain/identifiers/lottery-draw.id';
import { LotteryGameId } from 'src/loteria/domain/identifiers/lottery-game.id';
import { DrawStatus } from 'src/loteria/domain/aggregates/lottery-draw.aggregate';
import { DrawNumbers } from 'src/loteria/domain/vo/draw-numbers.vo';

export class ApplyDrawResultUseCaseImpl extends ApplyDrawResultUseCase {
  constructor(
    private readonly drawRepo: LotteryDrawRepositoryPort,
    private readonly definitionRepo: LotteryDefinitionRepositoryPort,
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

    const drawNumbers = DrawNumbers.create({
      numbers,
      pool: definition.getNumberPool(),
      drawCount: definition.getDrawCount(),
    });

    const updatedDraw = draw.applyDrawResult(drawNumbers);
    await this.drawRepo.save(updatedDraw);

    return Result.ok({
      drawId: updatedDraw.getId().getValue(),
      numbers: drawNumbers.values,
    });
  }
}
