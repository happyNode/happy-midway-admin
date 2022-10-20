import {
  Inject,
  Controller,
  Get,
  Post,
  Body,
  ALL,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';

import { TaskService } from '../../service/admin/sys/task';
import { BaseController } from '../../../core/baseController';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  GetListDTO,
  TaskIdDTO,
  GetLogsDTO,
} from '../../model/dto/task';

@Controller('/task', {
  tagName: 'Task',
  description: '定时任务控制器',
})
export class TaskController extends BaseController {
  @Inject()
  protected taskService: TaskService;

  @Validate()
  @Post('/test', { summary: '测试' })
  async test() {
    return this.success('hello world!');
  }

  @Validate()
  @Post('/add', { routerName: '添加任务' })
  async add(@Body(ALL) params: CreateTaskDTO) {
    const res = await this.taskService.addTask(
      this.ctx.state.admin.userId,
      params
    );
    return this.success(res);
  }

  @Validate()
  @Post('/update', { routerName: '更新任务' })
  async update(@Body(ALL) params: UpdateTaskDTO) {
    const res = await this.taskService.updateTask(params);
    return this.success(res);
  }

  @Validate()
  @Get('/', { routerName: '查询任务列表(分页)' })
  async list(@Query(ALL) params: GetListDTO) {
    const res = await this.taskService.getList(params);
    return this.success(res);
  }

  @Validate()
  @Get('/info', { routerName: '根据任务ID查询详情' })
  async info(@Query(ALL) params: TaskIdDTO) {
    const { taskId } = params;
    const res = await this.taskService.getTask(taskId);
    return this.success(res);
  }

  @Validate()
  @Post('/start', { routerName: '启动任务' })
  async start(@Body(ALL) params: TaskIdDTO) {
    const { taskId } = params;
    const res = await this.taskService.startTask(taskId);
    return this.success(res);
  }

  @Validate()
  @Post('/stop', { routerName: '暂停任务' })
  async stop(@Body(ALL) params: TaskIdDTO) {
    const { taskId } = params;
    const res = await this.taskService.stopTask(taskId);
    return this.success(res);
  }

  @Validate()
  @Post('/once', { routerName: '手动执行一次任务' })
  async once(@Body(ALL) params: TaskIdDTO) {
    const { taskId } = params;
    const res = await this.taskService.once(taskId);
    return this.success(res);
  }

  @Validate()
  @Post('/remove', { routerName: '删除任务' })
  async remove(@Body(ALL) params: TaskIdDTO) {
    const { taskId } = params;
    const res = await this.taskService.remove(taskId);
    return this.success(res);
  }

  @Validate()
  @Get('/select', {
    routerName: '获取任务下拉框列表(展示字段:id、任务名称)(不分页)',
  })
  async select() {
    const res = await this.taskService.select();
    return this.success(res);
  }

  @Validate()
  @Get('/logs', { routerName: '查询任务日志列表(分页)' })
  async logPage(@Query(ALL) params: GetLogsDTO) {
    const res = await this.taskService.logs(params);
    return this.success(res);
  }
}
