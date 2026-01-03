export interface SettleDrawJob {
  drawId: string;
}

export abstract class JobQueuePort {
  abstract enqueueSettleDraw(payload: SettleDrawJob): Promise<void>;
}
