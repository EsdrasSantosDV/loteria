export type ErrorMetadata = Record<string, unknown>;

export abstract class AppError<
  Code extends string = string,
  Message extends string = string,
  Meta extends ErrorMetadata = ErrorMetadata,
> {
  readonly code: Code;
  readonly message: Message;
  readonly meta?: Meta;

  protected constructor(code: Code, message: Message, meta?: Meta) {
    this.code = code;
    this.message = message;
    this.meta = meta;
  }
}
