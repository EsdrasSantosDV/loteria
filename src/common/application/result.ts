import { AppError } from './errors/app-error';

export type Ok<T> = { ok: true; value: T };
export type Fail<E extends AppError = AppError> = { ok: false; error: E };

export type Result<T, E extends AppError = AppError> = Ok<T> | Fail<E>;

export const Result = {
  ok<T>(value: T): Ok<T> {
    return { ok: true, value };
  },

  fail<E extends AppError>(error: E): Fail<E> {
    return { ok: false, error };
  },

  isOk<T, E extends AppError>(r: Result<T, E>): r is Ok<T> {
    return r.ok;
  },

  isFail<T, E extends AppError>(r: Result<T, E>): r is Fail<E> {
    return !r.ok;
  },

  isResult(value: unknown): value is AnyResult {
    return (
      value &&
      typeof value === 'object' &&
      typeof (value as AnyResult).ok === 'boolean' &&
      ('value' in value || 'error' in value)
    );
  },
};

type AnyResult = Result<unknown, AppError>;
