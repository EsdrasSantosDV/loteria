import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class LoteriaService {
  private secureRandom(min: number, max: number): number {
    const entropy = randomBytes(64);
    const hash = createHash('sha512')
      .update(entropy)
      .update(Date.now().toString())
      .digest();

    const number = hash.readUInt32BE(0);
    return (number % (max - min + 1)) + min;
  }

  gerarMegaUltra(): number[] {
    const nums = new Set<number>();

    while (nums.size < 6) {
      nums.add(this.secureRandom(1, 60));
    }

    return [...nums].sort((a, b) => a - b);
  }
}
