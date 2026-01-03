import { Controller, Post, Param, Get } from '@nestjs/common';
import { ZodBody } from 'src/common/adapters/http/zod/zod-body.decorator';
import { CreateLotteryBetUseCase } from 'src/lottery/application/in/use-cases/create-lottery-bet.use-case';
import {
  CreateLotteryBetSchema,
  CreateLotteryBetInput,
} from '../requests/create-lottery-bet.schema';
import { CreateQuickBetUseCase } from 'src/lottery/application/in/use-cases/create-quick-bet.use-case';
import { LotteryBetRepositoryPort } from 'src/lottery/application/out/repositories/lottery-bet-repository.port';
import { Result } from 'src/common/application/result';

@Controller('loteria')
export class BetsController {
  constructor(
    private readonly createLotteryBetUseCase: CreateLotteryBetUseCase,
    private readonly createQuickBetUseCase: CreateQuickBetUseCase,
    private readonly betsRepo: LotteryBetRepositoryPort,
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

  @Post('bets/quick/:drawId')
  async createQuickBet(@Param('drawId') drawId: string) {
    return this.createQuickBetUseCase.execute({
      drawId,
      correlationId: crypto.randomUUID(),
    });
  }

  @Post('bets/batch/:drawId/:count')
  async createBatchBets(
    @Param('drawId') drawId: string,
    @Param('count') count: number,
  ) {
    console.log(`Creating ${count} bets for draw ${drawId}`);
    for (let i = 0; i < count; i++) {
      const result = await this.createQuickBetUseCase.execute({
        drawId,
        correlationId: crypto.randomUUID(),
      });
      if (Result.isFail(result)) {
        console.error(result.error.message);
        break;
      }
    }
    return { message: 'Bets created successfully' };
  }

  @Get('bets/count')
  async getBetLength() {
    return this.betsRepo.count();
  }

  @Get('bets/list')
  async getBetList() {
    return this.betsRepo.findAll();
  }
}
