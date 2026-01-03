import { WithCommandMeta } from 'src/common/application/use-cases/use-case-context';

export type CloseLotteryDrawCommand = WithCommandMeta<{
  drawId: string;
}>;

