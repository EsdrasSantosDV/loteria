import { InstantVO } from 'src/common/domain/date/instant-date.vo';
import { BetNumbers } from '../vo/bet-numbers.vo';
import { Money } from '../vo/money.vo';
import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';
import { MessagesError } from 'src/common/domain/error/messages.error.enum';
import { LotteryBetId } from '../identifiers/lottery-bet.id';
import { LotteryDrawId } from '../identifiers/lottery-draw.id';
import { LotteryGameId } from '../identifiers/lottery-game.id';

export class LotteryBet extends AggregateRoot<LotteryBetId> {
  private readonly _drawId: LotteryDrawId;
  private readonly _gameId: LotteryGameId;

  private readonly _numbers: BetNumbers;
  private readonly _price: Money;
  private readonly _placedAt: InstantVO;

  private constructor(
    id: LotteryBetId,
    drawId: LotteryDrawId,
    gameId: LotteryGameId,
    numbers: BetNumbers,
    price: Money,
    placedAt: InstantVO,
  ) {
    super(id);
    this._drawId = drawId;
    this._gameId = gameId;
    this._numbers = numbers;
    this._price = price;
    this._placedAt = placedAt;
  }

  public static create(params: {
    id: string;
    drawId: string;
    gameId: string;
    numbers: BetNumbers;
    price: Money;
  }): LotteryBet {
    return new LotteryBet(
      LotteryBetId.from(params.id),
      LotteryDrawId.from(params.drawId),
      LotteryGameId.from(params.gameId),
      params.numbers,
      params.price,
      InstantVO.now(),
    );
  }

  public getDrawId(): LotteryDrawId {
    return this._drawId;
  }
  public getGameId(): LotteryGameId {
    return this._gameId;
  }
  public getNumbers(): BetNumbers {
    return this._numbers;
  }
  public getPrice(): Money {
    return this._price;
  }
  public getPlacedAt(): InstantVO {
    return this._placedAt;
  }

  public validate(handler: ValidationHandler): void {
    if (!this._drawId)
      handler.append(
        new DomainError(MessagesError.LOTTERY_BET_DRAW_ID_REQUIRED),
      );
    if (!this._gameId)
      handler.append(
        new DomainError(MessagesError.LOTTERY_BET_GAME_ID_REQUIRED),
      );
    if (!this._numbers)
      handler.append(
        new DomainError(MessagesError.LOTTERY_BET_NUMBERS_REQUIRED),
      );
    if (!this._price)
      handler.append(new DomainError(MessagesError.LOTTERY_BET_PRICE_REQUIRED));
    if (!this._placedAt)
      handler.append(
        new DomainError(MessagesError.LOTTERY_BET_PLACED_AT_REQUIRED),
      );
  }
}
