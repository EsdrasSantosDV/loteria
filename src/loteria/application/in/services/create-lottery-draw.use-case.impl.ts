import { Result } from 'src/common/application/result';
import { LotteryDefinitionRepositoryPort } from '../../out/lottery-definition-repository.port';
import { LotteryDrawRepositoryPort } from '../../out/lottery-draw-repository.port';
import { CreateLotteryDrawCommand } from '../commands/create-lottery-draw.command';
import {
  CreateLotteryDrawUseCase,
  CreateLotteryDrawError,
  CreateLotteryDrawOutput,
  GameDefinitionNotFoundError,
  DrawAlreadyExistsError,
} from '../use-cases/create-lottery-draw.use-case';
import { LotteryGameId } from 'src/loteria/domain/identifiers/lottery-game.id';
import { LotteryDrawId } from 'src/loteria/domain/identifiers/lottery-draw.id';
import { LotteryDraw } from 'src/loteria/domain/aggregates/lottery-draw.aggregate';

export class CreateLotteryDrawUseCaseImpl extends CreateLotteryDrawUseCase {
  constructor(
    private readonly definitionRepo: LotteryDefinitionRepositoryPort,
    private readonly drawRepo: LotteryDrawRepositoryPort,
  ) {
    super();
  }

  async doExecute(
    input: CreateLotteryDrawCommand,
  ): Promise<Result<CreateLotteryDrawOutput, CreateLotteryDrawError>> {
    const { gameId, contestNumber } = input;
    const definition = await this.definitionRepo.findById(
      LotteryGameId.from(gameId),
    );
    if (!definition) {
      return Result.fail(new GameDefinitionNotFoundError(gameId));
    }

    const alreadyExists = await this.drawRepo.existsByGameAndContest(
      gameId,
      contestNumber,
    );
    if (alreadyExists) {
      return Result.fail(new DrawAlreadyExistsError(gameId, contestNumber));
    }

    const drawId = LotteryDrawId.generate();
    const draw = LotteryDraw.create({
      id: drawId.value,
      gameId,
      contestNumber,
    });

    await this.drawRepo.save(draw);

    return Result.ok({
      drawId: draw.getId().getValue(),
    });
  }
}
