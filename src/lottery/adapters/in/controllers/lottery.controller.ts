import { Controller, Get } from '@nestjs/common';
import { ZodQuery } from 'src/common/adapters/http/zod/zod-body.decorator';
import { GetLotteryDefinitionsQueryHandler } from 'src/lottery/application/out/queries/handlers/get-lottery-definitions.query-handler';
import {
  GetLotteryDefinitionsSchema,
  GetLotteryDefinitionsInput,
} from '../requests/get-lottery-definitions.schema';

@Controller('loteria')
export class LotteryController {
  constructor(
    private readonly getLotteryDefinitionsQueryHandler: GetLotteryDefinitionsQueryHandler,
  ) {}

  @Get('definitions')
  async getLotteryDefinitions(
    @ZodQuery(GetLotteryDefinitionsSchema) query: GetLotteryDefinitionsInput,
  ) {
    return this.getLotteryDefinitionsQueryHandler.execute(query);
  }
}
