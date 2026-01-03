import { LotteryBetRepositoryPort } from 'src/lottery/application/out/lottery-bet-repository.port';
import { LotteryBet } from 'src/lottery/domain/aggregates/lottery-bet.aggregate';
import { LotteryBetId } from 'src/lottery/domain/identifiers/lottery-bet.id';
import { BetNumbers } from 'src/lottery/domain/vo/bet-numbers.vo';
import { Money } from 'src/lottery/domain/vo/money.vo';
import { ECurrency } from 'src/lottery/domain/vo/ecurrency.enum';
import { NumberPool } from 'src/lottery/domain/vo/number-pool.vo';
import { PickCount } from 'src/lottery/domain/vo/pick-count.vo';

const MEGA_SENA_POOL = NumberPool.create(1, 60);
const MEGA_SENA_PICK = PickCount.create(6, 15);

export const MEGA_SENA_BET_001 = LotteryBet.create({
  id: 'bet-mega-sena-001',
  drawId: 'draw-mega-sena-001',
  gameId: 'mega-sena-001',
  numbers: BetNumbers.create(
    [1, 2, 3, 4, 5, 6],
    MEGA_SENA_POOL,
    MEGA_SENA_PICK,
  ),
  price: Money.ofCents(500, ECurrency.BRL),
});

export const MEGA_SENA_BET_002 = LotteryBet.create({
  id: 'bet-mega-sena-002',
  drawId: 'draw-mega-sena-001',
  gameId: 'mega-sena-001',
  numbers: BetNumbers.create(
    [7, 8, 9, 10, 11, 12],
    MEGA_SENA_POOL,
    MEGA_SENA_PICK,
  ),
  price: Money.ofCents(500, ECurrency.BRL),
});

const QUINA_POOL = NumberPool.create(1, 80);
const QUINA_PICK = PickCount.create(5, 15);

export const QUINA_BET_001 = LotteryBet.create({
  id: 'bet-quina-001',
  drawId: 'draw-quina-001',
  gameId: 'quina-001',
  numbers: BetNumbers.create([1, 2, 3, 4, 5], QUINA_POOL, QUINA_PICK),
  price: Money.ofCents(300, ECurrency.BRL),
});

const LOTOFACIL_POOL = NumberPool.create(1, 25);
const LOTOFACIL_PICK = PickCount.create(15, 20);

export const LOTOFACIL_BET_001 = LotteryBet.create({
  id: 'bet-lotofacil-001',
  drawId: 'draw-lotofacil-001',
  gameId: 'lotofacil-001',
  numbers: BetNumbers.create(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    LOTOFACIL_POOL,
    LOTOFACIL_PICK,
  ),
  price: Money.ofCents(350, ECurrency.BRL),
});

const LOTOMANIA_POOL = NumberPool.create(0, 99, 2);
const LOTOMANIA_PICK = PickCount.create(50, 50);

export const LOTOMANIA_BET_001 = LotteryBet.create({
  id: 'bet-lotomania-001',
  drawId: 'draw-lotomania-001',
  gameId: 'lotomania-001',
  numbers: BetNumbers.create(
    Array.from({ length: 50 }, (_, i) => i),
    LOTOMANIA_POOL,
    LOTOMANIA_PICK,
  ),
  price: Money.ofCents(200, ECurrency.BRL),
});

export class InMemoryLotteryBetRepositoryAdapter extends LotteryBetRepositoryPort {
  private readonly store = new Map<string, LotteryBet>([
    [MEGA_SENA_BET_001.getId().getValue(), MEGA_SENA_BET_001],
    [MEGA_SENA_BET_002.getId().getValue(), MEGA_SENA_BET_002],
    [QUINA_BET_001.getId().getValue(), QUINA_BET_001],
    [LOTOFACIL_BET_001.getId().getValue(), LOTOFACIL_BET_001],
    [LOTOMANIA_BET_001.getId().getValue(), LOTOMANIA_BET_001],
  ]);

  async findById(id: LotteryBetId): Promise<LotteryBet | null> {
    return Promise.resolve(this.store.get(id.getValue()) ?? null);
  }

  existsById(id: LotteryBetId): Promise<boolean> {
    return Promise.resolve(this.store.has(id.getValue()));
  }

  save(aggregate: LotteryBet): Promise<void> {
    this.store.set(aggregate.getId().getValue(), aggregate);
    return Promise.resolve();
  }

  deleteById(id: LotteryBetId): Promise<void> {
    this.store.delete(id.getValue());
    return Promise.resolve();
  }
}
