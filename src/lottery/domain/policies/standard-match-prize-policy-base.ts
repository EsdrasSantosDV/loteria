import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';
import { PrizePolicy, PrizeTier } from './prize-policy';

export abstract class StandardMatchPrizePolicyBase implements PrizePolicy {
  readonly policyName: string;
  readonly tiers: PrizeTier[];

  protected constructor(policyName: string, tiers: PrizeTier[]) {
    this.policyName = policyName;
    this.tiers = [...tiers].sort((a, b) => a.matchCount - b.matchCount);
  }

  public evaluate(matches: number): PrizeTier | null {
    return this.tiers.find((t) => t.matchCount === matches) ?? null;
  }

  public validate(handler: ValidationHandler): void {
    if (!this.policyName || this.policyName.trim().length === 0) {
      handler.append(
        new DomainError('A policy de premiação deve possuir um nome'),
      );
    }

    if (!this.tiers || this.tiers.length === 0) {
      handler.append(
        new DomainError(
          `A policy '${this.policyName}' deve possuir ao menos uma faixa`,
        ),
      );
      return;
    }

    const counts = this.tiers.map((t) => t.matchCount);
    const duplicated = findDuplicates(counts);
    if (duplicated.length > 0) {
      handler.append(
        new DomainError(
          `A policy '${this.policyName}' possui faixas duplicadas: [${duplicated.join(
            ', ',
          )}]`,
        ),
      );
    }

    for (const tier of this.tiers) {
      if (!Number.isInteger(tier.matchCount) || tier.matchCount < 0) {
        handler.append(
          new DomainError(
            `A policy '${this.policyName}' possui faixa inválida: '${tier.matchCount}'`,
          ),
        );
      }
      if (!tier.name || tier.name.trim().length === 0) {
        handler.append(
          new DomainError(
            `A policy '${this.policyName}' possui uma faixa sem nome`,
          ),
        );
      }
    }
  }

  public getPolicyName(): string {
    return this.policyName;
  }

  public getWinningMatchCounts(): number[] {
    return this.tiers.map((t) => t.matchCount);
  }
}

function findDuplicates(values: number[]): number[] {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return Array.from(counts.entries())
    .filter(([_, c]) => c > 1)
    .map(([v]) => v);
}
