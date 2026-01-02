import { NumberPool } from '../number-pool.vo';
import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { MessagesError } from '../../../../common/domain/error/messages.error.enum';

describe('NumberPool', () => {
  describe('create', () => {
    it('deve criar um NumberPool válido sem zeroPaddedWidth', () => {
      const pool = NumberPool.create(1, 10);
      expect(pool).toBeDefined();
      expect(pool.size()).toBe(10);
    });

    it('deve criar um NumberPool válido com zeroPaddedWidth', () => {
      const pool = NumberPool.create(1, 10, 2);
      expect(pool).toBeDefined();
      expect(pool.size()).toBe(10);
    });

    it('deve criar um NumberPool válido com zeroPaddedWidth igual a 1', () => {
      const pool = NumberPool.create(1, 10, 1);
      expect(pool).toBeDefined();
    });

    it('deve criar um NumberPool válido com zeroPaddedWidth igual a 2', () => {
      const pool = NumberPool.create(1, 10, 2);
      expect(pool).toBeDefined();
    });

    it('deve lançar DomainException quando min >= max', () => {
      expect(() => NumberPool.create(10, 10)).toThrow(
        MessagesError.NUMBER_POOL_MIN_MUST_BE_LESS_THAN_MAX,
      );
      expect(() => {
        try {
          NumberPool.create(10, 10);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando min > max', () => {
      expect(() => NumberPool.create(10, 5)).toThrow(
        MessagesError.NUMBER_POOL_MIN_MUST_BE_LESS_THAN_MAX,
      );
      expect(() => {
        try {
          NumberPool.create(10, 5);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando zeroPaddedWidth < 1', () => {
      expect(() => NumberPool.create(1, 10, -1)).toThrow(
        MessagesError.NUMBER_POOL_ZERO_PADDED_WIDTH_MUST_BE_GREATER_THAN_ZERO,
      );
      expect(() => {
        try {
          NumberPool.create(1, 10, -1);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando zeroPaddedWidth > 2', () => {
      expect(() => NumberPool.create(1, 10, 3)).toThrow(
        MessagesError.NUMBER_POOL_ZERO_PADDED_WIDTH_MUST_BE_LESS_OR_EQUAL_TO_TWO,
      );
      expect(() => {
        try {
          NumberPool.create(1, 10, 3);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();

      expect(() => NumberPool.create(1, 10, 10)).toThrow(
        MessagesError.NUMBER_POOL_ZERO_PADDED_WIDTH_MUST_BE_LESS_OR_EQUAL_TO_TWO,
      );
      expect(() => {
        try {
          NumberPool.create(1, 10, 10);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });
  });

  describe('contains', () => {
    let pool: NumberPool;

    beforeEach(() => {
      pool = NumberPool.create(5, 10);
    });

    it('deve retornar true para números dentro do intervalo', () => {
      expect(pool.contains(6)).toBe(true);
      expect(pool.contains(7)).toBe(true);
      expect(pool.contains(8)).toBe(true);
      expect(pool.contains(9)).toBe(true);
    });

    it('deve retornar true para o limite inferior', () => {
      expect(pool.contains(5)).toBe(true);
    });

    it('deve retornar true para o limite superior', () => {
      expect(pool.contains(10)).toBe(true);
    });

    it('deve retornar false para números abaixo do intervalo', () => {
      expect(pool.contains(4)).toBe(false);
      expect(pool.contains(0)).toBe(false);
      expect(pool.contains(-1)).toBe(false);
    });

    it('deve retornar false para números acima do intervalo', () => {
      expect(pool.contains(11)).toBe(false);
      expect(pool.contains(100)).toBe(false);
    });

    it('deve retornar false para números não inteiros', () => {
      expect(pool.contains(5.5)).toBe(false);
      expect(pool.contains(6.1)).toBe(false);
      expect(pool.contains(7.99)).toBe(false);
      expect(pool.contains(10.1)).toBe(false);
    });

    it('deve retornar false para NaN', () => {
      expect(pool.contains(NaN)).toBe(false);
    });

    it('deve retornar false para Infinity', () => {
      expect(pool.contains(Infinity)).toBe(false);
      expect(pool.contains(-Infinity)).toBe(false);
    });
  });

  describe('size', () => {
    it('deve retornar o tamanho correto do intervalo', () => {
      const pool1 = NumberPool.create(1, 10);
      expect(pool1.size()).toBe(10);

      expect(() => NumberPool.create(5, 5)).toThrow();
    });

    it('deve retornar 1 para intervalo de um único número', () => {
      const pool = NumberPool.create(10, 11);
      expect(pool.size()).toBe(2);
    });

    it('deve retornar o tamanho correto para intervalos grandes', () => {
      const pool = NumberPool.create(0, 99);
      expect(pool.size()).toBe(100);
    });

    it('deve retornar o tamanho correto para intervalos negativos', () => {
      const pool = NumberPool.create(-10, -5);
      expect(pool.size()).toBe(6);
    });

    it('deve retornar o tamanho correto para intervalos que cruzam zero', () => {
      const pool = NumberPool.create(-5, 5);
      expect(pool.size()).toBe(11);
    });
  });

  describe('format', () => {
    it('deve retornar o número como string quando zeroPaddedWidth não é fornecido', () => {
      const pool = NumberPool.create(1, 10);
      expect(pool.format(5)).toBe('5');
      expect(pool.format(10)).toBe('10');
      expect(pool.format(1)).toBe('1');
    });

    it('deve formatar com padding zero quando zeroPaddedWidth é 1', () => {
      const pool = NumberPool.create(1, 10, 1);
      expect(pool.format(5)).toBe('5');
      expect(pool.format(10)).toBe('10');
      expect(pool.format(1)).toBe('1');
    });

    it('deve formatar com padding zero quando zeroPaddedWidth é 2', () => {
      const pool = NumberPool.create(1, 10, 2);
      expect(pool.format(5)).toBe('05');
      expect(pool.format(1)).toBe('01');
      expect(pool.format(10)).toBe('10');
    });

    it('deve formatar corretamente números de um dígito com padding 2', () => {
      const pool = NumberPool.create(0, 99, 2);
      expect(pool.format(0)).toBe('00');
      expect(pool.format(5)).toBe('05');
      expect(pool.format(9)).toBe('09');
    });

    it('deve formatar corretamente números de dois dígitos com padding 2', () => {
      const pool = NumberPool.create(0, 99, 2);
      expect(pool.format(10)).toBe('10');
      expect(pool.format(50)).toBe('50');
      expect(pool.format(99)).toBe('99');
    });

    it('deve formatar números fora do intervalo (não valida no format)', () => {
      const pool = NumberPool.create(1, 10, 2);
      expect(pool.format(100)).toBe('100');
      expect(pool.format(0)).toBe('00');
    });
  });

  describe('equals', () => {
    it('deve retornar true para NumberPools iguais sem zeroPaddedWidth', () => {
      const pool1 = NumberPool.create(1, 10);
      const pool2 = NumberPool.create(1, 10);
      expect(pool1.equals(pool2)).toBe(true);
    });

    it('deve retornar true para NumberPools iguais com zeroPaddedWidth', () => {
      const pool1 = NumberPool.create(1, 10, 2);
      const pool2 = NumberPool.create(1, 10, 2);
      expect(pool1.equals(pool2)).toBe(true);
    });

    it('deve retornar false para NumberPools com min diferente', () => {
      const pool1 = NumberPool.create(1, 10);
      const pool2 = NumberPool.create(2, 10);
      expect(pool1.equals(pool2)).toBe(false);
    });

    it('deve retornar false para NumberPools com max diferente', () => {
      const pool1 = NumberPool.create(1, 10);
      const pool2 = NumberPool.create(1, 11);
      expect(pool1.equals(pool2)).toBe(false);
    });

    it('deve retornar false para NumberPools com zeroPaddedWidth diferente', () => {
      const pool1 = NumberPool.create(1, 10, 1);
      const pool2 = NumberPool.create(1, 10, 2);
      expect(pool1.equals(pool2)).toBe(false);
    });

    it('deve retornar false para NumberPool sem zeroPaddedWidth vs com zeroPaddedWidth', () => {
      const pool1 = NumberPool.create(1, 10);
      const pool2 = NumberPool.create(1, 10, 2);
      expect(pool1.equals(pool2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const pool = NumberPool.create(1, 10);
      expect(pool.equals(undefined)).toBe(false);
    });
  });
});
