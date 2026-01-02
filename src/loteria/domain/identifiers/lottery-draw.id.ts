import { Identifier } from 'src/common/domain/identifier';

export class LotteryDrawId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public getValue(): string {
    return this.value;
  }

  public static from(value: string): LotteryDrawId {
    return new LotteryDrawId(value);
  }

  protected toPrimitive(): unknown {
    return { value: this.value };
  }
}
