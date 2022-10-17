import { Provide, Inject, Config } from '@midwayjs/decorator';
import { isEmpty } from 'lodash';
import { Op } from 'sequelize';

import { UserMapping } from '../../../mapping/user';
import { BaseService } from '../../../../core/baseService';
import { IAccountInfo, IPageSearchUserResult } from '../../../../interface';
import { UserEntity } from '../../../entity/user';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdatePersonInfoDto,
  UpdateUserDto,
} from '../../../model/dto/user';
import { Crypto } from '../../../comm/crypto';
import { UserRoleMapping } from '../../../mapping/userRole';
import { UserRoleEntity } from '../../../entity/userRole';
import { RoleEntity } from '../../../entity/role';

@Provide()
export class UserService extends BaseService {
  @Inject()
  protected mapping: UserMapping;

  @Inject()
  protected userRoleMapping: UserRoleMapping;

  @Inject()
  protected crypto: Crypto;

  @Config('rootRoleId')
  rootRoleId: number;

  /**
   * 查询用户个人信息
   */
  async getAccountInfo(uid: number): Promise<IAccountInfo | null> {
    const user: UserEntity | undefined = await this.mapping.findOne({
      userId: uid,
    });
    if (!isEmpty(user)) {
      return {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        remark: user.remark,
        headImg: user.headImg,
      };
    }
    return null;
  }

  /**
   * 更新个人信息
   */
  async updatePersonInfo(
    uid: number,
    param: UpdatePersonInfoDto
  ): Promise<void> {
    await this.mapping.modify(param, { userId: uid });
  }

  /**
   * 更改管理员密码
   */
  async updatePassword(uid: number, dto: UpdatePasswordDto): Promise<boolean> {
    const user = await this.mapping.findOne({ userId: uid });
    if (isEmpty(user)) {
      throw new Error('update password user is not exist');
    }

    const correct = this.crypto.compareSync(dto.originPassword, user.password);

    // 原密码不一致，不允许更改
    if (!correct) {
      return false;
    }
    await this.mapping.modify({ password: dto.newPassword }, { userId: uid });
    await this.upgradePasswordV(user.userId);
    return true;
  }

  /**
   * 直接更改管理员密码
   */
  async forceUpdatePassword(uid: number, password: string): Promise<void> {
    const user = await this.mapping.findOne({ userId: uid });
    if (isEmpty(user)) {
      throw new Error('update password user is not exist');
    }
    await this.mapping.modify({ password }, { userId: uid });
    await this.upgradePasswordV(user.userId);
  }

  /**
   * 增加系统用户，如果返回false则表示已存在该用户
   * @param param Object 对应SysUser实体类
   */
  async add(param: CreateUserDto): Promise<boolean> {
    const exists = await this.mapping.findOne({ username: param.username });
    if (!isEmpty(exists)) {
      return false;
    }

    // 所有用户初始密码为123456
    const t = await this.mapping.getTransaction();
    try {
      const user = await this.mapping.saveNew(
        {
          username: param.username,
          password: '123456',
          name: param.name,
          email: param.email,
          phone: param.phone,
          remark: param.remark,
          status: param.status,
        },
        {
          transaction: t,
        }
      );
      const { roles } = param;
      const insertRoles = roles.map(e => {
        return {
          roleId: e,
          userId: user.userId,
        };
      });
      await this.userRoleMapping.creatMany(insertRoles, {
        transaction: t,
      });
      await t.commit();
    } catch (e) {
      console.log(e);
      await t.rollback();
    }
    return true;
  }

  /**
   * 更新用户信息
   */
  async update(param: UpdateUserDto): Promise<void> {
    const t = await this.mapping.getTransaction();
    try {
      await this.mapping.modify(
        {
          username: param.username,
          password: '123456',
          name: param.name,
          email: param.email,
          phone: param.phone,
          remark: param.remark,
          status: param.status,
        },
        {
          userId: param.userId,
        },
        {
          transaction: t,
        }
      );
      await this.userRoleMapping.destroy(
        {
          userId: param.userId,
        },
        {
          transaction: t,
        }
      );
      const { roles } = param;
      const insertRoles = roles.map(e => {
        return {
          roleId: e,
          userId: param.userId,
        };
      });
      await this.userRoleMapping.creatMany(insertRoles, {
        transaction: t,
      });
      await t.commit();
      if (param.status === 0) {
        // 禁用状态
        await this.forbidden(param.userId);
      }
    } catch (e) {
      await t.rollback();
    }
  }

