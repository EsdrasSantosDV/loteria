import { LotteryDrawRepositoryPort } from 'src/lottery/application/out/repositories/lottery-draw-repository.port';
import { LotteryDraw } from 'src/lottery/domain/aggregates/lottery-draw.aggregate';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { PrismaService } from 'src/common/adapters/prisma/prisma.service';
import { LotteryDrawMapper } from './mappers/lottery-draw.mapper';

export class PrismaLotteryDrawRepositoryAdapter extends LotteryDrawRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: LotteryDrawId): Promise<LotteryDraw | null> {
    const dbRecord = await this.prisma.lottery_draw.findUnique({
      where: { id: id.getValue() },
    });

    if (!dbRecord) {
      return null;
    }

    return LotteryDrawMapper.toDomain(dbRecord);
  }

  async existsById(id: LotteryDrawId): Promise<boolean> {
    const count = await this.prisma.lottery_draw.count({
      where: { id: id.getValue() },
    });
    return count > 0;
  }

  async save(aggregate: LotteryDraw): Promise<void> {
    const drawNumbers = aggregate.getDrawNumbers();
    const drawNumbersJson = drawNumbers
      ? { numbers: drawNumbers.values }
      : null;

    await this.prisma.lottery_draw.upsert({
      where: { id: aggregate.getId().getValue() },
      create: {
        id: aggregate.getId().getValue(),
        game_id: aggregate.getGameId().getValue(),
        contest_number: aggregate.getContestNumber(),
        status: aggregate.getStatus(),
        draw_numbers: drawNumbersJson,
        is_settled: aggregate.isSettled(),
      },
      update: {
        game_id: aggregate.getGameId().getValue(),
        contest_number: aggregate.getContestNumber(),
        status: aggregate.getStatus(),
        draw_numbers: drawNumbersJson,
        is_settled: aggregate.isSettled(),
      },
    });
  }

  async deleteById(id: LotteryDrawId): Promise<void> {
    await this.prisma.lottery_draw.delete({
      where: { id: id.getValue() },
    });
  }

  async existsByGameAndContest(
    gameId: string,
    contestNumber: number,
  ): Promise<boolean> {
    const count = await this.prisma.lottery_draw.count({
      where: {
        game_id: gameId,
        contest_number: contestNumber,
      },
    });
    return count > 0;
  }
}
