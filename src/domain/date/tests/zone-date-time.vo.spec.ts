import { ZonedDateTimeVO } from '../zone-date-time.vo';
import { InstantVO } from '../instant-date.vo';
import { LocalDateVO } from '../local-date.vo';

describe('ZonedDateTimeVO', () => {
  describe('nowIn', () => {
    it('deve criar uma instância com a data/hora atual no timezone especificado', () => {
      const zdt = ZonedDateTimeVO.nowIn('America/Sao_Paulo');
      expect(zdt).toBeDefined();
      expect(zdt.toISO()).toBeDefined();
      expect(typeof zdt.toISO()).toBe('string');
      expect(zdt.toISO()).toContain('America/Sao_Paulo');
    });

    it('deve criar uma instância com timezone UTC', () => {
      const zdt = ZonedDateTimeVO.nowIn('UTC');
      expect(zdt.toISO()).toContain('UTC');
    });
  });

  describe('fromISO', () => {
    it('deve criar uma instância a partir de uma string ISO com timezone', () => {
      const zdt = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      expect(zdt.toISO()).toContain('2024-01-15');
      expect(zdt.toISO()).toContain('America/Sao_Paulo');
    });

    it('deve criar uma instância a partir de uma string ISO com UTC', () => {
      const zdt = ZonedDateTimeVO.fromISO('2024-01-15T10:30:00Z[UTC]');
      expect(zdt.toISO()).toBeDefined();
    });

    it('deve lançar erro para formato ISO inválido', () => {
      expect(() => ZonedDateTimeVO.fromISO('invalid-zdt')).toThrow();
    });
  });

  describe('toISO', () => {
    it('deve retornar a data/hora no formato ISO com timezone', () => {
      const zdt = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const iso = zdt.toISO();
      expect(iso).toBeDefined();
      expect(typeof iso).toBe('string');
      expect(iso).toContain('2024-01-15');
    });
  });

  describe('toInstant', () => {
    it('deve converter para InstantVO', () => {
      const zdt = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const instant = zdt.toInstant();

      expect(instant).toBeInstanceOf(InstantVO);
      expect(instant.toISO()).toBeDefined();
    });

    it('deve converter corretamente mantendo o mesmo momento temporal', () => {
      const zdt1 = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const zdt2 = ZonedDateTimeVO.fromISO('2024-01-15T13:30:00Z[UTC]');

      const instant1 = zdt1.toInstant();
      const instant2 = zdt2.toInstant();

      // Mesmo momento temporal em timezones diferentes
      expect(instant1.equals(instant2)).toBe(true);
    });
  });

  describe('toPlainDate', () => {
    it('deve converter para LocalDateVO', () => {
      const zdt = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const date = zdt.toPlainDate();

      expect(date).toBeInstanceOf(LocalDateVO);
      expect(date.toISO()).toBe('2024-01-15');
    });

    it('deve converter corretamente considerando o timezone', () => {
      // 10:30 em São Paulo (UTC-3) = 13:30 UTC
      // Mas a data local em São Paulo é 15/01
      const zdt = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const date = zdt.toPlainDate();

      expect(date.toISO()).toBe('2024-01-15');
    });
  });

  describe('toJSON', () => {
    it('deve retornar a data/hora no formato ISO', () => {
      const zdt = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const json = zdt.toJSON();
      expect(json).toBeDefined();
      expect(typeof json).toBe('string');
      expect(json).toContain('2024-01-15');
    });
  });

  describe('equals', () => {
    it('deve retornar true para zoned date times iguais', () => {
      const zdt1 = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const zdt2 = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      expect(zdt1.equals(zdt2)).toBe(true);
    });

    it('deve retornar false para zoned date times diferentes', () => {
      const zdt1 = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      const zdt2 = ZonedDateTimeVO.fromISO(
        '2024-01-15T11:30:00-03:00[America/Sao_Paulo]',
      );
      expect(zdt1.equals(zdt2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const zdt = ZonedDateTimeVO.fromISO(
        '2024-01-15T10:30:00-03:00[America/Sao_Paulo]',
      );
      expect(zdt.equals(undefined)).toBe(false);
    });
  });
});
