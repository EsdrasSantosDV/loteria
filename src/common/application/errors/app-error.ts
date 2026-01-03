export type ErrorMetadata = Record<string, unknown>;

export type ErrorKind =
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INVARIANT'
  | 'UNEXPECTED';

export abstract class AppError<
  Code extends string = string,
  Message extends string = string,
  Meta extends ErrorMetadata = ErrorMetadata,
> {
  readonly code: Code;
  readonly message: Message;
  readonly kind: ErrorKind;
  readonly meta?: Meta;

  protected constructor(params: {
    code: Code;
    message: Message;
    kind: ErrorKind;
    meta?: Meta;
  }) {
    this.code = params.code;
    this.message = params.message;
    this.kind = params.kind;
    this.meta = params.meta;
  }
}
