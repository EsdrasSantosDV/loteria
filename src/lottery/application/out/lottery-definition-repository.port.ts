import { RepositoryPort } from 'src/common/application/ports/repository.port';
import {
  LotteryGameCode,
  LotteryGameDefinition,
} from 'src/lottery/domain/aggregates/lottery-game-definition.aggregate';
import { LotteryGameId } from 'src/lottery/domain/identifiers/lottery-game.id';

export abstract class LotteryDefinitionRepositoryPort extends RepositoryPort<
  LotteryGameDefinition,
  LotteryGameId
> {
  abstract getByCode(
    code: LotteryGameCode,
  ): Promise<LotteryGameDefinition | null>;
}
