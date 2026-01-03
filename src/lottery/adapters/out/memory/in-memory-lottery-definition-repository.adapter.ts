import { LotteryDefinitionRepositoryPort } from 'src/lottery/application/out/lottery-definition-repository.port';
import {
  LotteryGameDefinition,
  LotteryGameCode,
} from 'src/lottery/domain/aggregates/lottery-game-definition.aggregate';
import { PrizePolicyCatalog } from 'src/lottery/domain/policies/policies-caixa.const';
import { LotteryGameId } from 'src/lottery/domain/identifiers/lottery-game.id';
import { BetPriceTable } from 'src/lottery/domain/vo/bet-price-table.vo';
import { ECurrency } from 'src/lottery/domain/vo/ecurrency.enum';
import { Money } from 'src/lottery/domain/vo/money.vo';
import { NumberPool } from 'src/lottery/domain/vo/number-pool.vo';
import { PickCount } from 'src/lottery/domain/vo/pick-count.vo';

export const MEGA_SENA_DEFINITION: LotteryGameDefinition =
  LotteryGameDefinition.create({
    id: 'mega-sena-001',
    code: LotteryGameCode.MEGA_SENA,
    name: 'Mega-Sena',
    description: 'Escolha de 6 a 15 números entre 01 e 60',
    numberPool: NumberPool.create(1, 60),
    pickCount: PickCount.create(1, 15),
    drawCount: 6,
    priceTable: BetPriceTable.create([
      { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
      { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
      { pickCount: 8, price: Money.ofCents(28000, ECurrency.BRL) },
      { pickCount: 9, price: Money.ofCents(126000, ECurrency.BRL) },
      { pickCount: 10, price: Money.ofCents(378000, ECurrency.BRL) },
      { pickCount: 11, price: Money.ofCents(924000, ECurrency.BRL) },
      { pickCount: 12, price: Money.ofCents(1938000, ECurrency.BRL) },
      { pickCount: 13, price: Money.ofCents(3603600, ECurrency.BRL) },
      { pickCount: 14, price: Money.ofCents(6006000, ECurrency.BRL) },
      { pickCount: 15, price: Money.ofCents(9009000, ECurrency.BRL) },
    ]),
    prizePolicy: PrizePolicyCatalog.MEGA_SENA,
  });

export const QUINA_DEFINITION = LotteryGameDefinition.create({
  id: 'quina-001',
  code: LotteryGameCode.QUINA,
  name: 'Quina',
  description: 'Quina — escolha de 5 a 15 números entre 1 e 80',
  numberPool: NumberPool.create(1, 80),
  pickCount: PickCount.create(5, 15),
  drawCount: 5,
  priceTable: BetPriceTable.create([
    { pickCount: 5, price: Money.ofCents(300, ECurrency.BRL) },
    { pickCount: 6, price: Money.ofCents(1800, ECurrency.BRL) },
    { pickCount: 7, price: Money.ofCents(4200, ECurrency.BRL) },
    { pickCount: 8, price: Money.ofCents(8400, ECurrency.BRL) },
    { pickCount: 9, price: Money.ofCents(16800, ECurrency.BRL) },
    { pickCount: 10, price: Money.ofCents(30240, ECurrency.BRL) },
    { pickCount: 11, price: Money.ofCents(55440, ECurrency.BRL) },
    { pickCount: 12, price: Money.ofCents(95040, ECurrency.BRL) },
    { pickCount: 13, price: Money.ofCents(154740, ECurrency.BRL) },
    { pickCount: 14, price: Money.ofCents(225120, ECurrency.BRL) },
    { pickCount: 15, price: Money.ofCents(300300, ECurrency.BRL) },
  ]),
  prizePolicy: PrizePolicyCatalog.QUINA,
});

export const LOTOFACIL_DEFINITION = LotteryGameDefinition.create({
  id: 'lotofacil-001',
  code: LotteryGameCode.LOTOFACIL,
  name: 'Lotofácil',
  description: 'Lotofácil — escolha de 15 a 20 números entre 1 e 25',
  numberPool: NumberPool.create(1, 25),
  pickCount: PickCount.create(15, 20),
  drawCount: 15,
  priceTable: BetPriceTable.create([
    { pickCount: 15, price: Money.ofCents(350, ECurrency.BRL) },
    { pickCount: 16, price: Money.ofCents(5600, ECurrency.BRL) },
    { pickCount: 17, price: Money.ofCents(47600, ECurrency.BRL) },
    { pickCount: 18, price: Money.ofCents(285600, ECurrency.BRL) },
    { pickCount: 19, price: Money.ofCents(1356600, ECurrency.BRL) },
    { pickCount: 20, price: Money.ofCents(5662800, ECurrency.BRL) },
  ]),
  prizePolicy: PrizePolicyCatalog.LOTOFACIL,
});

export const LOTOMANIA_DEFINITION = LotteryGameDefinition.create({
  id: 'lotomania-001',
  code: LotteryGameCode.LOTOMANIA,
  name: 'Lotomania',
  description: 'Lotomania — escolha de 50 números entre 0 e 99',
  numberPool: NumberPool.create(0, 99, 2),
  pickCount: PickCount.create(50, 50),
  drawCount: 20,
  priceTable: BetPriceTable.create([
    { pickCount: 50, price: Money.ofCents(200, ECurrency.BRL) },
  ]),
  prizePolicy: PrizePolicyCatalog.LOTOMANIA,
});

export class InMemoryLotteryDefinitionRepositoryAdapter extends LotteryDefinitionRepositoryPort {
  private readonly store = new Map<string, LotteryGameDefinition>([
    [MEGA_SENA_DEFINITION.getId().getValue(), MEGA_SENA_DEFINITION],
    [QUINA_DEFINITION.getId().getValue(), QUINA_DEFINITION],
    [LOTOFACIL_DEFINITION.getId().getValue(), LOTOFACIL_DEFINITION],
    [LOTOMANIA_DEFINITION.getId().getValue(), LOTOMANIA_DEFINITION],
  ]);

  async findById(id: LotteryGameId): Promise<LotteryGameDefinition | null> {
    return Promise.resolve(this.store.get(id.getValue()) ?? null);
  }

  existsById(id: LotteryGameId): Promise<boolean> {
    return Promise.resolve(this.store.has(id.getValue()));
  }

  save(aggregate: LotteryGameDefinition): Promise<void> {
    this.store.set(aggregate.getId().getValue(), aggregate);
    return Promise.resolve();
  }

  deleteById(id: LotteryGameId): Promise<void> {
    this.store.delete(id.getValue());
    return Promise.resolve();
  }

  getByCode(code: LotteryGameCode): Promise<LotteryGameDefinition | null> {
    return Promise.resolve(
      Array.from(this.store.values()).find(
        (definition) => definition.getCode() === code,
      ) ?? null,
    );
  }
}
