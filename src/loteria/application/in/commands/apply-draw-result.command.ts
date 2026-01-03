import { WithCommandMeta } from 'src/common/application/use-cases/use-case-context';

export type ApplyDrawResultCommand = WithCommandMeta<{
  drawId: string;
  numbers: number[];
}>;

