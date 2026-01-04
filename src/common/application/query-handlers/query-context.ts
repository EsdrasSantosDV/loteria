export type QueryMeta = {
  correlationId?: string;
  actorId?: string;

  requestedAt?: string;
  locale?: string;

  readConsistency?: 'strong' | 'eventual';
  cache?: {
    mode?: 'no-cache' | 'prefer-cache' | 'force-cache';
    ttlSeconds?: number;
    key?: string;
  };
};

export type Query = {
  correlationId?: string;
  actorId?: string;

  requestedAt?: string;
  locale?: string;

  readConsistency?: 'strong' | 'eventual';
  cache?: {
    mode?: 'no-cache' | 'prefer-cache' | 'force-cache';
    ttlSeconds?: number;
    key?: string;
  };
};

export type WithQueryMeta<TPayload extends object> = TPayload & QueryMeta;
