import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AUTH_FEATURE, AuthFeatureConfig } from './auth.constants';
import { AuthGuard, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConditionalGuard implements CanActivate {
  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const feature = this.moduleRef.get<AuthFeatureConfig>(AUTH_FEATURE, {
      strict: false,
    });
    if (!feature?.enabled) {
      return true;
    }

    const authGuard = this.moduleRef.get(AuthGuard, { strict: false });
    const resourceGuard = this.moduleRef.get(ResourceGuard, { strict: false });
    const roleGuard = this.moduleRef.get(RoleGuard, { strict: false });

    const run = async (g: CanActivate) => {
      const r = g.canActivate(ctx);
      return r instanceof Promise ? await r : r;
    };

    if (!(await run(authGuard))) return false;
    if (!(await run(resourceGuard))) return false;
    if (!(await run(roleGuard))) return false;

    return true;
  }
}
