import { Validate } from '@midwayjs/validate';
import {
  Inject,
  Controller,
  Get,
  Post,
  Query,
  ALL,
  Param, Body,
} from '@midwayjs/decorator';
import { BaseController } from '../../core/baseController';
import { RoleService } from "../service/role";
import { QueryParamDTO } from "../model/dto/base";
import {CreateRoleDto, UpdateRoleDto} from "../model/dto/role";
import MyError from "../comm/myError";
import { MenuService } from "../service/menu";

@Controller('/role', { tagName: 'Role', description: '角色管理控制器' })
export class RoleController extends BaseController {
  @Inject()
  roleService: RoleService

  @Inject()
  menuService: MenuService

  @Get('/:roleId', { summary: '角色详情' })
  @Validate()
  async info(@Param('roleId') roleId: number) {
    const res = await this.roleService.info(roleId);
    return this.success(res);
  }

  @Validate()
  @Get('/list', { summary: '角色列表' })
  async roleList() {
    const res = await this.roleService.list();
    return this.success(res);
  }

  @Validate()
  @Get('/page',{ summary: '分页查询角色信息' })
  async page(@Query(ALL) dto: QueryParamDTO): Promise<any> {
    const list = await this.roleService.page(dto.page - 1, dto.limit);
    const count = await this.roleService.count();
    return this.success({
      list,
      count,
    });
  }

  @Validate()
  @Post('/add', {
    summary: '创建角色',
    description: '',
  })
  async create(@Body(ALL) params: CreateRoleDto) {
    const res = await this.roleService.add(params);
    return this.success(res);
  }

  @Post('/modify', {
    summary: '更新角色',
    description: '',
  })
  @Validate()
  async modify(@Body(ALL) dto: UpdateRoleDto) {
    await this.roleService.update(dto);
    await this.menuService.refreshOnlineUserPerms();
    return this.success();
  }

  @Post('/delete', {
    summary: '删除角色',
    description: '',
  })
  @Validate()
  async del(@Body('roleIds') roleIds: number[]) {
    const count = await this.roleService.countUserIdByRole(roleIds);
    if (count > 0) {
      throw new MyError('该角色存在关联用户，请先删除关联用户')
    }
    await this.roleService.delete(roleIds);
    await this.menuService.refreshOnlineUserPerms();
  }
}
