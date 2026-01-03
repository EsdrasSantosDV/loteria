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
import { PrizePolicy, PrizeTier } from '../policies/prize-policy';

export enum BetStatus {
  PLACED = 'PLACED',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

export class LotteryBet extends AggregateRoot<LotteryBetId> {
  private readonly _drawId: LotteryDrawId;
  private readonly _gameId: LotteryGameId;

  private readonly _numbers: BetNumbers;
  private readonly _price: Money;
  private readonly _placedAt: InstantVO;

  private _status: BetStatus;
  private _settlement?: PrizeTier | null;

  constructor(properties: {
    id: LotteryBetId;
    drawId: LotteryDrawId;
    gameId: LotteryGameId;
    numbers: BetNumbers;
    price: Money;
    placedAt: InstantVO;
    status: BetStatus;
    settlement?: PrizeTier | null;
  }) {
    super(properties.id);
    this._drawId = properties.drawId;
    this._gameId = properties.gameId;
    this._numbers = properties.numbers;
    this._price = properties.price;
    this._placedAt = properties.placedAt;
    this._status = properties.status;
    this._settlement = properties.settlement;
  }

  public static create(params: {
    id: string;
    drawId: string;
    gameId: string;
    numbers: BetNumbers;
    price: Money;
  }): LotteryBet {
    return new LotteryBet({
      id: LotteryBetId.from(params.id),
      drawId: LotteryDrawId.from(params.drawId),
      gameId: LotteryGameId.from(params.gameId),
      numbers: params.numbers,
      price: params.price,
      placedAt: InstantVO.now(),
      status: BetStatus.PLACED,
    });
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
  public getSettlement() {
    return this._settlement;
  }

  public getStatus(): BetStatus {
    return this._status;
  }

  public settle(params: { drawNumbers: number[]; prizePolicy: PrizePolicy }) {
    if (this._status === BetStatus.SETTLED) {
      return this._settlement ?? null;
    }

    if (this._status !== BetStatus.PLACED) {
      return null;
    }
    const drawnSet = new Set<number>(params.drawNumbers);

    let matches = 0;
    for (const n of this._numbers.value) {
      if (drawnSet.has(n)) matches++;
    }

    const prizeTier = params.prizePolicy.evaluate(matches);

    this._settlement = prizeTier;

    this._status = BetStatus.SETTLED;

    return this._settlement;
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
