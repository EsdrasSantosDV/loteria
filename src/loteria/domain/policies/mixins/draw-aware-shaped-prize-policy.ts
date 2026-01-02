import { PrizeTier } from '../prize-policy';
import { StandardMatchPrizePolicyBase } from '../standard-match-prize-policy-base';
import {
  WithAllowedMatchesSet,
  MatchesSetRule,
} from './with-allowed-matches-set';
import { WithDrawCountValidation } from './with-draw-count-validation';

class ConcreteStandardMatchPrizePolicyBase extends StandardMatchPrizePolicyBase {
  public constructor(...args: any[]) {
    super(args[0] as string, args[1] as PrizeTier[]);
  }
}

const Shaped = WithAllowedMatchesSet(ConcreteStandardMatchPrizePolicyBase);
const DrawAwareShaped = WithDrawCountValidation(Shaped);

export class DrawAwareShapedPrizePolicy extends DrawAwareShaped {
  private constructor(
    policyName: string,
    tiers: PrizeTier[],
    rules: MatchesSetRule[],
    drawCount: number,
  ) {
    super(policyName, tiers, rules, drawCount);
  }

  public static create(params: {
    policyName: string;
    drawCount: number;
    tiers: PrizeTier[];
    rules?: MatchesSetRule[];
  }): DrawAwareShapedPrizePolicy {
    return new DrawAwareShapedPrizePolicy(
      params.policyName,
      params.tiers,
      params.rules ?? [],
      params.drawCount,
    );
  }
}
