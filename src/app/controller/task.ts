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

import { TaskService } from '../../app/service/task';
import { BaseController } from '../../core/baseController';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  GetListDTO,
  TaskIdDTO,
} from './../model/dto/task';

@Controller('/task', {
  tagName: 'Task',
  description: '定时任务控制器',
})
export class TaskController extends BaseController {
  @Inject()
  protected taskService: TaskService;

  @Validate()
  @Get('/test', { summary: '测试' })
  async test() {
    const res = await this.taskService.execute();
    return this.success(res);
  }

  @Validate()
  @Post('/add', { routerName: '添加任务' })
  async add(@Body(ALL) params: CreateTaskDTO) {
    const res = await this.taskService.addTask(params);
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
  async remove(@Body(ALL) params) {
    return this.success();
  }

  @Validate()
  @Post('/select', {
    routerName: '获取任务下拉框列表(展示字段:id、任务名称)(不分页)',
  })
  async select(@Body(ALL) params) {
    return this.success();
  }

  @Validate()
  @Get('/log/page', { routerName: '查询任务日志列表(分页)' })
  async logPage(@Query(ALL) params) {
    return this.success();
  }
}
