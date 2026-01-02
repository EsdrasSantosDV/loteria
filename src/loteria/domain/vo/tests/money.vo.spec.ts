import { Money } from '../money.vo';
import { ECurrency } from '../ecurrency.enum';
import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { MessagesError } from '../../../../common/domain/error/messages.error.enum';

describe('Money', () => {
  describe('ofCents', () => {
    it('deve criar um Money válido com number', () => {
      const money = Money.ofCents(100, ECurrency.BRL);
      expect(money).toBeDefined();
      expect(money.amountCents).toBe(100);
      expect(money.currency).toBe(ECurrency.BRL);
    });

    it('deve criar um Money válido com zero', () => {
      const money = Money.ofCents(0, ECurrency.EUR);
      expect(money).toBeDefined();
      expect(money.amountCents).toBe(0);
      expect(money.currency).toBe(ECurrency.EUR);
    });

    it('deve criar um Money válido com valores grandes', () => {
      const money = Money.ofCents(999999999, ECurrency.BRL);
      expect(money).toBeDefined();
      expect(money.amountCents).toBe(999999999);
    });

    it('deve lançar DomainException quando valor é negativo', () => {
      expect(() => Money.ofCents(-100, ECurrency.BRL)).toThrow(
        MessagesError.MONEY_NEGATIVE_NOT_ALLOWED,
      );
      expect(() => {
        try {
          Money.ofCents(-100, ECurrency.BRL);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando number não é inteiro', () => {
      expect(() => Money.ofCents(100.5, ECurrency.BRL)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
      expect(() => {
        try {
          Money.ofCents(100.5, ECurrency.BRL);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando amountCents é null', () => {
      expect(() =>
        Money.ofCents(null as unknown as number, ECurrency.BRL),
      ).toThrow(MessagesError.MONEY_INVALID_CENTS);
    });

    it('deve lançar DomainException quando amountCents é undefined', () => {
      expect(() =>
        Money.ofCents(undefined as unknown as number, ECurrency.BRL),
      ).toThrow(MessagesError.MONEY_INVALID_CENTS);
    });

    it('deve lançar DomainException quando moeda é null', () => {
      expect(() => Money.ofCents(100, null as unknown as ECurrency)).toThrow(
        MessagesError.MONEY_CURRENCY_REQUIRED,
      );
    });

    it('deve lançar DomainException quando moeda é undefined', () => {
      expect(() =>
        Money.ofCents(100, undefined as unknown as ECurrency),
      ).toThrow(MessagesError.MONEY_CURRENCY_REQUIRED);
    });
  });

  describe('ofDecimal', () => {
    it('deve criar um Money válido com valor decimal', () => {
      const money = Money.ofDecimal(10.5, ECurrency.BRL);
      expect(money).toBeDefined();
      expect(money.amountCents).toBe(1050);
      expect(money.currency).toBe(ECurrency.BRL);
    });

    it('deve criar um Money válido com valor inteiro', () => {
      const money = Money.ofDecimal(100, ECurrency.USD);
      expect(money).toBeDefined();
      expect(money.amountCents).toBe(10000);
    });

    it('deve criar um Money válido com zero', () => {
      const money = Money.ofDecimal(0, ECurrency.EUR);
      expect(money).toBeDefined();
      expect(money.amountCents).toBe(0);
    });

    it('deve lançar DomainException quando valor é Infinity', () => {
      expect(() => Money.ofDecimal(Infinity, ECurrency.BRL)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
    });

    it('deve lançar DomainException quando valor é -Infinity', () => {
      expect(() => Money.ofDecimal(-Infinity, ECurrency.BRL)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
    });

    it('deve lançar DomainException quando valor é NaN', () => {
      expect(() => Money.ofDecimal(NaN, ECurrency.BRL)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
    });
  });

  describe('add', () => {
    it('deve somar dois valores da mesma moeda', () => {
      const money1 = Money.ofCents(100, ECurrency.BRL);
      const money2 = Money.ofCents(50, ECurrency.BRL);
      const result = money1.add(money2);

      expect(result.amountCents).toBe(150);
      expect(result.currency).toBe(ECurrency.BRL);
    });

    it('deve somar valores grandes corretamente', () => {
      const money1 = Money.ofCents(1000000, ECurrency.USD);
      const money2 = Money.ofCents(500000, ECurrency.USD);
      const result = money1.add(money2);

      expect(result.amountCents).toBe(1500000);
    });

    it('deve somar zero corretamente', () => {
      const money1 = Money.ofCents(100, ECurrency.BRL);
      const money2 = Money.ofCents(0, ECurrency.BRL);
      const result = money1.add(money2);

      expect(result.amountCents).toBe(100);
    });

    it('deve lançar DomainException quando moedas são diferentes', () => {
      const money1 = Money.ofCents(100, ECurrency.BRL);
      const money2 = Money.ofCents(50, ECurrency.USD);

      expect(() => money1.add(money2)).toThrow(
        MessagesError.MONEY_CURRENCY_MISMATCH,
      );
      expect(() => {
        try {
          money1.add(money2);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });
  });

  describe('multiply', () => {
    it('deve multiplicar por um fator válido', () => {
      const money = Money.ofCents(100, ECurrency.BRL);
      const result = money.multiply(2);

      expect(result.amountCents).toBe(200);
      expect(result.currency).toBe(ECurrency.BRL);
    });

    it('deve multiplicar por zero', () => {
      const money = Money.ofCents(100, ECurrency.BRL);
      const result = money.multiply(0);

      expect(result.amountCents).toBe(0);
    });

    it('deve multiplicar por um fator decimal e arredondar', () => {
      const money = Money.ofCents(100, ECurrency.BRL);
      const result = money.multiply(1.5);

      expect(result.amountCents).toBe(150);
    });

    it('deve lançar DomainException quando fator é negativo', () => {
      const money = Money.ofCents(100, ECurrency.BRL);

      expect(() => money.multiply(-1)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
      expect(() => {
        try {
          money.multiply(-1);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando fator é Infinity', () => {
      const money = Money.ofCents(100, ECurrency.BRL);

      expect(() => money.multiply(Infinity)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
    });

    it('deve lançar DomainException quando fator é NaN', () => {
      const money = Money.ofCents(100, ECurrency.BRL);

      expect(() => money.multiply(NaN)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
    });
  });

  describe('format', () => {
    it('deve formatar corretamente BRL', () => {
      const money = Money.ofDecimal(100.5, ECurrency.BRL);
      const formatted = money.format();

      expect(formatted).toContain('100');
      expect(formatted).toContain('50');
    });

    it('deve formatar corretamente USD', () => {
      const money = Money.ofDecimal(50.25, ECurrency.USD);
      const formatted = money.format();

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('deve formatar corretamente EUR', () => {
      const money = Money.ofDecimal(75.75, ECurrency.EUR);
      const formatted = money.format();

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('deve formatar com locale customizado', () => {
      const money = Money.ofDecimal(100.5, ECurrency.USD);
      const formatted = money.format('en-US');

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('deve formatar zero corretamente', () => {
      const money = Money.ofCents(0, ECurrency.BRL);
      const formatted = money.format();

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('equals', () => {
    it('deve retornar true para Money iguais', () => {
      const money1 = Money.ofCents(100, ECurrency.BRL);
      const money2 = Money.ofCents(100, ECurrency.BRL);

      expect(money1.equals(money2)).toBe(true);
    });

    it('deve retornar false para Money com valores diferentes', () => {
      const money1 = Money.ofCents(100, ECurrency.BRL);
      const money2 = Money.ofCents(200, ECurrency.BRL);

      expect(money1.equals(money2)).toBe(false);
    });

    it('deve retornar false para Money com moedas diferentes', () => {
      const money1 = Money.ofCents(100, ECurrency.BRL);
      const money2 = Money.ofCents(100, ECurrency.USD);

      expect(money1.equals(money2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const money = Money.ofCents(100, ECurrency.BRL);

      expect(money.equals(undefined)).toBe(false);
    });
  });

  describe('getters', () => {
    it('deve retornar amountCents corretamente', () => {
      const money = Money.ofCents(100, ECurrency.BRL);

      expect(money.amountCents).toBe(100);
      expect(typeof money.amountCents).toBe('number');
    });

    it('deve retornar currency corretamente', () => {
      const money = Money.ofCents(100, ECurrency.USD);

      expect(money.currency).toBe(ECurrency.USD);
    });
  });
});
