import { Result } from 'src/common/application/result';
import { LotteryDefinitionRepositoryPort } from '../../out/lottery-definition-repository.port';
import { LotteryDrawRepositoryPort } from '../../out/lottery-draw-repository.port';
import { CreateLotteryDrawCommand } from '../commands/create-lottery-draw.command';
import {
  CreateLotteryDrawUseCase,
  CreateLotteryDrawError,
  CreateLotteryDrawOutput,
} from '../use-cases/create-lottery-draw.use-case';

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
    return Result.ok({
      drawId: '123',
    });
  }
}
