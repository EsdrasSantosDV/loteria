export type CommandMeta = {
  correlationId?: string;
  idempotencyKey?: string;
  actorId?: string;
  occurredAt?: string; // opcional: ISO
};

export type WithCommandMeta<TPayload extends object> = TPayload & CommandMeta;
