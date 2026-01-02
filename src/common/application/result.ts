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
};
