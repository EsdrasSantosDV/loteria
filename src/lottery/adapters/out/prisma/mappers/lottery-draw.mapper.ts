import {
  LotteryDraw,
  DrawStatus,
} from 'src/lottery/domain/aggregates/lottery-draw.aggregate';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { LotteryGameId } from 'src/lottery/domain/identifiers/lottery-game.id';
import { InstantVO } from 'src/common/domain/date/instant-date.vo';
import { DrawNumbers } from 'src/lottery/domain/vo/draw-numbers.vo';
import { Prisma } from 'generated/prisma/client';

type LotteryDrawPrismaRecord = Prisma.lottery_drawGetPayload<{
  select: {
    id: true;
    game_id: true;
    contest_number: true;
    created_at: true;
    status: true;
    draw_numbers: true;
    is_settled: true;
    settled_at: true;
  };
}>;

export class LotteryDrawMapper {
  static toDomain(dbRecord: LotteryDrawPrismaRecord): LotteryDraw {
    const drawNumbers =
      dbRecord.draw_numbers &&
      typeof dbRecord.draw_numbers === 'object' &&
      dbRecord.draw_numbers !== null &&
      'numbers' in dbRecord.draw_numbers
        ? DrawNumbers.fromJson(dbRecord.draw_numbers as { numbers: number[] })
        : undefined;

    return new LotteryDraw({
      id: LotteryDrawId.from(String(dbRecord.id)),
      gameId: LotteryGameId.from(String(dbRecord.game_id)),
      contestNumber: dbRecord.contest_number,
      scheduledAt: InstantVO.fromISO(
        (dbRecord.created_at as Date).toISOString(),
      ),
      status: dbRecord.status as DrawStatus,
      drawNumbers,
      settledAt: dbRecord.settled_at
        ? InstantVO.fromISO((dbRecord.settled_at as Date).toISOString())
        : undefined,
      isSettled: dbRecord.is_settled,
    });
  }
}