  /**
   * 查找用户信息
   * @param id 用户id
   */
  async info(id: number): Promise<(UserEntity & { roles: number[] }) | never> {
    const user: any = await this.mapping.findOne(id);
    if (isEmpty(user)) {
      throw new Error('unfind this user info');
    }
    const roleRows = await this.userRoleMapping.findAll({
      userId: user!.userId,
    });
    const roles = roleRows.map(e => {
      return e.roleId;
    });
    delete user!.password;
    return { ...user, roles };
  }

  /**
   * 查找列表里的信息
   */
  async infoList(ids: number[]): Promise<UserEntity[]> {
    const users = await this.mapping.findAll({
      userId: ids,
    });
    return users;
  }

  /**
   * 根据ID列表删除用户
   */
  async delete(userIds: number[]): Promise<void | never> {
    const rootUserId = await this.findRootUserId();
    if (userIds.includes(rootUserId)) {
      throw new Error('can not delete root user!');
    }
    await this.mapping.destroy(userIds);
    await this.userRoleMapping.destroy({ userId: userIds });
  }

  /**
   * 根据部门ID列举用户条数：除去超级管理员
   */
  async count(uid: number): Promise<number> {
    const rootUserId = await this.findRootUserId();
    return await this.mapping.count({
      userId: {
        [Op.notIn]: [rootUserId, uid],
      },
    });
  }

  /**
   * 查找超管的用户ID
   */
  async findRootUserId(): Promise<number> {
    const result = await this.userRoleMapping.findOne({
      userId: this.rootRoleId,
    });
    if (!result) {
      return 0;
    }
    return result.userId;
  }

  /**
   * 根据部门ID进行分页查询用户列表
   * deptId = -1 时查询全部
   */
  async page(
    uid: number,
    page: number,
    limit: number
  ): Promise<{ list: IPageSearchUserResult[]; count: number }> {
    const rootUserId = await this.findRootUserId();

    const { rows: result, count } = await this.mapping.findAndCountAll(
      page,
      limit,
      {
        userId: {
          [Op.notIn]: [rootUserId, uid],
        },
      },
      {
        include: [
          {
            model: UserRoleEntity,
            include: [
              {
                model: RoleEntity,
              },
            ],
          },
        ],
      }
    );
    const dealResult: IPageSearchUserResult[] = [];
    // 过滤去重
    result.forEach(e => {
      const roleData = {
        createdAt: e.createdAt,
        email: e.email,
        headImg: e.headImg,
        userId: e.userId,
        name: e.name,
        phone: e.phone,
        remark: e.remark,
        status: e.status,
        updatedAt: e.updatedAt,
        username: e.username,
        roleNames: [],
      };
      const roleNames = e.userRoles.map(e2 => {
        return e2.role.name;
      });
      roleData.roleNames = roleNames;
      dealResult.push(roleData);
    });
    return { list: dealResult, count };
  }

  /**
   * 禁用用户
   */
  async forbidden(uid: number): Promise<void> {
    await this.getAdminRedis().del(`admin:passwordVersion:${uid}`);
    await this.getAdminRedis().del(`admin:token:${uid}`);
    await this.getAdminRedis().del(`admin:perms:${uid}`);
  }

  /**
   * 禁用多个用户
   */
  async multiForbidden(uids: number[]): Promise<void> {
    if (uids) {
      const pvs: string[] = [];
      const ts: string[] = [];
      const ps: string[] = [];
      uids.forEach(e => {
        pvs.push(`admin:passwordVersion:${e}`);
        ts.push(`admin:token:${e}`);
        ps.push(`admin:perms:${e}`);
      });
      await this.getAdminRedis().del(pvs);
      await this.getAdminRedis().del(ts);
      await this.getAdminRedis().del(ps);
    }
  }

  /**
   * 升级用户版本密码
   */
  async upgradePasswordV(id: number): Promise<void> {
    // admin:passwordVersion:${param.id}
    const v = await this.getAdminRedis().get(`admin:passwordVersion:${id}`);
    if (!isEmpty(v)) {
      await this.getAdminRedis().set(
        `admin:passwordVersion:${id}`,
        parseInt(v!) + 1
      );
    }
  }
}
