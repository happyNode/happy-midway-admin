import * as dotenv from 'dotenv';
dotenv.config();

import * as koa from '@midwayjs/koa';
import { App, Configuration, Logger } from '@midwayjs/decorator';
import * as task from '@midwayjs/task';
import * as validate from '@midwayjs/validate';
import * as crossDomain from '@midwayjs/cross-domain';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { IMidwayLogger } from '@midwayjs/logger';
import * as swagger from '@midwayjs/swagger';
import * as jaeger from '@mw-components/jaeger';
import * as koid from '@mw-components/koid';
import * as redis from '@midwayjs/redis';
import * as sequlize from '@midwayjs/sequelize';
import { join } from 'path';
import * as jwt from '@midwayjs/jwt';
import * as cache from '@midwayjs/cache';
import * as axios from '@midwayjs/axios';

import { RequestIdMiddleware } from './middleware/requestId';
import { FormatMiddleware } from './middleware/format';
import { AccessLogMiddleware } from './middleware/accessLog';
import { JwtMiddleware } from './middleware/jwt';
import { AdminReqLogMiddleware } from './middleware/adminReqLog';
import { NotFoundFilter } from './filter/notfound';
import { TaskService } from './app/service/admin/sys/task';

@Configuration({
  importConfigs: [join(__dirname, './config')],
  conflictCheck: true,
  imports: [
    crossDomain,
    koa,
    jaeger,
    koid,
    cache,
    { component: swagger, enabledEnvironment: ['local'] },
    redis,
    task,
    validate,
    sequlize,
    jwt,
    axios,
  ],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: koa.Application;
  @Logger()
  readonly logger: IMidwayLogger;

  async onReady(applicationContext: IMidwayContainer): Promise<void> {
    this.app.useMiddleware([
      RequestIdMiddleware,
      AccessLogMiddleware,
      FormatMiddleware,
      JwtMiddleware,
      AdminReqLogMiddleware,
    ]);
    this.app.useFilter([NotFoundFilter]);
  }

  async onServerReady(container: IMidwayContainer): Promise<void> {
    // 初始化系统任务
    const taskService = await container.getAsync(TaskService);
    await taskService.initTask();
  }

  async onStop(): Promise<void> {}
}
