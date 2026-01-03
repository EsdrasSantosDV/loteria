import { Controller, Post } from '@nestjs/common';
import { ZodBody } from 'src/common/adapters/http/zod/zod-body.decorator';
import { CreateLotteryBetUseCase } from 'src/lottery/application/in/use-cases/create-lottery-bet.use-case';
import {
  CreateLotteryBetSchema,
  CreateLotteryBetInput,
} from '../requests/create-lottery-bet.schema';

@Controller('loteria')
export class BetsController {
  constructor(
    private readonly createLotteryBetUseCase: CreateLotteryBetUseCase,
  ) {}

  @Post('bets')
  async createBet(
    @ZodBody(CreateLotteryBetSchema) body: CreateLotteryBetInput,
  ) {
    return this.createLotteryBetUseCase.execute({
      ...body,
      correlationId: crypto.randomUUID(),
    });
  }
}
