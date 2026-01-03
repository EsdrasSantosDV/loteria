import {
  LotteryBet,
  BetStatus,
} from 'src/lottery/domain/aggregates/lottery-bet.aggregate';
import { LotteryBetId } from 'src/lottery/domain/identifiers/lottery-bet.id';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { LotteryGameId } from 'src/lottery/domain/identifiers/lottery-game.id';
import { InstantVO } from 'src/common/domain/date/instant-date.vo';
import { BetNumbers } from 'src/lottery/domain/vo/bet-numbers.vo';
import { Money } from 'src/lottery/domain/vo/money.vo';
import { ECurrency } from 'src/lottery/domain/vo/ecurrency.enum';
import { PrizeTier } from 'src/lottery/domain/policies/prize-policy';
import { Prisma } from 'generated/prisma/client';

type LotteryBetPrismaRecord = Prisma.lottery_betGetPayload<{
  select: {
    id: true;
    draw_id: true;
    game_id: true;
    numbers: true;
    price: true;
    currency: true;
    placed_at: true;
    status: true;
    settlement: true;
  };
}>;

export class LotteryBetMapper {
  static toDomain(dbRecord: LotteryBetPrismaRecord): LotteryBet {
    const numbersArray =
      dbRecord.numbers &&
      typeof dbRecord.numbers === 'object' &&
      dbRecord.numbers !== null &&
      'numbers' in dbRecord.numbers &&
      'length' in dbRecord.numbers &&
      Array.isArray((dbRecord.numbers as { numbers: number[] }).numbers)
        ? (dbRecord.numbers as { numbers: number[]; length: number }).numbers
        : [];

    const betNumbers = BetNumbers.fromJson(numbersArray);

    const priceCents = Math.round(Number(dbRecord.price) * 100);
    const currency = dbRecord.currency as ECurrency;
    const money = Money.ofCents(priceCents, currency);

    const settlement =
      dbRecord.settlement &&
      typeof dbRecord.settlement === 'object' &&
      dbRecord.settlement !== null &&
      'name' in dbRecord.settlement &&
      'matchCount' in dbRecord.settlement
        ? (dbRecord.settlement as PrizeTier)
        : null;

    return new LotteryBet({
      id: LotteryBetId.from(String(dbRecord.id)),
      drawId: LotteryDrawId.from(String(dbRecord.draw_id)),
      gameId: LotteryGameId.from(String(dbRecord.game_id)),
      numbers: betNumbers,
      price: money,
      placedAt: InstantVO.fromISO((dbRecord.placed_at as Date).toISOString()),
      status: dbRecord.status as BetStatus,
      settlement,
    });
  }
}
