import { LotteryDrawRepositoryPort } from 'src/lottery/application/out/lottery-draw-repository.port';
import {
  LotteryDraw,
  DrawStatus,
} from 'src/lottery/domain/aggregates/lottery-draw.aggregate';
import { LotteryDrawId } from 'src/lottery/domain/identifiers/lottery-draw.id';
import { DrawNumbers } from 'src/lottery/domain/vo/draw-numbers.vo';
import { NumberPool } from 'src/lottery/domain/vo/number-pool.vo';

const MEGA_SENA_POOL = NumberPool.create(1, 60);
const MEGA_SENA_DRAW_COUNT = 6;

export const MEGA_SENA_DRAW_001 = LotteryDraw.create({
  id: 'draw-mega-sena-001',
  gameId: 'mega-sena-001',
  contestNumber: 2800,
  status: DrawStatus.OPEN,
});

export const MEGA_SENA_DRAW_002 = LotteryDraw.create({
  id: 'draw-mega-sena-002',
  gameId: 'mega-sena-001',
  contestNumber: 2801,
  status: DrawStatus.OPEN,
});

export const MEGA_SENA_DRAW_003 = (() => {
  const draw = LotteryDraw.create({
    id: 'draw-mega-sena-003',
    gameId: 'mega-sena-001',
    contestNumber: 2799,
    status: DrawStatus.OPEN,
  });
  draw.closeBets();
  const drawNumbers = DrawNumbers.create({
    numbers: [4, 5, 10, 23, 33, 60],
    pool: MEGA_SENA_POOL,
    drawCount: MEGA_SENA_DRAW_COUNT,
  });
  draw.applyDrawResult(drawNumbers);
  return draw;
})();

const QUINA_POOL = NumberPool.create(1, 80);
const QUINA_DRAW_COUNT = 5;

export const QUINA_DRAW_001 = LotteryDraw.create({
  id: 'draw-quina-001',
  gameId: 'quina-001',
  contestNumber: 6500,
  status: DrawStatus.OPEN,
});

export const QUINA_DRAW_002 = (() => {
  const draw = LotteryDraw.create({
    id: 'draw-quina-002',
    gameId: 'quina-001',
    contestNumber: 6499,
    status: DrawStatus.OPEN,
  });
  draw.closeBets();
  const drawNumbers = DrawNumbers.create({
    numbers: [2, 15, 23, 45, 67],
    pool: QUINA_POOL,
    drawCount: QUINA_DRAW_COUNT,
  });
  draw.applyDrawResult(drawNumbers);
  return draw;
})();

const LOTOFACIL_POOL = NumberPool.create(1, 25);
const LOTOFACIL_DRAW_COUNT = 15;

export const LOTOFACIL_DRAW_001 = LotteryDraw.create({
  id: 'draw-lotofacil-001',
  gameId: 'lotofacil-001',
  contestNumber: 3200,
  status: DrawStatus.OPEN,
});

export const LOTOFACIL_DRAW_002 = (() => {
  const draw = LotteryDraw.create({
    id: 'draw-lotofacil-002',
    gameId: 'lotofacil-001',
    contestNumber: 3199,
    status: DrawStatus.OPEN,
  });
  draw.closeBets();
  const drawNumbers = DrawNumbers.create({
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    pool: LOTOFACIL_POOL,
    drawCount: LOTOFACIL_DRAW_COUNT,
  });
  draw.applyDrawResult(drawNumbers);
  return draw;
})();

const LOTOMANIA_POOL = NumberPool.create(0, 99, 2);
const LOTOMANIA_DRAW_COUNT = 20;

export const LOTOMANIA_DRAW_001 = LotteryDraw.create({
  id: 'draw-lotomania-001',
  gameId: 'lotomania-001',
  contestNumber: 2500,
  status: DrawStatus.OPEN,
});

export const LOTOMANIA_DRAW_002 = (() => {
  const draw = LotteryDraw.create({
    id: 'draw-lotomania-002',
    gameId: 'lotomania-001',
    contestNumber: 2499,
    status: DrawStatus.OPEN,
  });
  draw.closeBets();
  const drawNumbers = DrawNumbers.create({
    numbers: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ],
    pool: LOTOMANIA_POOL,
    drawCount: LOTOMANIA_DRAW_COUNT,
  });
  draw.applyDrawResult(drawNumbers);
  return draw;
})();

export class InMemoryLotteryDrawRepositoryAdapter extends LotteryDrawRepositoryPort {
  private readonly store = new Map<string, LotteryDraw>([
    [MEGA_SENA_DRAW_001.getId().getValue(), MEGA_SENA_DRAW_001],
    [MEGA_SENA_DRAW_002.getId().getValue(), MEGA_SENA_DRAW_002],
    [MEGA_SENA_DRAW_003.getId().getValue(), MEGA_SENA_DRAW_003],
    [QUINA_DRAW_001.getId().getValue(), QUINA_DRAW_001],
    [QUINA_DRAW_002.getId().getValue(), QUINA_DRAW_002],
    [LOTOFACIL_DRAW_001.getId().getValue(), LOTOFACIL_DRAW_001],
    [LOTOFACIL_DRAW_002.getId().getValue(), LOTOFACIL_DRAW_002],
    [LOTOMANIA_DRAW_001.getId().getValue(), LOTOMANIA_DRAW_001],
    [LOTOMANIA_DRAW_002.getId().getValue(), LOTOMANIA_DRAW_002],
  ]);

  async findById(id: LotteryDrawId): Promise<LotteryDraw | null> {
    return Promise.resolve(this.store.get(id.getValue()) ?? null);
  }

  existsById(id: LotteryDrawId): Promise<boolean> {
    return Promise.resolve(this.store.has(id.getValue()));
  }

  save(aggregate: LotteryDraw): Promise<void> {
    this.store.set(aggregate.getId().getValue(), aggregate);
    return Promise.resolve();
  }

  deleteById(id: LotteryDrawId): Promise<void> {
    this.store.delete(id.getValue());
    return Promise.resolve();
  }

  existsByGameAndContest(
    gameId: string,
    contestNumber: number,
  ): Promise<boolean> {
    return Promise.resolve(
      Array.from(this.store.values()).some(
        (draw) =>
          draw.getGameId().getValue() === gameId &&
          draw.getContestNumber() === contestNumber,
      ),
    );
  }
}
