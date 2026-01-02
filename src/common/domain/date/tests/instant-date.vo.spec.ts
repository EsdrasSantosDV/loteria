import { InstantVO } from '../instant-date.vo';

describe('InstantVO', () => {
  describe('now', () => {
    it('deve criar uma instância com o instante atual', () => {
      const instant = InstantVO.now();
      expect(instant).toBeDefined();
      expect(instant.toISO()).toBeDefined();
      expect(typeof instant.toISO()).toBe('string');
    });
  });

  describe('fromISO', () => {
    it('deve criar uma instância a partir de uma string ISO', () => {
      const instant = InstantVO.fromISO('2024-01-15T10:30:00Z');
      expect(instant.toISO()).toContain('2024-01-15');
    });

    it('deve lançar erro para formato ISO inválido', () => {
      expect(() => InstantVO.fromISO('invalid-instant')).toThrow();
    });
  });

  describe('value', () => {
    it('deve retornar o valor Temporal.Instant', () => {
      const instant = InstantVO.fromISO('2024-01-15T10:30:00Z');
      expect(instant.value).toBeDefined();
      expect(instant.value.toString()).toContain('2024-01-15');
    });
  });

  describe('toISO', () => {
    it('deve retornar o instante no formato ISO', () => {
      const instant = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const iso = instant.toISO();
      expect(iso).toBeDefined();
      expect(typeof iso).toBe('string');
      expect(iso).toContain('2024-01-15');
    });
  });

  describe('plusSeconds', () => {
    it('deve adicionar segundos ao instante', () => {
      const instant1 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const instant2 = instant1.plusSeconds(60);

      expect(instant2.isBefore(instant1)).toBe(false);
      expect(instant1.isBefore(instant2)).toBe(true);
    });

    it('deve adicionar segundos corretamente', () => {
      const instant1 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const instant2 = instant1.plusSeconds(120);

      const diff = instant2.value.until(instant1.value, {
        largestUnit: 'second',
      });
      expect(Math.abs(Number(diff.seconds))).toBe(120);
    });
  });

  describe('isBefore', () => {
    it('deve retornar true quando o instante é anterior', () => {
      const instant1 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const instant2 = InstantVO.fromISO('2024-01-15T10:31:00Z');
      expect(instant1.isBefore(instant2)).toBe(true);
    });

    it('deve retornar false quando o instante é posterior', () => {
      const instant1 = InstantVO.fromISO('2024-01-15T10:31:00Z');
      const instant2 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      expect(instant1.isBefore(instant2)).toBe(false);
    });

    it('deve retornar false quando os instantes são iguais', () => {
      const instant1 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const instant2 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      expect(instant1.isBefore(instant2)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('deve retornar o instante no formato ISO', () => {
      const instant = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const json = instant.toJSON();
      expect(json).toBeDefined();
      expect(typeof json).toBe('string');
      expect(json).toContain('2024-01-15');
    });
  });

  describe('equals', () => {
    it('deve retornar true para instantes iguais', () => {
      const instant1 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const instant2 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      expect(instant1.equals(instant2)).toBe(true);
    });

    it('deve retornar false para instantes diferentes', () => {
      const instant1 = InstantVO.fromISO('2024-01-15T10:30:00Z');
      const instant2 = InstantVO.fromISO('2024-01-15T10:31:00Z');
      expect(instant1.equals(instant2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const instant = InstantVO.fromISO('2024-01-15T10:30:00Z');
      expect(instant.equals(undefined)).toBe(false);
    });
  });
});
