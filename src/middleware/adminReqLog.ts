import { Provide } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { IMiddleware } from '@midwayjs/core';
import { ReqLogService } from '../app/service/admin/sys/reqLog';

@Provide()
export class AdminReqLogMiddleware
  implements IMiddleware<Context, NextFunction>
{
  public static getName(): string {
    return 'adminReqLog';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      await next();
      const reportTime = Date.now() - startTime;
      ctx.set('X-Response-Time', reportTime.toString());
      const { url } = ctx;
      ctx.requestContext.getAsync(ReqLogService).then(service => {
        service.saveNew(
          url.split('?')[0],
          ctx.req.method === 'GET' ? ctx.request.query : ctx.request.body,
          ctx.status,
          reportTime,
          ctx.req.method,
          ctx.state.admin ? ctx.state.admin.userId : 1
        );
      });
    };
  }

  match(ctx: Context): boolean {
    return ctx.path.startsWith('/api/classroom');
  }
}
