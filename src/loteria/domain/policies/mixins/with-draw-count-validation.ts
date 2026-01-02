import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';
import { DrawCountAware } from '../prize-policy';
import { StandardMatchPrizePolicyBase } from '../standard-match-prize-policy-base';

type Constructor<T = {}> = new (...args: any[]) => T;

export function WithDrawCountValidation<
  TBase extends Constructor<StandardMatchPrizePolicyBase>,
>(Base: TBase) {
  return class DrawCountValidatedPolicy extends Base implements DrawCountAware {
    readonly drawCount: number;

    constructor(...args: any[]) {
      super(...args);
      this.drawCount = args[args.length - 1] as number;
    }

    public getDrawCount(): number {
      return this.drawCount;
    }

    public override validate(handler: ValidationHandler): void {
      super.validate(handler);

      if (!Number.isInteger(this.drawCount) || this.drawCount <= 0) {
        handler.append(
          new DomainError(
            `A policy '${this.getPolicyName()}' possui drawCount inválido`,
          ),
        );
        return;
      }

      for (const c of this.getWinningMatchCounts()) {
        if (c > this.drawCount) {
          handler.append(
            new DomainError(
              `A policy '${this.getPolicyName()}' possui faixa '${c}' maior que a quantidade sorteada (${this.drawCount})`,
            ),
          );
        }
      }
    }
  };
}
