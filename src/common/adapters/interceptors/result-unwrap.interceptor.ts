import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Result } from '../../application/result';
import { unwrapHttpResult } from '../http/unwrap-http-result';

@Injectable()
export class ResultUnwrapInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (!Result.isResult(data)) return data;
        return unwrapHttpResult(data);
      }),
    );
  }
}
