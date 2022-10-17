import { Provide, IMiddleware, Inject } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import * as _ from 'lodash';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';

import { NO_AUTH_PREFIX_URL } from '../app/constant/base';
import { AdminVerifyService } from '../app/service/admin/comm/verify';

@Provide()
export class AdminAuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  private jwtService: JwtService;

  public static getName(): string {
    return 'adminAuth';
  }

  public resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { path } = ctx;

      const token = ctx.get('Authorization').trim();

      if (_.isEmpty(token)) {
        throw new httpError.UnauthorizedError();
      }

      try {
        ctx.state.admin = await this.jwtService.verify(token, {});
      } catch (e) {
        throw new httpError.UnauthorizedError();
      }
      if (!ctx.state.admin) {
        throw new httpError.UnauthorizedError();
      }

      const verifyService = await ctx.requestContext.getAsync(
        AdminVerifyService
      );

      const pv = await verifyService.getRedisPasswordVersionById(
        ctx.admin.userId
      );
      if (pv !== `${ctx.admin.pv}`) {
        throw new httpError.UnauthorizedError();
      }

      const redisToken = await verifyService.getRedisTokenById(
        ctx.admin.userId
      );
      if (token !== redisToken) {
        // 与redis保存不一致
        throw new httpError.UnauthorizedError();
      }

      // 后续校验权限
      const perms: string = await verifyService.getRedisPermsById(
        ctx.admin.userId
      );
      // 安全判空
      if (_.isEmpty(perms)) {
        throw new httpError.UnauthorizedError();
      }

      // 将admin:user等转换成admin/user
      const permArray: string[] = (JSON.parse(perms) as string[]).map(e => {
        return e.replace(/:/g, '/');
      });

      // 遍历权限是否包含该url，不包含则无访问权限
      if (!permArray.includes(path.replace('/admin/', ''))) {
        throw new httpError.UnauthorizedError();
      }

      await next();
    };
  }

  public match(ctx: Context): boolean {
    const { path } = ctx;

    if (path.startsWith(`/api${NO_AUTH_PREFIX_URL}/`)) {
      return false;
    }
    return true;
  }
}
