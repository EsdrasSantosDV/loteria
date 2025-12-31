import { Controller, Get } from '@nestjs/common';
import { LoteriaService } from './loteria.service';

@Controller('loteria')
export class LoteriaController {
  constructor(private readonly loteriaService: LoteriaService) {}

  @Get('mega-ultra')
  gerarMegaUltra(): number[] {
    return this.loteriaService.gerarMegaUltra();
  }
}
