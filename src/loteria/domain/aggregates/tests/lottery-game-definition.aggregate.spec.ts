import {
  LotteryGameDefinition,
  LotteryGameCode,
} from '../lottery-game-definition.aggregate';
import { PrizePolicyBuilder } from '../../policies/prize-policy-builder';
import { NumberPool } from '../../vo/number-pool.vo';
import { PickCount } from '../../vo/pick-count.vo';
import { BetPriceTable } from '../../vo/bet-price-table.vo';
import { Money } from '../../vo/money.vo';
import { ECurrency } from '../../vo/ecurrency.enum';
import { NotificationValidationHandler } from 'src/common/domain/validation/notification-validation-handler';

export const MegaSenaPolicy = PrizePolicyBuilder.named('Mega-Sena')
  .drawCount(6)
  .include(4, 'Quadra (4 acertos)')
  .include(5, 'Quina (5 acertos)')
  .include(6, 'Sena (6 acertos)')
  .restrictTo([{ min: 4, max: 6 }])
  .requireRange(4, 6)
  .build();

export const QuinaPolicy = PrizePolicyBuilder.named('Quina')
  .drawCount(5)
  .range(2, 4)
  .include(5, 'Quina (5 acertos)')
  .restrictTo([{ min: 2, max: 5 }])
  .requireRange(2, 5)
  .build();

export const LotofacilPolicy = PrizePolicyBuilder.named('Lotofácil')
  .drawCount(15)
  .range(11, 15)
  .restrictTo([{ min: 11, max: 15 }])
  .requireRange(11, 15)
  .build();

export const LotomaniaPolicy = PrizePolicyBuilder.named('Lotomania')
  .drawCount(20)
  .range(15, 20)
  .include(0, '0 acertos')
  .restrictTo([0, { min: 15, max: 20 }])
  .requireInclude(0)
  .requireRange(15, 20)
  .build();

export const PrizePolicyCatalog = {
  MEGA_SENA: MegaSenaPolicy,
  QUINA: QuinaPolicy,
  LOTOFACIL: LotofacilPolicy,
  LOTOMANIA: LotomaniaPolicy,
};

