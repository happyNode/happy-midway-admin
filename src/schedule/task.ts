import * as koa from '@midwayjs/koa';
import { App, Provide, Queue } from '@midwayjs/decorator';

import { IExecuteData } from '../interface';
import { TaskService } from '../app/service/admin/sys/task';

@Queue()
@Provide()
export class TaskExecuter {
  @App()
  app: koa.Application;

  async execute(data: IExecuteData): Promise<void> {
    const container = this.app.getApplicationContext();
    const taskService = await container.getAsync(TaskService);
    const startTime = Date.now();
    const { taskId, args } = data;
    // 在定时执行前检测并获取定时任务配置
    const task = await taskService.checkTaskBeforeExecute(taskId);
    try {
      // 传入参数，根据参数执行具体的任务
      const result = await taskService.callTask(args);

      const timing = Date.now() - startTime;
      // 任务执行成功
      await taskService.taskSuccess({ task, timing, result, data });
    } catch (error) {
      const timing = Date.now() - startTime;
      // 任务执行失败
      await taskService.taskFail({ task, timing, error, data });
    } finally {
      await taskService.checkTaskAfterExecute(task);
    }
  }
}
