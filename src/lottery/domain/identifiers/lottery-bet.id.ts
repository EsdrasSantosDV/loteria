import { Identifier } from 'src/common/domain/identifier';

export class LotteryBetId extends Identifier<string> {
  protected toPrimitive(): unknown {
    return { value: this.value };
  }
  private constructor(value: string) {
    super(value);
  }

  public getValue(): string {
    return this.value;
  }

  public static from(value: string): LotteryBetId {
    return new LotteryBetId(value);
  }

  public static generate(): LotteryBetId {
    const uuid = crypto.randomUUID();
    return new LotteryBetId(`BET-${uuid}`);
  }
}
