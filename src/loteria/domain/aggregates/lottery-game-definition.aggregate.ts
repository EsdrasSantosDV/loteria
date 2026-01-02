import { LotteryGameId } from '../identifiers/lottery-game.id';

import { NumberPool } from '../vo/number-pool.vo';
import { PickCount } from '../vo/pick-count.vo';
import { BetPriceTable } from '../vo/bet-price-table.vo';
import { Money } from '../vo/money.vo';

import { PrizePolicy, DrawCountAware } from '../policies/prize-policy';
import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { DomainError } from 'src/common/domain/validation/error';
import { ValidationHandler } from 'src/common/domain/validation/validation-handler';

export enum LotteryGameCode {
  MEGA_SENA = 'MEGA SENA',
  QUINA = 'QUINA',
  LOTOFACIL = 'LOTOFACIL',
  LOTOMANIA = 'LOTOMANIA',
}

export class LotteryGameDefinition extends AggregateRoot<LotteryGameId> {
  private readonly code: LotteryGameCode;
  private readonly name: string;
  private readonly description?: string;

  private readonly numberPool: NumberPool;
  private readonly pickCount: PickCount;

  private readonly drawCount: number;

  private readonly priceTable: BetPriceTable;
  private readonly prizePolicy: PrizePolicy;

  private constructor(
    id: LotteryGameId,
    code: LotteryGameCode,
    name: string,
    numberPool: NumberPool,
    pickCount: PickCount,
    drawCount: number,
    priceTable: BetPriceTable,
    prizePolicy: PrizePolicy,
    description?: string,
  ) {
    super(id);
    this.code = code;
    this.name = name;
    this.description = description;

    this.numberPool = numberPool;
    this.pickCount = pickCount;
    this.drawCount = drawCount;

    this.priceTable = priceTable;
    this.prizePolicy = prizePolicy;
  }

  public static create(params: {
    id: string;
    code: LotteryGameCode;
    name: string;
    numberPool: NumberPool;
    pickCount: PickCount;
    drawCount: number;
    priceTable: BetPriceTable;
    prizePolicy: PrizePolicy;
    description?: string;
  }): LotteryGameDefinition {
    return new LotteryGameDefinition(
      LotteryGameId.from(params.id),
      params.code,
      params.name,
      params.numberPool,
      params.pickCount,
      params.drawCount,
      params.priceTable,
      params.prizePolicy,
      params.description,
    );
  }

  public getCode(): LotteryGameCode {
    return this.code;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getNumberPool(): NumberPool {
    return this.numberPool;
  }

  public getPickCount(): PickCount {
    return this.pickCount;
  }

  public getDrawCount(): number {
    return this.drawCount;
  }

  public getPriceTable(): BetPriceTable {
    return this.priceTable;
  }

  public getPrizePolicy(): PrizePolicy {
    return this.prizePolicy;
  }

  public priceForPickCount(pickCount: number): Money {
    return this.priceTable.priceFor(pickCount);
  }

  public validate(handler: ValidationHandler): void {
    if (!this.name || this.name.trim().length === 0) {
      handler.append(new DomainError('O jogo deve possuir um nome'));
    }

    if (!this.code || String(this.code).trim().length === 0) {
      handler.append(new DomainError('O jogo deve possuir um código'));
    }

    if (!Number.isInteger(this.drawCount) || this.drawCount <= 0) {
      handler.append(
        new DomainError(
          'A quantidade sorteada deve ser um inteiro maior que zero',
        ),
      );
    } else {
      const poolSize = this.numberPool.size();
      if (this.drawCount > poolSize) {
        handler.append(
          new DomainError(
            `A quantidade sorteada (${this.drawCount}) não pode exceder o tamanho do universo (${poolSize})`,
          ),
        );
      }
    }

    if (this.pickCount.min < this.drawCount) {
      handler.append(
        new DomainError(
          `A quantidade mínima de escolha (${this.pickCount.min}) não pode ser menor que a quantidade sorteada (${this.drawCount})`,
        ),
      );
    }

    for (let p = this.pickCount.min; p <= this.pickCount.max; p++) {
      try {
        this.priceTable.priceFor(p);
      } catch {
        handler.append(
          new DomainError(
            `Não existe preço configurado para a quantidade de escolha '${p}' no jogo '${this.name}'`,
          ),
        );
      }
    }

    this.prizePolicy.validate(handler);

    const maybeAware = this.prizePolicy as unknown as Partial<DrawCountAware>;
    if (typeof maybeAware.getDrawCount === 'function') {
      const policyDraw = maybeAware.getDrawCount();
      if (policyDraw !== this.drawCount) {
        handler.append(
          new DomainError(
            `Inconsistência: o jogo '${this.name}' sorteia ${this.drawCount}, mas a policy foi configurada para ${policyDraw}`,
          ),
        );
      }
    }
  }
}
