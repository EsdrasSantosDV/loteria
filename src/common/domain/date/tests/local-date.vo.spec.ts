import { LocalDateVO } from '../local-date.vo';

describe('LocalDateVO', () => {
  describe('fromISO', () => {
    it('deve criar uma instância a partir de uma string ISO', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      expect(date.toISO()).toBe('2024-01-15');
    });

    it('deve lançar erro para formato ISO inválido', () => {
      expect(() => LocalDateVO.fromISO('invalid-date')).toThrow();
    });
  });

  describe('fromYMD', () => {
    it('deve criar uma instância a partir de ano, mês e dia', () => {
      const date = LocalDateVO.fromYMD(2024, 1, 15);
      expect(date.toISO()).toBe('2024-01-15');
    });

    it('deve criar corretamente datas com meses de dois dígitos', () => {
      const date = LocalDateVO.fromYMD(2024, 12, 31);
      expect(date.toISO()).toBe('2024-12-31');
    });

    it('deve lançar erro para data inválida', () => {
      expect(() => LocalDateVO.fromYMD(2024, 13, 1)).toThrow();
      expect(() => LocalDateVO.fromYMD(2024, 2, 30)).toThrow();
    });
  });

  describe('value', () => {
    it('deve retornar o valor Temporal.PlainDate', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      expect(date.value).toBeDefined();
      expect(date.value.toString()).toBe('2024-01-15');
    });
  });

  describe('toISO', () => {
    it('deve retornar a data no formato ISO', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      expect(date.toISO()).toBe('2024-01-15');
    });
  });

  describe('plusDays', () => {
    it('deve adicionar dias à data', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      const newDate = date.plusDays(5);
      expect(newDate.toISO()).toBe('2024-01-20');
    });

    it('deve adicionar dias corretamente ao mudar de mês', () => {
      const date = LocalDateVO.fromISO('2024-01-30');
      const newDate = date.plusDays(5);
      expect(newDate.toISO()).toBe('2024-02-04');
    });

    it('deve adicionar dias corretamente ao mudar de ano', () => {
      const date = LocalDateVO.fromISO('2023-12-30');
      const newDate = date.plusDays(5);
      expect(newDate.toISO()).toBe('2024-01-04');
    });
  });

  describe('minusDays', () => {
    it('deve subtrair dias da data', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      const newDate = date.minusDays(5);
      expect(newDate.toISO()).toBe('2024-01-10');
    });

    it('deve subtrair dias corretamente ao mudar de mês', () => {
      const date = LocalDateVO.fromISO('2024-02-05');
      const newDate = date.minusDays(10);
      expect(newDate.toISO()).toBe('2024-01-26');
    });

    it('deve subtrair dias corretamente ao mudar de ano', () => {
      const date = LocalDateVO.fromISO('2024-01-05');
      const newDate = date.minusDays(10);
      expect(newDate.toISO()).toBe('2023-12-26');
    });
  });

  describe('isBefore', () => {
    it('deve retornar true quando a data é anterior', () => {
      const date1 = LocalDateVO.fromISO('2024-01-15');
      const date2 = LocalDateVO.fromISO('2024-01-20');
      expect(date1.isBefore(date2)).toBe(true);
    });

    it('deve retornar false quando a data é posterior', () => {
      const date1 = LocalDateVO.fromISO('2024-01-20');
      const date2 = LocalDateVO.fromISO('2024-01-15');
      expect(date1.isBefore(date2)).toBe(false);
    });

    it('deve retornar false quando as datas são iguais', () => {
      const date1 = LocalDateVO.fromISO('2024-01-15');
      const date2 = LocalDateVO.fromISO('2024-01-15');
      expect(date1.isBefore(date2)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('deve retornar true quando a data é posterior', () => {
      const date1 = LocalDateVO.fromISO('2024-01-20');
      const date2 = LocalDateVO.fromISO('2024-01-15');
      expect(date1.isAfter(date2)).toBe(true);
    });

    it('deve retornar false quando a data é anterior', () => {
      const date1 = LocalDateVO.fromISO('2024-01-15');
      const date2 = LocalDateVO.fromISO('2024-01-20');
      expect(date1.isAfter(date2)).toBe(false);
    });

    it('deve retornar false quando as datas são iguais', () => {
      const date1 = LocalDateVO.fromISO('2024-01-15');
      const date2 = LocalDateVO.fromISO('2024-01-15');
      expect(date1.isAfter(date2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('deve retornar a data no formato ISO', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      expect(date.toString()).toBe('2024-01-15');
    });
  });

  describe('toJSON', () => {
    it('deve retornar a data no formato ISO', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      expect(date.toJSON()).toBe('2024-01-15');
    });
  });

  describe('equals', () => {
    it('deve retornar true para datas iguais', () => {
      const date1 = LocalDateVO.fromISO('2024-01-15');
      const date2 = LocalDateVO.fromISO('2024-01-15');
      expect(date1.equals(date2)).toBe(true);
    });

    it('deve retornar false para datas diferentes', () => {
      const date1 = LocalDateVO.fromISO('2024-01-15');
      const date2 = LocalDateVO.fromISO('2024-01-16');
      expect(date1.equals(date2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      expect(date.equals(undefined)).toBe(false);
    });
  });
});
