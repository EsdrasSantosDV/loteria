import { Identifier } from 'src/common/domain/identifier';

export class LotteryGameId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public getValue(): string {
    return this.value;
  }

  public static from(value: string): LotteryGameId {
    return new LotteryGameId(value);
  }

  protected toPrimitive(): unknown {
    return this.value;
  }
}
