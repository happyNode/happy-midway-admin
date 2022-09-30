import { QueueService } from '@midwayjs/task';
import { Provide, Inject } from '@midwayjs/decorator';

import { TaskExecuter } from './../../schedule/task';
import { BaseService } from '../../core/baseService';
import { TaskMapping } from './../mapping/task';
import { TaskEntity } from './../entity/task';
import { CreateTaskDTO, UpdateTaskDTO, GetListDTO } from './../model/dto/task';
import { TaskLogService } from './taskLog';
import { STATUS, TYPE } from './../constant/task';

@Provide()
export class TaskService extends BaseService {
  @Inject()
  protected mapping: TaskMapping;

  @Inject()
  queueService: QueueService;

  @Inject()
  taskLogService: TaskLogService;

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
    // 查找所有需要运行的任务
    const tasks = await this.mapping.findAll({ status: 1 });
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
  async addTask(params: CreateTaskDTO): Promise<void> {
    // 判断定时器任务名称唯一
    let task = await this.mapping.findOne({ taskName: params.taskName });
    if (task) {
      throw new Error('已有相同名称的定时任务');
    }
    task = await this.mapping.saveNew(params);
    await this._startOrStopTask(task);
  }

  /**
   * 更新任务
   */
  async updateTask(params: UpdateTaskDTO): Promise<void> {
    let task = await this.mapping.findByPk(params.taskId);
    if (!task) {
      throw new Error('无效的定时任务，请重新刷新页面');
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
      throw new Error('无效的定时任务，请重新刷新页面');
    }
    await this._start(task);
  }

  /**
   * 暂停任务
   */
  async stopTask(taskId: number): Promise<void> {
    const task = await this.mapping.findByPk(taskId);
    if (!task) {
      throw new Error('无效的定时任务，请重新刷新页面');
    }
    await this._stop(task);
  }

  /**
   * 手动启动一次任务
   */
  async once(taskId: number): Promise<void> {
    const task = await this.mapping.findByPk(taskId);
    if (!task) {
      throw new Error('无效的定时任务，请重新刷新页面');
    }
    await this.queueService.execute(
      TaskExecuter,
      { id: task.taskId, args: task.args },
      { jobId: task.taskId, removeOnComplete: true, removeOnFail: true }
    );
  }

  /**
   * 开始任务
   */
  private async _start(task: TaskEntity): Promise<void> {
    // 先停掉之前存在的任务
    await this._stop(task);
    let repeat: any;
    if (task.type === TYPE.INTERVAL) {
      // 间隔 Repeat every millis (cron setting cannot be used together with this setting.)
      repeat = {
        every: task.every,
      };
    } else {
      // cron
      repeat = {
        cron: task.cron,
      };
      // Start date when the repeat job should start repeating (only with cron).
      if (task.startTime) {
        repeat.startDate = task.startTime;
      }
      if (task.endTime) {
        repeat.endDate = task.endTime;
      }
    }
    if (task.limit > 0) {
      repeat.limit = task.limit;
    }
    const job = await this.queueService.execute(
      TaskExecuter,
      { id: task.taskId, args: task.args },
      { jobId: task.taskId, removeOnComplete: true, removeOnFail: true, repeat }
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
      await this.mapping.modify({ status: STATUS.STOP }, task.taskId);
      throw new Error('Task Start failed');
    }
  }

  /**
   * 暂停任务
   */
  private async _stop(task: TaskEntity): Promise<void> {
    if (!task) {
      throw new Error('Task is Empty');
    }
    const exist = await this.existJob(task.taskId.toString());
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
  async existJob(jobId: string): Promise<boolean> {
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
    if (!task || task.status === STATUS.STOP) {
    }
    // 是否有limit限制并且limit不为0
    return task;
  }

  /**
   * 在执行完定时后，检测任务
   */
  async checkTaskAfterExecute(task: TaskEntity) {}

  // TODO 待删除
  async execute() {
    // 3秒后触发分布式任务调度。
    await this.queueService.execute(
      TaskExecuter,
      { id: 1, args: 'http://127.0.0.1:7002/api/home/test' },
      {
        repeat: {
          cron: '0 * * * * *',
        },
      }
    );
  }
}
