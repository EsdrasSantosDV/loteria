import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResultUnwrapInterceptor } from '../adapters/interceptors/result-unwrap.interceptor';
import { DomainExceptionFilter } from '../adapters/filters/domain-exception.filter';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
  ],
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
