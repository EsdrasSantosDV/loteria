import { DrawNumbers } from '../draw-numbers.vo';
import { NumberPool } from '../number-pool.vo';
import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { MessagesError } from '../../../../common/domain/error/messages.error.enum';

describe('DrawNumbers', () => {
  let pool: NumberPool;

  beforeEach(() => {
    pool = NumberPool.create(1, 60);
  });

  describe('create', () => {
    it('deve criar um DrawNumbers válido', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers).toBeDefined();
      expect(drawNumbers.values).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('deve ordenar os números automaticamente', () => {
      const numbers = [6, 3, 1, 5, 2, 4];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers.values).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('deve criar com quantidade mínima', () => {
      const numbers = [1, 2];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 2,
      });

      expect(drawNumbers.values.length).toBe(2);
    });

    it('deve criar com quantidade máxima', () => {
      const numbers = Array.from({ length: 60 }, (_, i) => i + 1);
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 60,
      });

      expect(drawNumbers.values.length).toBe(60);
    });

    it('deve lançar DomainException quando numbers é null', () => {
      expect(() =>
        DrawNumbers.create({
          numbers: null as unknown as number[],
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_EMPTY);
      expect(() => {
        try {
          DrawNumbers.create({
            numbers: null as unknown as number[],
            pool,
            drawCount: 6,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando numbers é undefined', () => {
      expect(() =>
        DrawNumbers.create({
          numbers: undefined as unknown as number[],
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_EMPTY);
    });

    it('deve lançar DomainException quando numbers está vazio', () => {
      expect(() =>
        DrawNumbers.create({
          numbers: [],
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_EMPTY);
      expect(() => {
        try {
          DrawNumbers.create({
            numbers: [],
            pool,
            drawCount: 6,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando drawCount não é inteiro', () => {
      const numbers = [1, 2, 3, 4, 5, 6];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 6.5,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_DRAW_COUNT_INVALID);
    });

    it('deve lançar DomainException quando drawCount é zero', () => {
      const numbers = [1, 2, 3, 4, 5, 6];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 0,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_DRAW_COUNT_INVALID);
    });

    it('deve lançar DomainException quando drawCount é negativo', () => {
      const numbers = [1, 2, 3, 4, 5, 6];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: -1,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_DRAW_COUNT_INVALID);
    });

    it('deve lançar DomainException quando quantidade é diferente do drawCount', () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_COUNT_MISMATCH);
    });

    it('deve lançar DomainException quando quantidade é maior que drawCount', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_COUNT_MISMATCH);
    });

    it('deve lançar DomainException quando número está fora do pool', () => {
      const numbers = [1, 2, 3, 4, 5, 61];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_OUT_OF_POOL);
      expect(() => {
        try {
          DrawNumbers.create({
            numbers,
            pool,
            drawCount: 6,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando número está abaixo do pool', () => {
      const numbers = [0, 1, 2, 3, 4, 5];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_OUT_OF_POOL);
    });

    it('deve lançar DomainException quando múltiplos números estão fora do pool', () => {
      const numbers = [1, 2, 3, 4, 5, 100];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_OUT_OF_POOL);
    });

    it('deve lançar DomainException quando há números duplicados', () => {
      const numbers = [1, 2, 3, 4, 5, 5];

      expect(() =>
        DrawNumbers.create({
          numbers,
          pool,
          drawCount: 6,
        }),
      ).toThrow(MessagesError.DRAW_NUMBERS_DUPLICATED);
      expect(() => {
        try {
          DrawNumbers.create({
            numbers,
            pool,
            drawCount: 6,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve normalizar strings para números', () => {
      const numbers = ['1', '2', '3', '4', '5', '6'] as unknown as number[];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers.values).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('values', () => {
    it('deve retornar os números corretamente', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers.values).toEqual([1, 2, 3, 4, 5, 6]);
      expect(drawNumbers.values).toBeInstanceOf(Array);
    });

    it('deve retornar uma cópia do array', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      const values1 = drawNumbers.values;
      const values2 = drawNumbers.values;

      expect(values1).not.toBe(values2);
      expect(values1).toEqual(values2);
    });
  });

  describe('has', () => {
    it('deve retornar true quando o número existe', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers.has(3)).toBe(true);
      expect(drawNumbers.has(6)).toBe(true);
    });

    it('deve retornar false quando o número não existe', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers.has(7)).toBe(false);
      expect(drawNumbers.has(10)).toBe(false);
    });

    it('deve retornar false para números fora do pool', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers.has(61)).toBe(false);
      expect(drawNumbers.has(0)).toBe(false);
    });
  });

  describe('equals', () => {
    it('deve retornar true para DrawNumbers iguais', () => {
      const numbers1 = [1, 2, 3, 4, 5, 6];
      const numbers2 = [6, 5, 4, 3, 2, 1];
      const drawNumbers1 = DrawNumbers.create({
        numbers: numbers1,
        pool,
        drawCount: 6,
      });
      const drawNumbers2 = DrawNumbers.create({
        numbers: numbers2,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers1.equals(drawNumbers2)).toBe(true);
    });

    it('deve retornar false para DrawNumbers com números diferentes', () => {
      const numbers1 = [1, 2, 3, 4, 5, 6];
      const numbers2 = [1, 2, 3, 4, 5, 7];
      const drawNumbers1 = DrawNumbers.create({
        numbers: numbers1,
        pool,
        drawCount: 6,
      });
      const drawNumbers2 = DrawNumbers.create({
        numbers: numbers2,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers1.equals(drawNumbers2)).toBe(false);
    });

    it('deve retornar false para DrawNumbers com tamanhos diferentes', () => {
      const pool2 = NumberPool.create(1, 60);
      const numbers1 = [1, 2, 3, 4, 5, 6];
      const numbers2 = [1, 2, 3, 4, 5, 6, 7];
      const drawNumbers1 = DrawNumbers.create({
        numbers: numbers1,
        pool,
        drawCount: 6,
      });
      const drawNumbers2 = DrawNumbers.create({
        numbers: numbers2,
        pool: pool2,
        drawCount: 7,
      });

      expect(drawNumbers1.equals(drawNumbers2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const drawNumbers = DrawNumbers.create({
        numbers,
        pool,
        drawCount: 6,
      });

      expect(drawNumbers.equals(undefined)).toBe(false);
    });
  });
});


