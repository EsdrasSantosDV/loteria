import { PageResult } from 'src/common/application/query-handlers/types-query-handler';
import { Result } from 'src/common/application/result';
import {
  GetLotteryDefinitionsQueryError,
  GetLotteryDefinitionsQueryHandler,
  LotteryDefinitionListItem,
} from 'src/lottery/application/out/queries/handlers/get-lottery-definitions.query-handler';
import { GetLotteryDefinitionsQuery } from 'src/lottery/application/out/queries/query/get-lottery-definitions.query';
import { LotteryDefinitionRepositoryPort } from 'src/lottery/application/out/repositories/lottery-definition-repository.port';

export class GetLotteryDefinitionsQueryHandlerImpl extends GetLotteryDefinitionsQueryHandler {
  constructor(
    private readonly lotteryDefinitionRepository: LotteryDefinitionRepositoryPort,
  ) {
    super();
  }

  async doExecute(
    input: GetLotteryDefinitionsQuery,
  ): Promise<
    Result<
      PageResult<LotteryDefinitionListItem>,
      GetLotteryDefinitionsQueryError
    >
  > {
    const { search, page, pageSize } = input;
    const definitionsPageResult =
      await this.lotteryDefinitionRepository.getDefinitions(
        search,
        page,
        pageSize,
      );

    return Result.ok({
      items: definitionsPageResult.map((definition) => ({
        id: definition.getId().getValue(),
        name: definition.getName(),
        description: definition.getDescription(),
        gameCode: definition.getCode(),
        minPicks: definition.getPickCount().min,
        maxPicks: definition.getPickCount().max,
        numberPoolMaxNumbers: definition.getNumberPool().getMax(),
        icon: definition.getIcon(),
      })),
      page,
      pageSize,
      total: definitionsPageResult.length,
      hasNext: definitionsPageResult.length === pageSize,
    });
  }
}
