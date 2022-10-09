import { Validate } from '@midwayjs/validate';
import {
  Inject,
  Controller,
  Get,
  Post,
} from '@midwayjs/decorator';
import { BaseController } from '../../core/baseController';

@Controller('/menu', { tagName: 'Menu', description: '菜单管理控制器' })
export class MenuController extends BaseController {
  @Inject()

  @Get('/:menu', { summary: '菜单详情' })
  @Validate()
  async index() {}

  @Get('/', { summary: '菜单列表' })
  @Validate()
  async menuList() {}

  @Post('/', {
    summary: '创建菜单',
    description: '',
  })
  @Validate()
  async create() {}

  @Post('/modify', {
    summary: '更新菜单',
    description: '',
  })
  @Validate()
  async modify() {}

  @Post('/del', {
    summary: '删除菜单',
    description: '',
  })
  @Validate()
  async del() {}
}
