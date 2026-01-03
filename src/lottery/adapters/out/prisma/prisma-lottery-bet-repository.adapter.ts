import { LotteryBetRepositoryPort } from 'src/lottery/application/out/repositories/lottery-bet-repository.port';
import { LotteryBet } from 'src/lottery/domain/aggregates/lottery-bet.aggregate';
import { LotteryBetId } from 'src/lottery/domain/identifiers/lottery-bet.id';
import { PrismaService } from 'src/common/adapters/prisma/prisma.service';
import { LotteryBetMapper } from './mappers/lottery-bet.mapper';
import {
  ListBetsByDrawParams,
  PaginatedBetsResult,
} from 'src/lottery/application/out/repositories/lottery-bet-repository.port';

export class PrismaLotteryBetRepositoryAdapter extends LotteryBetRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: LotteryBetId): Promise<LotteryBet | null> {
    const dbRecord = await this.prisma.lottery_bet.findUnique({
      where: { id: id.getValue() },
    });

    if (!dbRecord) {
      return null;
    }

    return LotteryBetMapper.toDomain(dbRecord);
  }

  async existsById(id: LotteryBetId): Promise<boolean> {
    const count = await this.prisma.lottery_bet.count({
      where: { id: id.getValue() },
    });
    return count > 0;
  }

  async save(aggregate: LotteryBet): Promise<void> {
    const numbersJson = {
      numbers: aggregate.getNumbers().value,
      length: aggregate.getNumbers().value.length,
    };
    const settlement = aggregate.getSettlement();
    const settlementJson = settlement
      ? {
          name: settlement.name,
          matchCount: settlement.matchCount,
        }
      : null;

    await this.prisma.lottery_bet.upsert({
      where: { id: aggregate.getId().getValue() },
      create: {
        id: aggregate.getId().getValue(),
        draw_id: aggregate.getDrawId().getValue(),
        game_id: aggregate.getGameId().getValue(),
        numbers: numbersJson,
        price: aggregate.getPrice().amountCents / 100,
        currency: aggregate.getPrice().currency,
        placed_at: new Date(aggregate.getPlacedAt().toISO()),
        status: aggregate.getStatus(),
        settlement: settlementJson,
      },
      update: {
        draw_id: aggregate.getDrawId().getValue(),
        game_id: aggregate.getGameId().getValue(),
        numbers: numbersJson,
        price: aggregate.getPrice().amountCents / 100,
        currency: aggregate.getPrice().currency,
        placed_at: new Date(aggregate.getPlacedAt().toISO()),
        status: aggregate.getStatus(),
        settlement: settlementJson,
      },
    });
  }

  async deleteById(id: LotteryBetId): Promise<void> {
    await this.prisma.lottery_bet.delete({
      where: { id: id.getValue() },
    });
  }

  async count(): Promise<number> {
    return this.prisma.lottery_bet.count();
  }

  async findAll(): Promise<LotteryBet[]> {
    const dbRecords = await this.prisma.lottery_bet.findMany();
    return dbRecords.map((record) =>
      LotteryBetMapper.toDomain(
        record as Parameters<typeof LotteryBetMapper.toDomain>[0],
      ),
    );
  }

  async listByDrawPaginated(
    params: ListBetsByDrawParams,
  ): Promise<PaginatedBetsResult> {
    const where = {
      draw_id: params.drawId.getValue(),
      ...(params.cursor && { id: { gt: params.cursor } }),
    };

    const dbRecords = await this.prisma.lottery_bet.findMany({
      where,
      take: params.limit + 1,
      orderBy: { id: 'asc' },
    });

    const hasNextPage = dbRecords.length > params.limit;
    const items = hasNextPage ? dbRecords.slice(0, params.limit) : dbRecords;

    const nextCursor = hasNextPage
      ? (items[items.length - 1]?.id ?? null)
      : null;

    return {
      items: items.map((record) =>
        LotteryBetMapper.toDomain(
          record as Parameters<typeof LotteryBetMapper.toDomain>[0],
        ),
      ),
      nextCursor,
    };
  }

  async saveMany(bets: LotteryBet[]): Promise<void> {
    await Promise.all(bets.map((bet) => this.save(bet)));
  }
}