describe('LotteryGameDefinition', () => {
  describe('create', () => {
    it('deve criar uma definição válida para Mega-Sena', () => {
      const numberPool = NumberPool.create(1, 60);
      const pickCount = PickCount.create(6, 15);
      const priceTable = BetPriceTable.create([
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
      ]);

      const game = LotteryGameDefinition.create({
        id: 'mega-sena-001',
        code: LotteryGameCode.MEGA_SENA,
        name: 'Mega-Sena',
        numberPool,
        pickCount,
        drawCount: 6,
        priceTable,
        prizePolicy: PrizePolicyCatalog.MEGA_SENA,
        description: 'Escolha de 6 a 15 números entre 01 e 60',
      });

      expect(game).toBeDefined();
      expect(game.getCode()).toBe(LotteryGameCode.MEGA_SENA);
      expect(game.getName()).toBe('Mega-Sena');
      expect(game.getDescription()).toBe(
        'Escolha de 6 a 15 números entre 01 e 60',
      );
      expect(game.getDrawCount()).toBe(6);
      expect(game.getNumberPool()).toBe(numberPool);
      expect(game.getPickCount()).toBe(pickCount);
      expect(game.getPriceTable()).toBe(priceTable);
      expect(game.getPrizePolicy()).toBe(PrizePolicyCatalog.MEGA_SENA);
    });

    it('deve criar uma definição válida para Quina', () => {
      const numberPool = NumberPool.create(1, 80);
      const pickCount = PickCount.create(5, 15);
      const priceTable = BetPriceTable.create([
        { pickCount: 5, price: Money.ofCents(250, ECurrency.BRL) },
        { pickCount: 6, price: Money.ofCents(1500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(10500, ECurrency.BRL) },
        { pickCount: 8, price: Money.ofCents(63000, ECurrency.BRL) },
        { pickCount: 9, price: Money.ofCents(315000, ECurrency.BRL) },
        { pickCount: 10, price: Money.ofCents(1417500, ECurrency.BRL) },
        { pickCount: 11, price: Money.ofCents(5670000, ECurrency.BRL) },
        { pickCount: 12, price: Money.ofCents(20790000, ECurrency.BRL) },
        { pickCount: 13, price: Money.ofCents(70270200, ECurrency.BRL) },
        { pickCount: 14, price: Money.ofCents(225225000, ECurrency.BRL) },
        { pickCount: 15, price: Money.ofCents(675675000, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'quina-001',
        code: LotteryGameCode.QUINA,
        name: 'Quina',
        numberPool,
        pickCount,
        drawCount: 5,
        priceTable,
        prizePolicy: PrizePolicyCatalog.QUINA,
      });

      expect(game).toBeDefined();
      expect(game.getCode()).toBe(LotteryGameCode.QUINA);
      expect(game.getName()).toBe('Quina');
      expect(game.getDrawCount()).toBe(5);
    });

    it('deve criar uma definição válida para Lotofácil', () => {
      const numberPool = NumberPool.create(1, 25);
      const pickCount = PickCount.create(15, 20);
      const priceTable = BetPriceTable.create([
        { pickCount: 15, price: Money.ofCents(300, ECurrency.BRL) },
        { pickCount: 16, price: Money.ofCents(2400, ECurrency.BRL) },
        { pickCount: 17, price: Money.ofCents(20400, ECurrency.BRL) },
        { pickCount: 18, price: Money.ofCents(183600, ECurrency.BRL) },
        { pickCount: 19, price: Money.ofCents(1744200, ECurrency.BRL) },
        { pickCount: 20, price: Money.ofCents(17442000, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'lotofacil-001',
        code: LotteryGameCode.LOTOFACIL,
        name: 'Lotofácil',
        numberPool,
        pickCount,
        drawCount: 15,
        priceTable,
        prizePolicy: PrizePolicyCatalog.LOTOFACIL,
      });

      expect(game).toBeDefined();
      expect(game.getCode()).toBe(LotteryGameCode.LOTOFACIL);
      expect(game.getName()).toBe('Lotofácil');
      expect(game.getDrawCount()).toBe(15);
    });

    it('deve criar uma definição válida para Lotomania', () => {
      const numberPool = NumberPool.create(0, 99, 2);
      const pickCount = PickCount.create(50, 50);
      const priceTable = BetPriceTable.create([
        { pickCount: 50, price: Money.ofCents(300, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'lotomania-001',
        code: LotteryGameCode.LOTOMANIA,
        name: 'Lotomania',
        numberPool,
        pickCount,
        drawCount: 20,
        priceTable,
        prizePolicy: PrizePolicyCatalog.LOTOMANIA,
      });

      expect(game).toBeDefined();
      expect(game.getCode()).toBe(LotteryGameCode.LOTOMANIA);
      expect(game.getName()).toBe('Lotomania');
      expect(game.getDrawCount()).toBe(20);
    });
  });

  describe('validate', () => {
    it('deve validar uma definição válida sem erros', () => {
      const numberPool = NumberPool.create(1, 60);
      const pickCount = PickCount.create(6, 15);
      const priceTable = BetPriceTable.create([
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
      ]);

      const game = LotteryGameDefinition.create({
        id: 'mega-sena-001',
        code: LotteryGameCode.MEGA_SENA,
        name: 'Mega-Sena',
        numberPool,
        pickCount,
        drawCount: 6,
        priceTable,
        prizePolicy: PrizePolicyCatalog.MEGA_SENA,
      });

      const handler = new NotificationValidationHandler();
      game.validate(handler);

      expect(handler.hasError()).toBe(false);
    });

    it('deve detectar erro quando nome está vazio', () => {
      const numberPool = NumberPool.create(1, 60);
      const pickCount = PickCount.create(6, 15);
      const priceTable = BetPriceTable.create([
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'test-001',
        code: LotteryGameCode.MEGA_SENA,
        name: '   ',
        numberPool,
        pickCount,
        drawCount: 6,
        priceTable,
        prizePolicy: PrizePolicyCatalog.MEGA_SENA,
      });

      const handler = new NotificationValidationHandler();
      game.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some((e: { message: string }) => e.message.includes('nome')),
      ).toBe(true);
    });

    it('deve detectar erro quando drawCount excede o tamanho do pool', () => {
      const numberPool = NumberPool.create(1, 5);
      const pickCount = PickCount.create(5, 5);
      const priceTable = BetPriceTable.create([
        { pickCount: 5, price: Money.ofCents(500, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'test-001',
        code: LotteryGameCode.MEGA_SENA,
        name: 'Teste',
        numberPool,
        pickCount,
        drawCount: 10,
        priceTable,
        prizePolicy: PrizePolicyCatalog.MEGA_SENA,
      });

      const handler = new NotificationValidationHandler();
      game.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some((e: { message: string }) =>
            e.message.includes('não pode exceder o tamanho'),
          ),
      ).toBe(true);
    });

    it('deve detectar erro quando pickCount.min é menor que drawCount', () => {
      const numberPool = NumberPool.create(1, 60);
      const pickCount = PickCount.create(4, 15);
      const priceTable = BetPriceTable.create([
        { pickCount: 4, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 5, price: Money.ofCents(3500, ECurrency.BRL) },
        { pickCount: 6, price: Money.ofCents(28000, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'test-001',
        code: LotteryGameCode.MEGA_SENA,
        name: 'Teste',
        numberPool,
        pickCount,
        drawCount: 6,
        priceTable,
        prizePolicy: PrizePolicyCatalog.MEGA_SENA,
      });

      const handler = new NotificationValidationHandler();
      game.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some((e: { message: string }) =>
            e.message.includes('não pode ser menor que'),
          ),
      ).toBe(true);
    });

    it('deve detectar erro quando falta preço para algum pickCount', () => {
      const numberPool = NumberPool.create(1, 60);
      const pickCount = PickCount.create(6, 10);
      const priceTable = BetPriceTable.create([
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'test-001',
        code: LotteryGameCode.MEGA_SENA,
        name: 'Teste',
        numberPool,
        pickCount,
        drawCount: 6,
        priceTable,
        prizePolicy: PrizePolicyCatalog.MEGA_SENA,
      });

      const handler = new NotificationValidationHandler();
      game.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some((e: { message: string }) =>
            e.message.includes('Não existe preço configurado'),
          ),
      ).toBe(true);
    });
  });

  describe('priceForPickCount', () => {
    it('deve retornar o preço correto para um pickCount', () => {
      const numberPool = NumberPool.create(1, 60);
      const pickCount = PickCount.create(6, 15);
      const priceTable = BetPriceTable.create([
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
      ]);

      const game = LotteryGameDefinition.create({
        id: 'mega-sena-001',
        code: LotteryGameCode.MEGA_SENA,
        name: 'Mega-Sena',
        numberPool,
        pickCount,
        drawCount: 6,
        priceTable,
        prizePolicy: PrizePolicyCatalog.MEGA_SENA,
      });

      const price6 = game.priceForPickCount(6);
      const price7 = game.priceForPickCount(7);

      expect(price6.amountCents).toBe(500);
      expect(price7.amountCents).toBe(3500);
    });
  });
});
