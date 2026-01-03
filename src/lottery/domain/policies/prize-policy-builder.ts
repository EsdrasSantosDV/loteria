import { PrizePolicy, PrizeTier } from './prize-policy';
import { DrawAwareShapedPrizePolicy } from './mixins/draw-aware-shaped-prize-policy';
import { MatchesSetRule } from './mixins/with-allowed-matches-set';

export class PrizePolicyBuilder {
  private policyName?: string;
  private draw?: number;

  private tiers: PrizeTier[] = [];
  private rules: MatchesSetRule[] = [];

  private constructor() {}

  public static named(name: string): PrizePolicyBuilder {
    const b = new PrizePolicyBuilder();
    b.policyName = name;
    return b;
  }

  public drawCount(drawCount: number): PrizePolicyBuilder {
    this.draw = drawCount;
    return this;
  }

  public include(matchCount: number, name?: string): PrizePolicyBuilder {
    this.tiers.push({
      matchCount,
      name: name ?? `${matchCount} acertos`,
    });
    return this;
  }

  public range(
    min: number,
    max: number,
    nameFactory?: (m: number) => string,
  ): PrizePolicyBuilder {
    const factory = nameFactory ?? ((m) => `${m} acertos`);
    for (let i = min; i <= max; i++) {
      this.include(i, factory(i));
    }
    return this;
  }

  public restrictTo(
    allowed: Array<number | { min: number; max: number }>,
  ): PrizePolicyBuilder {
    this.rules.push({ kind: 'mustNotIncludeOutsideOf', allowed });
    return this;
  }

  public requireInclude(matchCount: number): PrizePolicyBuilder {
    this.rules.push({ kind: 'mustInclude', matchCount });
    return this;
  }

  public requireRange(min: number, max: number): PrizePolicyBuilder {
    this.rules.push({ kind: 'mustIncludeRange', min, max });
    return this;
  }

  public build(): PrizePolicy {
    return DrawAwareShapedPrizePolicy.create({
      policyName: this.policyName ?? '',
      drawCount: this.draw ?? 0,
      tiers: this.tiers,
      rules: this.rules,
    });
  }
}
