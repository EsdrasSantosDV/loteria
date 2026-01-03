import { WithCommandMeta } from 'src/common/application/use-cases/use-case-context';

export type CreateQuickBetQueueCommand = WithCommandMeta<{
  drawId: string;
  count: number;
}>;
