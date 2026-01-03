import { Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { ZodBody } from 'src/common/adapters/http/zod/zod-body.decorator';
import { CreateLotteryDrawUseCase } from 'src/loteria/application/in/use-cases/create-lottery-draw.use-case';
import {
  CreateLotteryDrawSchema,
  CreateLotteryDrawInput,
} from '../requests/create-lottery-draw.schema';
import { OpenLotteryDrawUseCase } from 'src/loteria/application/in/use-cases/open-lottery-draw.use-case';
import { CloseLotteryDrawUseCase } from 'src/loteria/application/in/use-cases/close-lottery-draw.use-case';
import { ApplyDrawResultUseCase } from 'src/loteria/application/in/use-cases/apply-draw-result.use-case';
import {
  ApplyDrawResultSchema,
  ApplyDrawResultInput,
} from '../requests/apply-draw-result.schema';

@Controller('loteria')
export class DrawsController {
  constructor(
    private readonly createLotteryDrawUseCase: CreateLotteryDrawUseCase,
    private readonly openLotteryDrawUseCase: OpenLotteryDrawUseCase,
    private readonly closeLotteryDrawUseCase: CloseLotteryDrawUseCase,
    private readonly applyDrawResultUseCase: ApplyDrawResultUseCase,
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

  @Patch('draws/:drawId/open')
  async openDraw(@Param('drawId') drawId: string) {
    return this.openLotteryDrawUseCase.execute({
      drawId,
      correlationId: crypto.randomUUID(),
    });
  }

  @Patch('draws/:drawId/close')
  async closeDraw(@Param('drawId') drawId: string) {
    return this.closeLotteryDrawUseCase.execute({
      drawId,
      correlationId: crypto.randomUUID(),
    });
  }

  @Patch('draws/:drawId/result')
  async applyDrawResult(
    @Param('drawId') drawId: string,
    @ZodBody(ApplyDrawResultSchema) body: Omit<ApplyDrawResultInput, 'drawId'>,
  ) {
    return this.applyDrawResultUseCase.execute({
      drawId,
      ...body,
      correlationId: crypto.randomUUID(),
    });
  }
}
