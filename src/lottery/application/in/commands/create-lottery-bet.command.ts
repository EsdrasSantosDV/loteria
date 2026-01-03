import { WithCommandMeta } from 'src/common/application/use-cases/use-case-context';

export type CreateLotteryBetCommand = WithCommandMeta<{
  drawId: string;
  numbers: number[];
}>;

