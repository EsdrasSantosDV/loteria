import { randomBytes, createHash } from 'crypto';
import {
  RandomNumberGeneratorDomainService,
  GenerateRandomNumbersParams,
} from '../abstract/random-number-generator.domain-service';
import { NumberPool } from '../../vo/number-pool.vo';

export class RandomNumberGeneratorDomainServiceImpl extends RandomNumberGeneratorDomainService {
  private secureRandom(min: number, max: number): number {
    const entropy = randomBytes(64);
    const hash = createHash('sha512')
      .update(entropy)
      .update(Date.now().toString())
      .digest();

    const number = hash.readUInt32BE(0);
    return (number % (max - min + 1)) + min;
  }

  protected doExecute(params: GenerateRandomNumbersParams): number[] {
    const { pool, count } = params;
    const nums = new Set<number>();

    let min = 1;
    let max = 100;

    for (let i = 1; i <= 1000; i++) {
      if (pool.contains(i)) {
        min = i;
        break;
      }
    }

    for (let i = 1000; i >= 1; i--) {
      if (pool.contains(i)) {
        max = i;
        break;
      }
    }

    while (nums.size < count) {
      const num = this.secureRandom(min, max);
      if (pool.contains(num)) {
        nums.add(num);
      }
    }

    return [...nums].sort((a, b) => a - b);
  }
}
