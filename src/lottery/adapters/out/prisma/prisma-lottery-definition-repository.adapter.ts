import { LotteryDefinitionRepositoryPort } from 'src/lottery/application/out/repositories/lottery-definition-repository.port';
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
import { PrismaService } from 'src/common/adapters/prisma/prisma.service';

const MEGA_SENA_DEFINITION: LotteryGameDefinition =
  LotteryGameDefinition.create({
    id: 'mega-sena-001',
    code: LotteryGameCode.MEGA_SENA,
    name: 'Mega-Sena',
    description: 'Escolha de 6 a 15 números entre 01 e 60',
    numberPool: NumberPool.create(1, 60),
    pickCount: PickCount.create(6, 15),
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

const QUINA_DEFINITION = LotteryGameDefinition.create({
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
const LOTOFACIL_DEFINITION = LotteryGameDefinition.create({
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

const LOTOMANIA_DEFINITION = LotteryGameDefinition.create({
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

const DEFINITIONS_BY_CODE: Map<LotteryGameCode, LotteryGameDefinition> =
  new Map([
    [LotteryGameCode.MEGA_SENA, MEGA_SENA_DEFINITION],
    [LotteryGameCode.QUINA, QUINA_DEFINITION],
    [LotteryGameCode.LOTOFACIL, LOTOFACIL_DEFINITION],
    [LotteryGameCode.LOTOMANIA, LOTOMANIA_DEFINITION],
  ]);

export class PrismaLotteryDefinitionRepositoryAdapter extends LotteryDefinitionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: LotteryGameId): Promise<LotteryGameDefinition | null> {
    const dbRecord = await this.prisma.lottery_game_definition.findUnique({
      where: { id: id.getValue() },
    });

    if (!dbRecord) {
      return null;
    }

    const definition = DEFINITIONS_BY_CODE.get(
      dbRecord.code as LotteryGameCode,
    );

    if (!definition) {
      return null;
    }

    return LotteryGameDefinition.create({
      id: dbRecord.id,
      code: definition.getCode(),
      name: definition.getName(),
      description: definition.getDescription(),
      numberPool: definition.getNumberPool(),
      pickCount: definition.getPickCount(),
      drawCount: definition.getDrawCount(),
      priceTable: definition.getPriceTable(),
      prizePolicy: definition.getPrizePolicy(),
    });
  }

  async existsById(id: LotteryGameId): Promise<boolean> {
    const count = await this.prisma.lottery_game_definition.count({
      where: { id: id.getValue() },
    });
    return count > 0;
  }

  async save(aggregate: LotteryGameDefinition): Promise<void> {
    await this.prisma.lottery_game_definition.upsert({
      where: { id: aggregate.getId().getValue() },
      create: {
        id: aggregate.getId().getValue(),
        code: aggregate.getCode(),
        name: aggregate.getName(),
        description: aggregate.getDescription() ?? null,
      },
      update: {
        code: aggregate.getCode(),
        name: aggregate.getName(),
        description: aggregate.getDescription() ?? null,
      },
    });
  }

  async deleteById(id: LotteryGameId): Promise<void> {
    await this.prisma.lottery_game_definition.delete({
      where: { id: id.getValue() },
    });
  }

  async getByCode(
    code: LotteryGameCode,
  ): Promise<LotteryGameDefinition | null> {
    const dbRecord = await this.prisma.lottery_game_definition.findUnique({
      where: { code: code },
    });

    if (!dbRecord) {
      return null;
    }

    const definition = DEFINITIONS_BY_CODE.get(code);

    if (!definition) {
      return null;
    }

    return LotteryGameDefinition.create({
      id: dbRecord.id,
      code: definition.getCode(),
      name: definition.getName(),
      description: definition.getDescription(),
      numberPool: definition.getNumberPool(),
      pickCount: definition.getPickCount(),
      drawCount: definition.getDrawCount(),
      priceTable: definition.getPriceTable(),
      prizePolicy: definition.getPrizePolicy(),
    });
  }
}
