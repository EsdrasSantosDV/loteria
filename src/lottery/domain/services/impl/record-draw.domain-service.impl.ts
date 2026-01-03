import { MessagesError } from 'src/common/domain/error/messages.error.enum';
import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';
import { DrawStatus } from '../../aggregates/lottery-draw.aggregate';
import { DrawNumbers } from '../../vo/draw-numbers.vo';
import {
  RecordDrawDomainService,
  RecordDrawParams,
} from '../abstract/record-draw.domain-service';

export class RecordDrawDomainServiceImpl extends RecordDrawDomainService {
  protected preValidate(
    params: RecordDrawParams,
    handler: ValidationHandler,
  ): void {
    const { draw, game } = params;

    if (draw.getStatus() === DrawStatus.OPEN) {
      handler.append(
        new DomainError(MessagesError.LOTTERY_DRAW_CLOSE_BEFORE_RECORD),
      );
    }

    if (draw.getStatus() === DrawStatus.DRAWN) {
      handler.append(
        new DomainError(MessagesError.LOTTERY_DRAW_ALREADY_HAS_RESULT),
      );
    }

    if (!game.getId().equals(draw.getGameId())) {
      handler.append(new DomainError(MessagesError.LOTTERY_DRAW_GAME_MISMATCH));
    }
  }

  protected doExecute(params: RecordDrawParams) {
    const { draw, game, numbers } = params;

    const drawNumbers = DrawNumbers.create({
      numbers,
      pool: game.getNumberPool(),
      drawCount: game.getDrawCount(),
    });

    draw.applyDrawResult(drawNumbers);
    return draw;
  }
}
