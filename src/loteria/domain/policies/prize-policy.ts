import { ValidationHandler } from 'src/common/domain/validation/validation-handler';

export type PrizeTier = {
  name: string;
  matchCount: number;
};

export interface PrizePolicy {
  evaluate(matches: number): PrizeTier | null;
  validate(handler: ValidationHandler): void;
}

export interface DrawCountAware {
  getDrawCount(): number;
}
