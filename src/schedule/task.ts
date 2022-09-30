import * as koa from '@midwayjs/koa';
import { App, Provide, Queue, Inject } from '@midwayjs/decorator';

import { ExecuteData } from '../interface';
// import { TaskService } from './../app/service/task';
import { TaskLogService } from './../app/service/taskLog';
import Utils from './../app/comm/utils';
import { RESULT } from './../app/constant/task';
@Queue()
@Provide()
export class TaskExecuter {
  @App()
  app: koa.Application;

  @Inject()
  utils: Utils;

  async execute(data: ExecuteData): Promise<void> {
    const container = this.app.getApplicationContext();
    // const taskService = await container.getAsync(TaskService);
    const taskLogService = await container.getAsync(TaskLogService);
    const startTime = Date.now();
    const { id, args } = data;
    // 获取定时任务配置
    // const task = await taskService.findByPk(id);
    try {
      const result = await this.utils.post(args, {});

      const timing = Date.now() - startTime;
      // 任务执行成功
      await taskLogService.create({
        taskId: id,
        result: RESULT.SUCCESS,
        consumeTime: timing,
        detail: result,
      });
    } catch (e) {
      const timing = Date.now() - startTime;
      // 执行失败
      await taskLogService.create({
        taskId: id,
        result: RESULT.FAIL,
        consumeTime: timing,
        detail: e.message,
      });
    }
  }
}
