import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  ResourceGuard,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { KeycloakConditionalGuard } from '../adapters/auth/allow-keycloak-conditional.guard';
import {
  AUTH_FEATURE,
  AuthFeatureConfig,
} from '../adapters/auth/auth.constants';

type AuthModuleRegisterOptions = {
  environmentKey?: string;

  localValue?: string;
};

@Module({})
export class AuthModule {
  static register(options: AuthModuleRegisterOptions = {}): DynamicModule {
    const environmentKey = options.environmentKey ?? 'ENVIRONMENT';
    const localValue = (options.localValue ?? 'local').toLowerCase();

    const featureProvider: Provider = {
      provide: AUTH_FEATURE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): AuthFeatureConfig => {
        const env = (config.get<string>(environmentKey) ?? '').toLowerCase();
        const enabled = env !== localValue;
        return { enabled };
      },
    };

    return {
      module: AuthModule,
      imports: [
        ConfigModule,
        KeycloakConnectModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              authServerUrl:
                configService.get<string>('keycloak.url') ??
                'http://localhost:8080',
              realm: configService.get<string>('keycloak.realm') ?? 'local',
              clientId:
                configService.get<string>('keycloak.clientId') ?? 'local',
              secret: configService.get<string>('keycloak.secret') ?? 'local',

              policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
              tokenValidation: TokenValidation.ONLINE,
            };
          },
        }),
      ],
      providers: [
        featureProvider,
        AuthGuard,
        ResourceGuard,
        RoleGuard,
        KeycloakConditionalGuard,
        { provide: APP_GUARD, useClass: KeycloakConditionalGuard },
      ],
      exports: [],
    };
  }
}
