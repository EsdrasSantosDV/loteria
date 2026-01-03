import { PickCount } from '../pick-count.vo';
import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { MessagesError } from '../../../../common/domain/error/messages.error.enum';

describe('PickCount', () => {
  describe('create', () => {
    it('deve criar um PickCount válido', () => {
      const pickCount = PickCount.create(6, 15);
      expect(pickCount).toBeDefined();
      expect(pickCount.min).toBe(6);
      expect(pickCount.max).toBe(15);
    });

    it('deve criar um PickCount válido com min igual a max', () => {
      const pickCount = PickCount.create(6, 6);
      expect(pickCount).toBeDefined();
      expect(pickCount.min).toBe(6);
      expect(pickCount.max).toBe(6);
    });

    it('deve criar um PickCount válido com valores grandes', () => {
      const pickCount = PickCount.create(1, 20);
      expect(pickCount).toBeDefined();
      expect(pickCount.min).toBe(1);
      expect(pickCount.max).toBe(20);
    });

    it('deve lançar DomainException quando min não é inteiro', () => {
      expect(() => PickCount.create(6.5, 15)).toThrow(
        MessagesError.PICK_COUNT_BOUNDS_MUST_BE_INTEGER,
      );
      expect(() => {
        try {
          PickCount.create(6.5, 15);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando max não é inteiro', () => {
      expect(() => PickCount.create(6, 15.5)).toThrow(
        MessagesError.PICK_COUNT_BOUNDS_MUST_BE_INTEGER,
      );
    });

    it('deve lançar DomainException quando min e max não são inteiros', () => {
      expect(() => PickCount.create(6.5, 15.5)).toThrow(
        MessagesError.PICK_COUNT_BOUNDS_MUST_BE_INTEGER,
      );
    });

    it('deve lançar DomainException quando min é zero', () => {
      expect(() => PickCount.create(0, 15)).toThrow(
        MessagesError.PICK_COUNT_MIN_MUST_BE_GT_ZERO,
      );
      expect(() => {
        try {
          PickCount.create(0, 15);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando min é negativo', () => {
      expect(() => PickCount.create(-1, 15)).toThrow(
        MessagesError.PICK_COUNT_MIN_MUST_BE_GT_ZERO,
      );
    });

    it('deve lançar DomainException quando max é menor que min', () => {
      expect(() => PickCount.create(15, 6)).toThrow(
        MessagesError.PICK_COUNT_MAX_MUST_BE_GE_MIN,
      );
      expect(() => {
        try {
          PickCount.create(15, 6);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando max é muito menor que min', () => {
      expect(() => PickCount.create(20, 1)).toThrow(
        MessagesError.PICK_COUNT_MAX_MUST_BE_GE_MIN,
      );
    });
  });

  describe('getters', () => {
    it('deve retornar min corretamente', () => {
      const pickCount = PickCount.create(6, 15);
      expect(pickCount.min).toBe(6);
      expect(typeof pickCount.min).toBe('number');
    });

    it('deve retornar max corretamente', () => {
      const pickCount = PickCount.create(6, 15);
      expect(pickCount.max).toBe(15);
      expect(typeof pickCount.max).toBe('number');
    });
  });

  describe('equals', () => {
    it('deve retornar true para PickCounts iguais', () => {
      const pickCount1 = PickCount.create(6, 15);
      const pickCount2 = PickCount.create(6, 15);
      expect(pickCount1.equals(pickCount2)).toBe(true);
    });

    it('deve retornar false para PickCounts com min diferente', () => {
      const pickCount1 = PickCount.create(6, 15);
      const pickCount2 = PickCount.create(7, 15);
      expect(pickCount1.equals(pickCount2)).toBe(false);
    });

    it('deve retornar false para PickCounts com max diferente', () => {
      const pickCount1 = PickCount.create(6, 15);
      const pickCount2 = PickCount.create(6, 20);
      expect(pickCount1.equals(pickCount2)).toBe(false);
    });

    it('deve retornar false para PickCounts com min e max diferentes', () => {
      const pickCount1 = PickCount.create(6, 15);
      const pickCount2 = PickCount.create(7, 20);
      expect(pickCount1.equals(pickCount2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const pickCount = PickCount.create(6, 15);
      expect(pickCount.equals(undefined)).toBe(false);
    });
  });
});
