import { Controller, Get, Post } from '@nestjs/common';
import { ZodBody } from 'src/common/adapters/http/zod/zod-body.decorator';
import { CreateLotteryDrawUseCase } from 'src/loteria/application/in/use-cases/create-lottery-draw.use-case';
import {
  CreateLotteryDrawSchema,
  CreateLotteryDrawInput,
} from '../requests/create-lottery-draw.schema';

@Controller('loteria')
export class LoteriaController {
  constructor(
    private readonly createLotteryDrawUseCase: CreateLotteryDrawUseCase,
  ) {}

  @Post('draws')
  async createDraw(
    @ZodBody(CreateLotteryDrawSchema) body: CreateLotteryDrawInput,
  ) {
    return this.createLotteryDrawUseCase.execute({
      ...body,
      correlationId: crypto.randomUUID(),
    });
  }
}
