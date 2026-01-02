import { BetPriceTable } from '../bet-price-table.vo';
import { Money } from '../money.vo';
import { ECurrency } from '../ecurrency.enum';
import { DomainException } from 'src/common/domain/exceptions/domain-exception';
import { MessagesError } from '../../../../common/domain/error/messages.error.enum';

describe('BetPriceTable', () => {
  describe('create', () => {
    it('deve criar um BetPriceTable válido', () => {
      const entries = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
        { pickCount: 8, price: Money.ofCents(28000, ECurrency.BRL) },
      ];

      const table = BetPriceTable.create(entries);

      expect(table).toBeDefined();
      expect(table.priceFor(6).amountCents).toBe(500);
      expect(table.priceFor(7).amountCents).toBe(3500);
      expect(table.priceFor(8).amountCents).toBe(28000);
    });

    it('deve criar um BetPriceTable com uma única entrada', () => {
      const entries = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
      ];

      const table = BetPriceTable.create(entries);

      expect(table).toBeDefined();
      expect(table.priceFor(6).amountCents).toBe(500);
    });

    it('deve lançar DomainException quando entries é null', () => {
      expect(() =>
        BetPriceTable.create(
          null as unknown as Array<{
            pickCount: number;
            price: Money;
          }>,
        ),
      ).toThrow(MessagesError.PRICE_TABLE_EMPTY);
      expect(() => {
        try {
          BetPriceTable.create(
            null as unknown as Array<{ pickCount: number; price: Money }>,
          );
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando entries é undefined', () => {
      expect(() =>
        BetPriceTable.create(
          undefined as unknown as Array<{
            pickCount: number;
            price: Money;
          }>,
        ),
      ).toThrow(MessagesError.PRICE_TABLE_EMPTY);
    });

    it('deve lançar DomainException quando entries está vazio', () => {
      expect(() => BetPriceTable.create([])).toThrow(
        MessagesError.PRICE_TABLE_EMPTY,
      );
      expect(() => {
        try {
          BetPriceTable.create([]);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando pickCount não é inteiro', () => {
      const entries = [
        { pickCount: 6.5, price: Money.ofCents(500, ECurrency.BRL) },
      ];

      expect(() => BetPriceTable.create(entries)).toThrow(
        MessagesError.PICK_COUNT_MUST_BE_POSITIVE_INTEGER,
      );
      expect(() => {
        try {
          BetPriceTable.create(entries);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando pickCount é zero', () => {
      const entries = [
        { pickCount: 0, price: Money.ofCents(500, ECurrency.BRL) },
      ];

      expect(() => BetPriceTable.create(entries)).toThrow(
        MessagesError.PICK_COUNT_MUST_BE_POSITIVE_INTEGER,
      );
    });

    it('deve lançar DomainException quando pickCount é negativo', () => {
      const entries = [
        { pickCount: -1, price: Money.ofCents(500, ECurrency.BRL) },
      ];

      expect(() => BetPriceTable.create(entries)).toThrow(
        MessagesError.PICK_COUNT_MUST_BE_POSITIVE_INTEGER,
      );
    });

    it('deve lançar DomainException quando price é null', () => {
      const entries = [{ pickCount: 6, price: null as unknown as Money }];

      expect(() => BetPriceTable.create(entries)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
      expect(() => {
        try {
          BetPriceTable.create(entries);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando price é undefined', () => {
      const entries = [{ pickCount: 6, price: undefined as unknown as Money }];

      expect(() => BetPriceTable.create(entries)).toThrow(
        MessagesError.MONEY_INVALID_CENTS,
      );
    });

    it('deve lançar DomainException quando há pickCount duplicado', () => {
      const entries = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
        { pickCount: 6, price: Money.ofCents(1000, ECurrency.BRL) },
      ];

      expect(() => BetPriceTable.create(entries)).toThrow(
        MessagesError.PRICE_TABLE_DUPLICATED_PICK,
      );
      expect(() => {
        try {
          BetPriceTable.create(entries);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });
  });

  describe('priceFor', () => {
    let table: BetPriceTable;

    beforeEach(() => {
      const entries = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
        { pickCount: 8, price: Money.ofCents(28000, ECurrency.BRL) },
      ];
      table = BetPriceTable.create(entries);
    });

    it('deve retornar o preço correto para um pickCount existente', () => {
      const price = table.priceFor(6);

      expect(price.amountCents).toBe(500);
      expect(price.currency).toBe(ECurrency.BRL);
    });

    it('deve retornar o preço correto para diferentes pickCounts', () => {
      expect(table.priceFor(6).amountCents).toBe(500);
      expect(table.priceFor(7).amountCents).toBe(3500);
      expect(table.priceFor(8).amountCents).toBe(28000);
    });

    it('deve lançar DomainException quando pickCount não existe', () => {
      expect(() => table.priceFor(5)).toThrow(
        MessagesError.PRICE_TABLE_MISSING_PICK,
      );
      expect(() => {
        try {
          table.priceFor(5);
        } catch (error) {
          expect(error).toBeInstanceOf(DomainException);
          throw error;
        }
      }).toThrow();
    });

    it('deve lançar DomainException quando pickCount não existe em tabela maior', () => {
      expect(() => table.priceFor(15)).toThrow(
        MessagesError.PRICE_TABLE_MISSING_PICK,
      );
    });
  });

  describe('equals', () => {
    it('deve retornar true para BetPriceTables iguais', () => {
      const entries1 = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
      ];
      const entries2 = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
      ];

      const table1 = BetPriceTable.create(entries1);
      const table2 = BetPriceTable.create(entries2);

      expect(table1.equals(table2)).toBe(true);
    });

    it('deve retornar false para BetPriceTables com preços diferentes', () => {
      const entries1 = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
      ];
      const entries2 = [
        { pickCount: 6, price: Money.ofCents(1000, ECurrency.BRL) },
      ];

      const table1 = BetPriceTable.create(entries1);
      const table2 = BetPriceTable.create(entries2);

      expect(table1.equals(table2)).toBe(false);
    });

    it('deve retornar false para BetPriceTables com pickCounts diferentes', () => {
      const entries1 = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
      ];
      const entries2 = [
        { pickCount: 7, price: Money.ofCents(500, ECurrency.BRL) },
      ];

      const table1 = BetPriceTable.create(entries1);
      const table2 = BetPriceTable.create(entries2);

      expect(table1.equals(table2)).toBe(false);
    });

    it('deve retornar false para BetPriceTables com tamanhos diferentes', () => {
      const entries1 = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
      ];
      const entries2 = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
        { pickCount: 7, price: Money.ofCents(3500, ECurrency.BRL) },
      ];

      const table1 = BetPriceTable.create(entries1);
      const table2 = BetPriceTable.create(entries2);

      expect(table1.equals(table2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const entries = [
        { pickCount: 6, price: Money.ofCents(500, ECurrency.BRL) },
      ];
      const table = BetPriceTable.create(entries);

      expect(table.equals(undefined)).toBe(false);
    });
  });
});
