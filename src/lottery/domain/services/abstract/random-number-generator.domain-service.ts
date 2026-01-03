import { DomainService } from 'src/common/domain/services/domain-servive-abstract';
import { NumberPool } from '../../vo/number-pool.vo';

export type GenerateRandomNumbersParams = {
  pool: NumberPool;
  count: number;
};

export abstract class RandomNumberGeneratorDomainService extends DomainService<
  GenerateRandomNumbersParams,
  number[]
> {}
