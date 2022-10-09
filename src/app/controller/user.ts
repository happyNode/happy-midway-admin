import { Validate } from '@midwayjs/validate';
import {
  Inject,
  Controller,
  Get,
  Post,
} from '@midwayjs/decorator';
import { UserService } from '../service/user';
import { BaseController } from '../../core/baseController';

@Controller('/user', { tagName: 'User', description: '用户管理控制器' })
export class UserController extends BaseController {
  @Inject()
  protected service: UserService;
  @Get('/:uid', { summary: '用户详情' })
  @Validate()
  async index() {}

  @Get('/', { summary: '分页获取用户列表' })
  @Validate()
  async userList() {}

  @Post('/', {
    summary: '创建用户',
    description: '',
  })
  @Validate()
  async create() {}

  @Post('/modify', {
    summary: '更新用户',
    description: '',
  })
  @Validate()
  async modify() {}

  @Post('/ban', {
    summary: '封禁用户',
    description: '',
  })
  @Validate()
  async ban() {}
}
