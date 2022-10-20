import { Provide, Inject, Config } from '@midwayjs/decorator';
import { Op } from 'sequelize';
import { isEmpty, map, includes, difference, filter } from 'lodash';

import { BaseService } from '../../../../core/baseService';
import { RoleMapping } from '../../../mapping/role';

import { RoleEntity } from '../../../entity/role';
import { IRoleInfoResult } from '../../../../interface';
import { RoleMenuMapping } from '../../../mapping/roleMenu';
import { CreateRoleDto, UpdateRoleDto } from '../../../model/dto/role';
import { UserRoleMapping } from '../../../mapping/userRole';

@Provide()
export class RoleService extends BaseService {
  @Inject()
  protected mapping: RoleMapping;

  @Inject()
  protected roleMenuMapping: RoleMenuMapping;

  @Inject()
  protected userRoleMapping: UserRoleMapping;

  @Config('rootRoleId')
  rootRoleId: number;

  /**
   * 列举所有角色：除去超级管理员
   */
  async list(): Promise<RoleEntity[]> {
    const result = await this.mapping.findAll({
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
    const count = await this.mapping.count({
      id: {
        [Op.notIn]: this.rootRoleId,
      },
    });
    return count;
  }

  /**
   * 根据角色获取角色信息
   */
  async info(rid: number): Promise<IRoleInfoResult> {
    const roleInfo = await this.mapping.findOne({ roleId: rid });
    const menus = await this.roleMenuMapping.findAll({ roleId: rid });
    return { roleInfo, menus };
  }

  /**
   * 根据角色Id数组删除
   */
  async delete(roleIds: number[]): Promise<void> {
    if (includes(roleIds, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }
    const t = await this.mapping.getTransaction();
    try {
      const options = {
        transaction: t,
      };
      await this.mapping.destroy(
        {
          roleId: roleIds,
        },
        options
      );
      await this.roleMenuMapping.destroy(
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
    const role = await this.mapping.saveNew({
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
      await this.roleMenuMapping.creatMany(insertRows);
    }
    return roleId;
  }

  /**
   * 更新角色信息
   */
  async update(param: UpdateRoleDto): Promise<RoleEntity> {
    const { roleId, name, label, remark, menus } = param;
    await this.mapping.modify({ name, label, remark }, {
      roleId,
    });
    const originMenuRows = await this.roleMenuMapping.findAll({ roleId });
    const originMenuIds = originMenuRows.map(e => {
      return e.menuId;
    });
    // 开始对比差异
    const insertMenusRowIds = difference(menus, originMenuIds);
    const deleteMenusRowIds = difference(originMenuIds, menus);
    // using transaction
    const t = await this.mapping.getTransaction();
    try {
      if (insertMenusRowIds.length > 0) {
        // 有条目更新
        const insertRows = insertMenusRowIds.map(e => {
          return {
            roleId,
            menuId: e,
          };
        });
        await this.roleMenuMapping.creatMany(insertRows, {
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
        await this.roleMenuMapping.destroy(
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
    return ;
  }

  /**
   * 分页加载角色信息
   */
  async page(
    page: number,
    count: number
  ): Promise<{ rows: RoleEntity[]; count: number }> {
    const result = await this.mapping.findAndCountAll(
      page,
      count,
      {
        roleId: {
          [Op.notIn]: this.rootRoleId,
        },
      },
      {}
    );
    return result;
  }

  /**
   * 根据用户id查找角色信息
   */
  async getRoleIdByUser(id: number): Promise<number[]> {
    const result = await this.userRoleMapping.findAll({
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
  async countUserIdByRole(ids: number[]): Promise<number | never> {
    if (includes(ids, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }
    return await this.userRoleMapping.count({ roleId: ids });
  }
}
