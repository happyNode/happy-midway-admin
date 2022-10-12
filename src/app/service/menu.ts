import {Provide, Inject, Config} from '@midwayjs/decorator';
import { isEmpty, includes, concat, uniq } from 'lodash';

import { BaseService } from '../../core/baseService';
import { MenuMapping } from './../mapping/menu';
import { MenuEntity } from "../entity/menu";
import { CreateMenuDto } from "../model/dto/menu";
import { IMenuItemAndParentInfoResult } from "../../interface";
import { RoleService } from "./role";
import {RoleMenuEntity} from "../entity/roleMenu";
import {Op} from "sequelize";


@Provide()
export class MenuService extends BaseService {
  @Inject()
  protected mapping: MenuMapping;

  @Inject()
  protected roleService: RoleService;

  @Config('rootRoleId')
  rootRoleId: number;
  /**
   * 获取所有菜单
   */
  async list(): Promise<MenuEntity[]> {
    return await this.mapping.findAll();
  }

  /**
   * 保存或新增菜单
   */
  async save(
    menu: CreateMenuDto & { id?: number }
  ): Promise<MenuEntity> {
    const result = await this.mapping.saveNew(menu);
    return result;
  }

  /**
   * 根据角色获取所有菜单
   */
  async getMenus(uid: number): Promise<MenuEntity[]> {
    const roleIds = await this.roleService.getRoleIdByUser(uid);

    let menus: MenuEntity[] = [];
    if (includes(roleIds, this.rootRoleId)) {
      // root find all
      menus = await this.mapping.findAll();
    } else {
      // [ 1, 2, 3 ] role find
      const options = {
        order: [['rank', 'DESC']],
        include: [
          {
            model: RoleMenuEntity,
            where: {
              roleId: roleIds,
            }
          }
        ]
      }
      menus = await this.mapping.findAll({}, options)
    }
    return menus;
  }

  /**
   * 查找当前菜单下的子菜单，目录以及菜单
   */
  async findChildMenus(mid: number): Promise<any> {
    const allMenus: any = [];
    const menus = await this.mapping.findAll({ parentId: mid });
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].type !== 2) {
        // 子目录下是菜单或目录，继续往下级查找
        const c = await this.findChildMenus(menus[i].id);
        allMenus.push(c);
      }
      allMenus.push(menus[i].id);
    }
    return allMenus;
  }

  /**
   * 获取某个菜单的信息
   * @param mid menu id
   */
  async getMenuItemInfo(mid: number): Promise<MenuEntity> {
    const menu = await this.mapping.findOne({ id: mid });
    return menu;
  }

  /**
   * 获取某个菜单以及关联的父菜单的信息
   */
  async getMenuItemAndParentInfo(
    mid: number
  ): Promise<IMenuItemAndParentInfoResult> {
    const menu = await this.mapping.findOne({ id: mid });
    let parentMenu: MenuEntity | undefined = undefined;
    if (menu && menu.parentId) {
      parentMenu = await this.mapping.findOne({ id: menu.parentId });
    }
    return { menu, parentMenu };
  }

  /**
   * 查找节点路由是否存在
   */
  async findRouterExist(router: string): Promise<boolean> {
    const menus = await this.mapping.findOne({ router });
    return !isEmpty(menus);
  }

  /**
   * 获取当前用户的所有权限
   */
  async getPerms(uid: number): Promise<string[]> {
    const roleIds = await this.roleService.getRoleIdByUser(uid);
    let perms: any[] = [];
    let result: any = null;
    if (includes(roleIds, this.rootRoleId)) {
      // root find all perms
      result = await this.mapping.findAll({
        perms: {
        [Op.not]: null,
        }, type: 2 });
    } else {
      const options = {
        include: [
          {
            model: RoleMenuEntity,
            where: {
              roleId: roleIds,
            }
          }
        ]
      }
      result = await this.mapping.findAll({
        perms: {
          [Op.not]: null,
        }, type: 2 }, options);
    }
    if (!isEmpty(result)) {
      result.forEach(e => {
        perms = concat(perms, e.perms.split(','));
      });
      perms = uniq(perms);
    }
    return perms;
  }

  /**
   * 删除多项菜单
   */
  async deleteMenuItem(mids: number[]): Promise<number> {
    return await this.mapping.destroy(mids);
  }

  /**
   * 刷新指定用户ID的权限
   */
  async refreshPerms(uid: number): Promise<void> {
    const perms = await this.getPerms(uid);
    const online = await this.getAdminRedis().get(`admin:token:${uid}`);
    if (online) {
      // 判断是否在线
      await this.getAdminRedis().set(
        `admin:perms:${uid}`,
        JSON.stringify(perms)
      );
    }
  }

  /**
   * 刷新所有在线用户的权限
   */
  async refreshOnlineUserPerms(): Promise<void> {
    const onlineUserIds: string[] = await this.getAdminRedis().keys(
      'admin:token:*'
    );
    if (onlineUserIds && onlineUserIds.length > 0) {
      for (let i = 0; i < onlineUserIds.length; i++) {
        const uid = onlineUserIds[i].split('admin:token:')[1];
        const perms = await this.getPerms(parseInt(uid));
        await this.getAdminRedis().set(
          `admin:perms:${uid}`,
          JSON.stringify(perms)
        );
      }
    }
  }



}
