import { Temporal } from '@js-temporal/polyfill';
import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';
import { MessagesError } from 'src/common/domain/error/messages.error.enum';
import { LotteryGameId } from '../identifiers/lottery-game.id';
import { LotteryGameDefinition } from './lottery-game-definition.aggregate';
import { DrawNumbers } from '../vo/draw-numbers.vo';
import { LotteryDrawId } from '../identifiers/lottery-draw.id';
import { InstantVO } from 'src/common/domain/date/instant-date.vo';

export enum DrawStatus {
  SCHEDULED = 'SCHEDULED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAWN = 'DRAWN',
}

export class LotteryDraw extends AggregateRoot<LotteryDrawId> {
  private readonly _gameId: LotteryGameId;
  private readonly _contestNumber: number;
  private readonly _scheduledAt: InstantVO;

  private _status: DrawStatus;
  private _drawNumbers?: DrawNumbers;

  private _isSettled: boolean;
  private settledAt?: InstantVO;

  private constructor(
    id: LotteryDrawId,
    gameId: LotteryGameId,
    contestNumber: number,
    scheduledAt: InstantVO,
    status: DrawStatus,
    drawNumbers?: DrawNumbers,
  ) {
    super(id);
    this._gameId = gameId;
    this._contestNumber = contestNumber;
    this._scheduledAt = scheduledAt;
    this._status = status;
    this._drawNumbers = drawNumbers;
    this._isSettled = false;
  }

  public static create(params: {
    id: string;
    gameId: string;
    contestNumber: number;
    status?: DrawStatus;
  }): LotteryDraw {
    return new LotteryDraw(
      LotteryDrawId.from(params.id),
      LotteryGameId.from(params.gameId),
      params.contestNumber,
      InstantVO.now(),
      params.status ?? DrawStatus.SCHEDULED,
    );
  }

  public getGameId(): LotteryGameId {
    return this._gameId;
  }

  public getContestNumber(): number {
    return this._contestNumber;
  }

  public getScheduledAt(): InstantVO {
    return this._scheduledAt;
  }

  public getStatus(): DrawStatus {
    return this._status;
  }

  public getDrawNumbers(): DrawNumbers | undefined {
    return this._drawNumbers;
  }

  public open(): LotteryDraw {
    if (this._status === DrawStatus.DRAWN) {
      throw DomainException.with(
        new DomainError(MessagesError.LOTTERY_DRAW_ALREADY_DRAWN),
      );
    }
    this._status = DrawStatus.OPEN;
    return this;
  }

  public closeBets(): LotteryDraw {
    if (this._status !== DrawStatus.OPEN) {
      throw DomainException.with(
        new DomainError(MessagesError.LOTTERY_DRAW_NOT_OPEN),
      );
    }
    this._status = DrawStatus.CLOSED;
    return this;
  }

  public applyDrawResult(drawNumbers: DrawNumbers): LotteryDraw {
    if (this._status === DrawStatus.DRAWN) {
      throw DomainException.with(
        new DomainError(MessagesError.LOTTERY_DRAW_ALREADY_HAS_RESULT),
      );
    }

    this._drawNumbers = drawNumbers;
    this._status = DrawStatus.DRAWN;
    return this;
  }

  public isSettled(): boolean {
    return this._isSettled;
  }

  public markSettled(): LotteryDraw {
    this._isSettled = true;
    this.settledAt = InstantVO.now();
    return this;
  }

  public validate(handler: ValidationHandler): void {
    if (!this._gameId)
      handler.append(
        new DomainError(MessagesError.LOTTERY_DRAW_GAME_ID_REQUIRED),
      );

    if (!Number.isInteger(this._contestNumber) || this._contestNumber <= 0) {
      handler.append(
        new DomainError(MessagesError.LOTTERY_DRAW_CONTEST_NUMBER_INVALID),
      );
    }

    if (!this._scheduledAt)
      handler.append(
        new DomainError(MessagesError.LOTTERY_DRAW_SCHEDULED_AT_REQUIRED),
      );

    if (!this._status)
      handler.append(
        new DomainError(MessagesError.LOTTERY_DRAW_STATUS_REQUIRED),
      );

    if (this._status === DrawStatus.DRAWN && !this._drawNumbers) {
      handler.append(
        new DomainError(MessagesError.LOTTERY_DRAW_DRAWN_WITHOUT_NUMBERS),
      );
    }
  }
}
