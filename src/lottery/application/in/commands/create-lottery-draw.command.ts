import { WithCommandMeta } from 'src/common/application/use-cases/use-case-context';

export type CreateLotteryDrawCommand = WithCommandMeta<{
  gameId: string;
  contestNumber: number;
  scheduledAt?: string;
}>;
