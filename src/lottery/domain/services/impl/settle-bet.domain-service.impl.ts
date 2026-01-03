import {
  SettleBetDomainService,
  SettleBetParams,
} from '../abstract/settle-bet.domain-service';
import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';
import { MessagesError } from 'src/common/domain/error/messages.error.enum';

export class SettleBetDomainServiceImpl extends SettleBetDomainService {
  protected preValidate(
    params: SettleBetParams,
    handler: ValidationHandler,
  ): void {
    const { bet, draw } = params;

    //     if (!bet.getDrawId().equals(draw.getId())) {
    //       handler.append(new DomainError(MessagesError.LOTTERY_BET_DRAW_MISMATCH));
    //     }

    //     if (!draw.getDrawNumbers()) {
    //       handler.append(
    //         new DomainError(MessagesError.LOTTERY_DRAW_DRAWN_WITHOUT_NUMBERS),
    //       );
    //     }
    //   }
  }
  protected doExecute(params: SettleBetParams) {
    const { bet, draw, prizePolicy } = params;

    const drawNumbers = draw.getDrawNumbers()?.values ?? [];

    bet.settle({
      drawNumbers,
      prizePolicy,
    });
  }
}
