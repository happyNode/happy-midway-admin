import { QueueService } from '@midwayjs/task';
import { Provide, Inject } from '@midwayjs/decorator';
import { CronRepeatOptions, EveryRepeatOptions } from 'bull';

import MyError from '../../../comm/myError';
import { TaskExecuter } from '../../../../schedule/task';
import { BaseService } from '../../../../core/baseService';
import { TaskMapping } from '../../../mapping/task';
import { TaskLogMapping } from '../../../mapping/taskLog';
import { TaskEntity } from '../../../entity/task';
import { TaskLogEntity } from '../../../entity/taskLog';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  GetListDTO,
  GetLogsDTO,
} from '../../../model/dto/task';
import { TaskLogService } from './taskLog';
import { STATUS, TYPE, RUN_MODE, RESULT } from '../../../constant/task';
import { IExecuteData, ITaskArgs } from '../../../../interface';
import { EmailService } from './../comm/email';

@Provide()
export class TaskService extends BaseService {
  @Inject()
  protected mapping: TaskMapping;

  @Inject()
  protected taskLogMapping: TaskLogMapping;

  @Inject()
  queueService: QueueService;

  @Inject()
  taskLogService: TaskLogService;

  @Inject()
  emailService: EmailService;

  /**
   * 初始化任务，系统启动前调用
   */
  async initTask(): Promise<void> {
    // 移除所有已存在的任务
    await this.queueService.getClassQueue(TaskExecuter).removeJobs('*');
    const repeatableJobs = await this.queueService
      .getClassQueue(TaskExecuter)
      .getRepeatableJobs();
    // 移除所有配置信息
    await Promise.all(
      repeatableJobs.map(job =>
        this.queueService
          .getClassQueue(TaskExecuter)
          .removeRepeatableByKey(job.key)
      )
    );
    console.log('已移除目前存在的定时任务 ✅');
    // 查找所有需要运行的任务
    const tasks = await this.mapping.findAll({ status: STATUS.START });
    await Promise.all(tasks.map(task => this._start(task)));
    console.log('定时任务加载完成 ✅');
  }

  /**
   * 获取任务列表
   */
  async getList(params: GetListDTO): Promise<{
    rows: TaskEntity[];
    count: number;
  }> {
    const { page, limit } = params;
    const tasks = await this.mapping.findAndCountAll(page, limit);
    return tasks;
  }

  /**
   * 获取任务详情
   */
  async getTask(taskId: number): Promise<TaskEntity> {
    const task = await this.mapping.findByPk(taskId);
    return task;
  }

  /**
   * 添加任务
   */
  async addTask(userId: number, params: CreateTaskDTO): Promise<void> {
    // 判断定时器任务名称唯一
    let task = await this.mapping.findOne({ taskName: params.taskName });
    if (task) {
      throw new MyError('已有相同名称的定时任务');
    }
    task = await this.mapping.saveNew({ userId, ...params });
    await this._startOrStopTask(task);
  }

  /**
   * 更新任务
   */
  async updateTask(params: UpdateTaskDTO): Promise<void> {
    let task = await this.mapping.findByPk(params.taskId);
    if (!task) {
      throw new MyError('无效的定时任务，请重新刷新页面');
    }
    task = await task.update(params);
    await this._startOrStopTask(task);
  }

  /**
   * 开始或暂停任务
   */
  private async _startOrStopTask(task: TaskEntity) {
    if (task.status === STATUS.STOP) {
      await this._stop(task);
    } else if (task.status === STATUS.START) {
      await this._start(task);
    }
  }

  /**
   * 启动任务
   */
  async startTask(taskId: number): Promise<void> {
    const task = await this.mapping.findByPk(taskId);
    if (!task) {
      throw new MyError('无效的定时任务，请重新刷新页面');
    }
    await this._start(task);
  }

