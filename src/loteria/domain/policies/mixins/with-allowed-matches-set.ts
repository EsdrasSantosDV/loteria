import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';
import { StandardMatchPrizePolicyBase } from '../standard-match-prize-policy-base';

type Constructor<T = {}> = new (...args: any[]) => T;

export type MatchesSetRule =
  | { kind: 'mustInclude'; matchCount: number }
  | { kind: 'mustIncludeRange'; min: number; max: number }
  | {
      kind: 'mustNotIncludeOutsideOf';
      allowed: Array<number | { min: number; max: number }>;
    };

export function WithAllowedMatchesSet<
  TBase extends Constructor<StandardMatchPrizePolicyBase>,
>(Base: TBase) {
  return class AllowedMatchesSetPolicy extends Base {
    readonly rules: MatchesSetRule[];

    constructor(...args: any[]) {
      super(...args);
      this.rules = args[args.length - 2] as MatchesSetRule[];
    }

    public override validate(handler: ValidationHandler): void {
      super.validate(handler);

      const counts = new Set(this.getWinningMatchCounts());

      for (const rule of this.rules ?? []) {
        if (rule.kind === 'mustInclude') {
          if (!counts.has(rule.matchCount)) {
            handler.append(
              new DomainError(
                `A policy '${this.getPolicyName()}' deve incluir a faixa '${rule.matchCount}'`,
              ),
            );
          }
        }

        if (rule.kind === 'mustIncludeRange') {
          for (let i = rule.min; i <= rule.max; i++) {
            if (!counts.has(i)) {
              handler.append(
                new DomainError(
                  `A policy '${this.getPolicyName()}' deve incluir a faixa '${i}' (intervalo ${rule.min}..${rule.max})`,
                ),
              );
            }
          }
        }

        if (rule.kind === 'mustNotIncludeOutsideOf') {
          const isAllowed = (m: number): boolean => {
            for (const a of rule.allowed) {
              if (typeof a === 'number' && a === m) return true;
              if (typeof a === 'object' && m >= a.min && m <= a.max)
                return true;
            }
            return false;
          };

          for (const m of counts) {
            if (!isAllowed(m)) {
              handler.append(
                new DomainError(
                  `A policy '${this.getPolicyName()}' possui faixa '${m}' fora do conjunto permitido`,
                ),
              );
            }
          }
        }
      }
    }
  };
}
