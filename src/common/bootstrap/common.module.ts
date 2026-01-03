import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResultUnwrapInterceptor } from '../adapters/interceptors/result-unwrap.interceptor';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultUnwrapInterceptor,
    },
  ],
  controllers: [],
})
export class CommonModule {}