  /**
   * 暂停任务
   */
  async stopTask(taskId: number): Promise<void> {
    const task = await this.mapping.findByPk(taskId);
    if (!task) {
      throw new MyError('无效的定时任务，请重新刷新页面');
    }
    await this._stop(task);
  }

  /**
   * 手动启动一次任务
   */
  async once(taskId: number): Promise<void> {
    const task = await this.mapping.findByPk(taskId);
    if (!task) {
      throw new MyError('无效的定时任务，请重新刷新页面');
    }
    await this.queueService.execute(
      TaskExecuter,
      { taskId: task.taskId, args: task.args, runMode: RUN_MODE.MANUAL },
      { jobId: task.taskId, removeOnComplete: true, removeOnFail: true }
    );
  }

  /**
   * remove task
   */
  async remove(taskId: number): Promise<void> {
    const task = await this.mapping.findByPk(taskId);
    if (!task) {
      throw new MyError('无效的定时任务，请重新刷新页面');
    }
    await this._stop(task);
    await this.mapping.destroy({ taskId: task.taskId });
  }

  /**
   * 获取任务下拉框
   */
  async select(): Promise<TaskEntity[]> {
    const task = await this.mapping.findAll(
      {},
      { attributes: ['taskId', 'taskName'] }
    );
    return task;
  }

  /**
   * 查询任务日志列表(分页)
   */
  async logs(params: GetLogsDTO): Promise<{
    rows: TaskLogEntity[];
    count: number;
  }> {
    const { page, limit, taskId } = params;
    const where = {};
    if (typeof taskId === 'number') {
      where['taskId'] = taskId;
    }
    const logs = await this.taskLogMapping.findAndCountAll(page, limit, where);
    return logs;
  }

  private _getRepeatOptions(
    task: TaskEntity
  ): CronRepeatOptions | EveryRepeatOptions {
    let repeat: any = {};
    if (task.endTime) {
      repeat.endDate = task.endTime;
    }
    if (task.limit > 0) {
      repeat.limit = task.limit;
    }
    if (task.type === TYPE.INTERVAL) {
      // 间隔 Repeat every millis (cron setting cannot be used together with this setting.)
      repeat = {
        every: task.every,
      };
    } else if (task.type === TYPE.CRON) {
      repeat = {
        cron: task.cron,
      };
      // Start date when the repeat job should start repeating (only with cron).
      if (task.startTime) {
        repeat.startDate = task.startTime;
      }
    } else {
      throw new MyError('非法的定时类型');
    }

    return repeat;
  }

  /**
   * 开始任务
   */
  private async _start(task: TaskEntity): Promise<void> {
    // 先停掉之前存在的任务
    await this._stop(task);
    const repeat = this._getRepeatOptions(task);
    const job = await this.queueService.execute(
      TaskExecuter,
      { taskId: task.taskId, args: task.args, runMode: RUN_MODE.AUTO },
      {
        jobId: task.taskId,
        removeOnComplete: true,
        removeOnFail: true,
        repeat,
      }
    );

    if (job && job.opts) {
      await this.mapping.modify(
        {
          status: STATUS.START,
        },
        { taskId: task.taskId }
      );
    } else {
      // update status to 0，标识暂停任务，因为启动失败
      job && (await job.remove());
      await this.mapping.modify(
        { status: STATUS.STOP },
        { taskId: task.taskId }
      );
      throw new MyError('Task Start failed');
    }
  }

