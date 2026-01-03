import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResultUnwrapInterceptor } from '../adapters/interceptors/result-unwrap.interceptor';
import { DomainExceptionFilter } from '../adapters/filters/domain-exception.filter';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultUnwrapInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
  controllers: [],
})
export class CommonModule {}
