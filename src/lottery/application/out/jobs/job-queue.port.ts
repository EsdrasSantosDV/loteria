export interface SettleDrawJob {
  drawId: string;
}

export interface CreateQuickBetJob {
  drawId: string;
  count: number;
}

export abstract class JobQueuePort {
  abstract enqueueSettleDraw(payload: SettleDrawJob): Promise<void>;
  abstract enqueueCreateQuickBet(payload: CreateQuickBetJob): Promise<void>;
}
