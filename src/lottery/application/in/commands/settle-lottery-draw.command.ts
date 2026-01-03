import { WithCommandMeta } from 'src/common/application/use-cases/use-case-context';

export type SettleLotteryDrawCommand = WithCommandMeta<{
  drawId: string;
}>;

