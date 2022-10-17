import { Validate } from '@midwayjs/validate';
import { isEmpty, flattenDeep } from 'lodash';

import {
  Inject,
  Controller,
  Get,
  Post,
  Body,
  ALL,
  Param,
} from '@midwayjs/decorator';
import { BaseController } from '../../../core/baseController';
import { MenuService } from '../../service/admin/sys/menu';
import {
  CreateMenuDto,
  DeleteMenuDto,
  UpdateMenuDto,
} from '../../model/dto/menu';
import MyError from '../../comm/myError';

@Controller('/menu', { tagName: 'Menu', description: '菜单管理控制器' })
export class MenuController extends BaseController {
  @Inject()
  menuService: MenuService;

  @Get('/info/:menuId', { summary: '菜单详情' })
  @Validate()
  async info(@Param('menuId') menuId: number) {
    const menuInfo = await this.menuService.getMenuItemAndParentInfo(menuId);
    return this.success(menuInfo);
  }

  @Get('/list', { summary: '获取对应权限的菜单列表' })
  @Validate()
  async menuList() {
    const res = await this.menuService.getMenus(this.ctx.state.admin.userId);
    return this.success(res);
  }

  @Post('/add', {
    summary: '创建菜单',
    description: '',
  })
  @Validate()
  async create(@Body(ALL) dto: CreateMenuDto) {
    if (dto.type === 2 && dto.parentId === 0) {
      // 无法直接创建权限，必须有ParentId
      throw new MyError('权限必须包含父节点');
    }
    if (dto.type === 1 && dto.parentId !== 0) {
      const parent = await this.menuService.getMenuItemInfo(dto.parentId);
      if (isEmpty(parent)) {
        throw new MyError('父级菜单不存在');
      }
      if (parent && parent.type === 1) {
        // 当前新增为菜单但父节点也为菜单时为非法操作
        throw new MyError('非法操作：该节点仅支持目录类型父节点');
      }
    }
    await this.menuService.save(dto);
    if (dto.type === 2) {
      // 如果是权限发生更改，则刷新所有在线用户的权限
      await this.menuService.refreshOnlineUserPerms();
    }
  }

  @Post('/update', {
    summary: '更新菜单或权限',
    description: '',
  })
  @Validate()
  async modify(@Body(ALL) dto: UpdateMenuDto) {
    if (dto.type === 2 && dto.parentId === 0) {
      // 无法直接创建权限，必须有ParentId
      throw new MyError('权限必须包含父节点');
    }
    if (dto.type === 1 && dto.parentId !== 0) {
      const parent = await this.menuService.getMenuItemInfo(dto.parentId);
      if (isEmpty(parent)) {
        throw new MyError('父级菜单不存在');
      }
      if (parent && parent.type === 1) {
        // 当前新增为菜单但父节点也为菜单时为非法操作
        throw new MyError('非法操作：该节点仅支持目录类型父节点');
      }
    }
    await this.menuService.modify(dto, dto.menuId);
    if (dto.type === 2) {
      // 如果是权限发生更改，则刷新所有在线用户的权限
      await this.menuService.refreshOnlineUserPerms();
    }
    return this.success();
  }

  @Post('/delete', {
    summary: '删除菜单',
    description: '',
  })
  @Validate()
  async del(@Body(ALL) dto: DeleteMenuDto) {
    // 68为内置init.sql中插入最后的索引编号
    // if (dto.menuId <= 68) {
    //   // 系统内置功能不提供删除
    //   throw new MyError('系统内置功能，不可删除');
    // }
    // 如果有子目录，一并删除
    const childMenus = await this.menuService.findChildMenus(dto.menuId);
    await this.menuService.deleteMenuItem(
      flattenDeep([dto.menuId, childMenus])
    );
    // 刷新在线用户权限
    await this.menuService.refreshOnlineUserPerms();
    return this.success();
  }
}
