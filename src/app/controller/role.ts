import { Validate } from '@midwayjs/validate';
import {
  Inject,
  Controller,
  Get,
  Post,
} from '@midwayjs/decorator';
import { BaseController } from '../../core/baseController';

@Controller('/role', { tagName: 'Role', description: '角色管理控制器' })
export class RoleController extends BaseController {
  @Inject()

  @Get('/:roleId', { summary: '角色详情' })
  @Validate()
  async index() {}

  @Get('/', { summary: '角色列表' })
  @Validate()
  async roleList() {}

  @Post('/', {
    summary: '创建角色',
    description: '',
  })
  @Validate()
  async create() {}

  @Post('/modify', {
    summary: '更新角色',
    description: '',
  })
  @Validate()
  async modify() {}

  @Post('/del', {
    summary: '删除角色',
    description: '',
  })
  @Validate()
  async del() {}
}
