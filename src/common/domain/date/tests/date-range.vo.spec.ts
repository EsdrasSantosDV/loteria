import { DateRangeVO } from '../date-range.vo';
import { LocalDateVO } from '../local-date.vo';

describe('DateRangeVO', () => {
  describe('create', () => {
    it('deve criar um intervalo de datas válido', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      expect(range).toBeDefined();
      expect(range.start.equals(start)).toBe(true);
      expect(range.end.equals(end)).toBe(true);
    });

    it('deve criar um intervalo válido quando start e end são iguais', () => {
      const date = LocalDateVO.fromISO('2024-01-15');
      const range = DateRangeVO.create(date, date);

      expect(range.start.equals(date)).toBe(true);
      expect(range.end.equals(date)).toBe(true);
    });

    it('deve lançar erro quando end é anterior a start', () => {
      const start = LocalDateVO.fromISO('2024-01-20');
      const end = LocalDateVO.fromISO('2024-01-15');

      expect(() => DateRangeVO.create(start, end)).toThrow(
        "DateRange: 'end' must be >= 'start'",
      );
    });
  });

  describe('start', () => {
    it('deve retornar a data de início', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      expect(range.start.equals(start)).toBe(true);
      expect(range.start.toISO()).toBe('2024-01-15');
    });
  });

  describe('end', () => {
    it('deve retornar a data de fim', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      expect(range.end.equals(end)).toBe(true);
      expect(range.end.toISO()).toBe('2024-01-20');
    });
  });

  describe('contains', () => {
    it('deve retornar true quando a data está dentro do intervalo', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      const date = LocalDateVO.fromISO('2024-01-17');
      expect(range.contains(date)).toBe(true);
    });

    it('deve retornar true quando a data é igual ao início', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      expect(range.contains(start)).toBe(true);
    });

    it('deve retornar true quando a data é igual ao fim', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      expect(range.contains(end)).toBe(true);
    });

    it('deve retornar false quando a data é anterior ao início', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      const date = LocalDateVO.fromISO('2024-01-14');
      expect(range.contains(date)).toBe(false);
    });

    it('deve retornar false quando a data é posterior ao fim', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      const date = LocalDateVO.fromISO('2024-01-21');
      expect(range.contains(date)).toBe(false);
    });
  });

  describe('overlaps', () => {
    it('deve retornar true quando os intervalos se sobrepõem', () => {
      const range1 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );
      const range2 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-18'),
        LocalDateVO.fromISO('2024-01-25'),
      );

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });

    it('deve retornar true quando um intervalo contém o outro', () => {
      const range1 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-25'),
      );
      const range2 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-18'),
        LocalDateVO.fromISO('2024-01-20'),
      );

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });

    it('deve retornar true quando os intervalos são adjacentes (tocam no mesmo dia)', () => {
      const range1 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );
      const range2 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-20'),
        LocalDateVO.fromISO('2024-01-25'),
      );

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });

    it('deve retornar false quando os intervalos não se sobrepõem', () => {
      const range1 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );
      const range2 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-21'),
        LocalDateVO.fromISO('2024-01-25'),
      );

      expect(range1.overlaps(range2)).toBe(false);
      expect(range2.overlaps(range1)).toBe(false);
    });

    it('deve retornar true quando os intervalos são idênticos', () => {
      const range1 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );
      const range2 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );

      expect(range1.overlaps(range2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('deve retornar o intervalo no formato "start..end"', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      expect(range.toString()).toBe('2024-01-15..2024-01-20');
    });
  });

  describe('toJSON', () => {
    it('deve retornar o intervalo como objeto JSON', () => {
      const start = LocalDateVO.fromISO('2024-01-15');
      const end = LocalDateVO.fromISO('2024-01-20');
      const range = DateRangeVO.create(start, end);

      const json = range.toJSON();
      expect(json).toEqual({
        start: '2024-01-15',
        end: '2024-01-20',
      });
    });
  });

  describe('equals', () => {
    it('deve retornar true para intervalos iguais', () => {
      const range1 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );
      const range2 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );

      expect(range1.equals(range2)).toBe(true);
    });

    it('deve retornar false para intervalos diferentes', () => {
      const range1 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );
      const range2 = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-16'),
        LocalDateVO.fromISO('2024-01-20'),
      );

      expect(range1.equals(range2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const range = DateRangeVO.create(
        LocalDateVO.fromISO('2024-01-15'),
        LocalDateVO.fromISO('2024-01-20'),
      );

      expect(range.equals(undefined)).toBe(false);
    });
  });
});
