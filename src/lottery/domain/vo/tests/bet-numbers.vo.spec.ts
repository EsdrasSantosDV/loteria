import { BetNumbers } from '../bet-numbers.vo';
import { NumberPool } from '../number-pool.vo';
import { PickCount } from '../pick-count.vo';
import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { MessagesError } from '../../../../common/domain/error/messages.error.enum';

describe('BetNumbers', () => {
  let pool: NumberPool;
  let pick: PickCount;

  beforeEach(() => {
    pool = NumberPool.create(1, 60);
    pick = PickCount.create(6, 15);
  });

  describe('create', () => {
    it('deve criar um BetNumbers válido', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers).toBeDefined();
      expect(betNumbers.value).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('deve ordenar os números automaticamente', () => {
      const numbers = [6, 3, 1, 5, 2, 4];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.value).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('deve remover duplicatas e ordenar', () => {
      const numbers = [6, 3, 1, 3, 5, 2, 4, 1];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.value).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('deve criar com quantidade mínima de números', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.value.length).toBe(6);
    });

    it('deve criar com quantidade máxima de números', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.value.length).toBe(15);
    });

    it('deve lançar DomainException quando numbers é null', () => {
      expect(() => BetNumbers.create(null as any, pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_EMPTY,
      );
      expect(() => {
        try {
          BetNumbers.create(null as any, pool, pick);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando numbers é undefined', () => {
      expect(() => BetNumbers.create(undefined as any, pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_EMPTY,
      );
    });

    it('deve lançar DomainException quando numbers está vazio', () => {
      expect(() => BetNumbers.create([], pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_EMPTY,
      );
      expect(() => {
        try {
          BetNumbers.create([], pool, pick);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve remover números duplicados automaticamente', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 6];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.value).toEqual([1, 2, 3, 4, 5, 6]);
      expect(betNumbers.value.length).toBe(6);
    });

    it('deve lançar DomainException quando quantidade é menor que min', () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(() => BetNumbers.create(numbers, pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_PICK_OUT_OF_RANGE,
      );
    });

    it('deve lançar DomainException quando quantidade é maior que max', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

      expect(() => BetNumbers.create(numbers, pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_PICK_OUT_OF_RANGE,
      );
    });

    it('deve lançar DomainException quando número está fora do pool', () => {
      const numbers = [1, 2, 3, 4, 5, 61];

      expect(() => BetNumbers.create(numbers, pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_OUT_OF_POOL,
      );
      expect(() => {
        try {
          BetNumbers.create(numbers, pool, pick);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando número está abaixo do pool', () => {
      const numbers = [0, 1, 2, 3, 4, 5];

      expect(() => BetNumbers.create(numbers, pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_OUT_OF_POOL,
      );
    });

    it('deve lançar DomainException quando múltiplos números estão fora do pool', () => {
      const numbers = [1, 2, 3, 4, 5, 100];

      expect(() => BetNumbers.create(numbers, pool, pick)).toThrow(
        MessagesError.BET_NUMBERS_OUT_OF_POOL,
      );
    });
  });

  describe('value', () => {
    it('deve retornar os números corretamente', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.value).toEqual([1, 2, 3, 4, 5, 6]);
      expect(betNumbers.value).toBeInstanceOf(Array);
    });

    it('deve retornar array readonly', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.value).toBeInstanceOf(Array);
      expect(betNumbers.value.length).toBe(6);
    });
  });

  describe('toStringFormatted', () => {
    it('deve formatar números sem zero padding', () => {
      const poolNoPadding = NumberPool.create(1, 60);
      const numbers = [1, 2, 3, 4, 5, 6];
      const betNumbers = BetNumbers.create(numbers, poolNoPadding, pick);

      expect(betNumbers.toStringFormatted(poolNoPadding)).toBe('1-2-3-4-5-6');
    });

    it('deve formatar números com zero padding', () => {
      const poolWithPadding = NumberPool.create(0, 99, 2);
      const pickFor5 = PickCount.create(5, 15);
      const numbers = [0, 5, 10, 50, 99];
      const betNumbers = BetNumbers.create(numbers, poolWithPadding, pickFor5);

      expect(betNumbers.toStringFormatted(poolWithPadding)).toBe(
        '00-05-10-50-99',
      );
    });

    it('deve formatar números mistos com e sem padding', () => {
      const poolWithPadding = NumberPool.create(1, 60, 2);
      const pickFor5 = PickCount.create(5, 15);
      const numbers = [1, 5, 10, 50, 60];
      const betNumbers = BetNumbers.create(numbers, poolWithPadding, pickFor5);

      expect(betNumbers.toStringFormatted(poolWithPadding)).toBe(
        '01-05-10-50-60',
      );
    });
  });

  describe('equals', () => {
    it('deve retornar true para BetNumbers iguais', () => {
      const numbers1 = [1, 2, 3, 4, 5, 6];
      const numbers2 = [6, 5, 4, 3, 2, 1];
      const betNumbers1 = BetNumbers.create(numbers1, pool, pick);
      const betNumbers2 = BetNumbers.create(numbers2, pool, pick);

      expect(betNumbers1.equals(betNumbers2)).toBe(true);
    });

    it('deve retornar false para BetNumbers com números diferentes', () => {
      const numbers1 = [1, 2, 3, 4, 5, 6];
      const numbers2 = [1, 2, 3, 4, 5, 7];
      const betNumbers1 = BetNumbers.create(numbers1, pool, pick);
      const betNumbers2 = BetNumbers.create(numbers2, pool, pick);

      expect(betNumbers1.equals(betNumbers2)).toBe(false);
    });

    it('deve retornar false para BetNumbers com tamanhos diferentes', () => {
      const numbers1 = [1, 2, 3, 4, 5, 6];
      const numbers2 = [1, 2, 3, 4, 5, 6, 7];
      const betNumbers1 = BetNumbers.create(numbers1, pool, pick);
      const betNumbers2 = BetNumbers.create(numbers2, pool, pick);

      expect(betNumbers1.equals(betNumbers2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const betNumbers = BetNumbers.create(numbers, pool, pick);

      expect(betNumbers.equals(undefined)).toBe(false);
    });
  });
});
