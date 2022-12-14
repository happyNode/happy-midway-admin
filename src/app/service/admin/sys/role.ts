import { Provide, Inject, Config } from '@midwayjs/decorator';
import { Op } from 'sequelize';
import { isEmpty, map, includes, difference, filter } from 'lodash';

import { BaseService } from '../../../../core/baseService';
import { RoleEntity } from '../../../entity/role';
import { IRoleInfoResult } from '../../../../interface';
import { RoleMenuService } from './roleMenu';
import { UserRoleService } from './userRole';
import { CreateRoleDto, UpdateRoleDto } from '../../../model/dto/role';
import { Repository } from 'sequelize-typescript';

@Provide()
export class RoleService extends BaseService<RoleEntity> {
  @Inject()
  private roleMenuService: RoleMenuService;

  @Inject()
  private userRoleService: UserRoleService;

  @Config('rootRoleId')
  rootRoleId: number;

  getModel(): Repository<RoleEntity> {
    return RoleEntity;
  }

  /**
   * 列举所有角色：除去超级管理员
   */
  async list(): Promise<RoleEntity[]> {
    const result = await this.findAll({
      roleId: {
        [Op.notIn]: this.rootRoleId,
      },
    });
    return result;
  }

  /**
   * 列举所有角色条数：除去超级管理员
   */
  async count(): Promise<number> {
    const count = await this.getModel().count({
      where: {
        id: {
          [Op.notIn]: this.rootRoleId,
        },
      },
    });
    return count;
  }

  /**
   * 根据角色获取角色信息
   */
  async info(rid: number): Promise<IRoleInfoResult> {
    const roleInfo = await this.findOne({ roleId: rid });
    const menus = await this.roleMenuService.findAll({ roleId: rid });
    return { roleInfo, menus };
  }

  /**
   * 根据角色Id数组删除
   */
  async delete(roleIds: number[]): Promise<void> {
    if (includes(roleIds, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }
    const t = await this.getTransaction();
    try {
      const options = {
        transaction: t,
      };
      await this.destroy(
        {
          roleId: roleIds,
        },
        options
      );
      await this.roleMenuService.destroy(
        {
          roleId: roleIds,
        },
        options
      );
      await t.commit();
    } catch (e) {
      await t.rollback();
    }
  }

  /**
   * 增加角色
   */
  async add(param: CreateRoleDto): Promise<number> {
    const { name, label, remark, menus } = param;
    const role = await this.save({
      name,
      label,
      remark,
    });
    const roleId = role.roleId;
    if (menus && menus.length > 0) {
      // 关联菜单
      const insertRows = menus.map(m => {
        return {
          roleId,
          menuId: m,
        };
      });
      await this.roleMenuService.createMany(insertRows);
    }
    return roleId;
  }

  /**
   * 更新角色信息
   */
  async update(param: UpdateRoleDto): Promise<RoleEntity> {
    const { roleId, name, label, remark, menus } = param;
    await this.modify(
      { name, label, remark },
      {
        roleId,
      }
    );
    const originMenuRows = await this.roleMenuService.findAll({ roleId });
    const originMenuIds = originMenuRows.map(e => {
      return e.menuId;
    });
    // 开始对比差异
    const insertMenusRowIds = difference(menus, originMenuIds);
    const deleteMenusRowIds = difference(originMenuIds, menus);
    // using transaction
    const t = await this.getTransaction();
    try {
      if (insertMenusRowIds.length > 0) {
        // 有条目更新
        const insertRows = insertMenusRowIds.map(e => {
          return {
            roleId,
            menuId: e,
          };
        });
        await this.roleMenuService.createMany(insertRows, {
          transaction: t,
        });
      }

      if (deleteMenusRowIds.length > 0) {
        // 有条目需要删除
        const realDeleteRowIds = filter(originMenuRows, e => {
          return includes(deleteMenusRowIds, e.menuId);
        }).map(e => {
          return e.id;
        });
        await this.roleMenuService.destroy(
          {
            id: realDeleteRowIds,
          },
          {
            transaction: t,
          }
        );
      }
      await t.commit();
    } catch (e) {
      await t.rollback();
    }
    return;
  }

  /**
   * 分页加载角色信息
   */
  async page(
    page: number,
    count: number
  ): Promise<{ rows: RoleEntity[]; count: number }> {
    const result = await this.findAndCountAll(page, count, {
      roleId: {
        [Op.notIn]: this.rootRoleId,
      },
    });
    return result;
  }

  /**
   * 根据用户id查找角色信息
   */
  async getRoleIdByUser(id: number): Promise<number[]> {
    const result = await this.userRoleService.findAll({
      userId: id,
    });
    if (!isEmpty(result)) {
      return map(result, v => {
        return v.roleId;
      });
    }
    return [];
  }

  /**
   * 根据角色ID列表查找关联用户ID
   */
  async countUserIdByRole(ids: number[]): Promise<number> {
    if (includes(ids, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }
    const res = await this.userRoleService.count({ roleId: ids });
    return res;
  }
}