  /**
   * 暂停任务
   */
  private async _stop(task: TaskEntity): Promise<void> {
    if (!task) {
      throw new MyError('Task is Empty');
    }
    const exist = await this._existJob(task.taskId.toString());
    if (!exist) {
      await this.mapping.modify(
        { status: STATUS.STOP },
        { taskId: task.taskId }
      );
      return;
    }
    const jobs = await this.queueService
      .getClassQueue(TaskExecuter)
      .getJobs([
        'active',
        'delayed',
        'failed',
        'paused',
        'waiting',
        'completed',
      ]);
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].data.id === task.taskId) {
        await jobs[i].remove();
      }
    }
    await this.mapping.modify({ status: STATUS.STOP }, { taskId: task.taskId });
  }

  /**
   * 查看队列中任务是否存在
   */
  private async _existJob(jobId: string): Promise<boolean> {
    const jobs = await this.queueService
      .getClassQueue(TaskExecuter)
      .getRepeatableJobs();
    const ids = jobs.map(e => {
      return e.id;
    });
    return ids.includes(jobId);
  }

  /**
   * 在执行定时之前，检测任务
   */
  async checkTaskBeforeExecute(taskId: number): Promise<TaskEntity> {
    const task = await this.mapping.findByPk(taskId);
    /**
     * 判断任务是否存在库中、
     * 状态是否为启动中、
     * 是否有startTime配置并且当前时间大于startTime
     * 是否有endTime配置并且当前时间小于endTime
     */
    if (!task) {
      throw new MyError('Task is Empty');
    }
    if (task.status === STATUS.STOP) {
      throw new MyError('Task is Stopping');
    }
    // 是否有limit限制并且limit不为0
    if (task.limit === 0) {
      throw new MyError('Task limit is 0');
    }

    return task;
  }

  // 任务执行成功
  async taskSuccess({
    task,
    timing,
    result,
    data,
  }: {
    task: TaskEntity;
    timing: number;
    result: any;
    data: IExecuteData;
  }): Promise<void> {
    const { taskId } = task;
    const { runMode } = data;
    // 记录日志
    await this.taskLogMapping.saveNew({
      taskId,
      result: RESULT.SUCCESS,
      consumeTime: timing,
      detail: result,
      runMode,
    });
  }

  // 任务执行失败
  async taskFail({
    task,
    timing,
    error,
    data,
  }: {
    task: TaskEntity;
    timing: number;
    error: any;
    data: IExecuteData;
  }): Promise<void> {
    const { taskId, emailNotice, taskName } = task;
    const { runMode } = data;
    // 记录日志
    await this.taskLogMapping.saveNew({
      taskId,
      result: RESULT.FAIL,
      consumeTime: timing,
      detail: error.message,
      runMode,
    });
    // TODO 发送邮件通知，邮件类型待定
    const emails = emailNotice.split(',');
    if (emails.length > 0) {
      this.emailService.sendEmails({
        emails,
        emailType: 'WITHDRAW_FAILURE',
        content: `定时任务：${taskName}执行异常：${error.message}，请速速排查。`,
      });
    }
  }

  /**
   * 在执行完定时后，检测任务
   */
  async checkTaskAfterExecute(task: TaskEntity): Promise<void> {
    if (task.limit > 0) {
      await this.mapping.modify(
        { limit: task.limit - 1 },
        { taskId: task.taskId }
      );
    }
    task = await this.mapping.findByPk(task.taskId);

    if (this._checkTaskIsNeedStop(task)) {
      await this.mapping.modify(
        { status: STATUS.STOP },
        { taskId: task.taskId }
      );
    }
  }

  // 判断任务是否需要停止
  private _checkTaskIsNeedStop(task: TaskEntity): boolean {
    const FORMAT = 'second';
    if (
      task.limit === 0 ||
      (task.endTime &&
        this.utils.diffDate(this.utils.getDateNow(), task.endTime, FORMAT) >= 0)
    ) {
      return true;
    }
    return false;
  }

  public async callTask(args: string): Promise<string> {
    const taskArgs: ITaskArgs = JSON.parse(args);
    const { method, url } = taskArgs;
    let result: any;
    // TODO 待支持多种任务类型，不仅仅http请求
    if (method.toUpperCase() === 'POST') {
      result = await this.utils.post(url, {});
    } else if (method.toUpperCase() === 'GET') {
      // TODO get暂时没写
    } else {
      throw new MyError(`Task method error: ${method}`);
    }
    return result;
  }

  public async clearLogs(): Promise<number> {
    const result = await this.taskLogMapping.destroy({});
    return result;
  }
}
