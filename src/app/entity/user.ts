import { Column, DataType, Table, Model, HasMany } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import {UserRoleEntity} from "./userRole";

@Table({
  modelName: 'user',
  timestamps: true,
})
export class UserEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'user_id',
    comment: '用户id',
  })
  userId: number;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    defaultValue: '',
    comment: '登录账号',
  })
  username: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: '',
    comment: '登录账号',
    set(val) {
      const salt = bcrypt.genSaltSync(10);
      const pwd = bcrypt.hashSync(val, salt);
      this.setDataValue('password', pwd);
    },
  })
  password: string;

  @Column({
    type: DataType.STRING(64),
    field: 'name',
    allowNull: false,
    defaultValue: '',
    comment: '用户名称',
  })
  name: string;


  @Column({
    type: DataType.TINYINT({
      length: 4,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 1,
    comment: '状态: 0: 禁用 1: 启用',
  })
  status: number;

  @Column({
    type: DataType.STRING(255),
    field: 'head_img',
    allowNull: false,
    defaultValue: '',
    comment: '头像',
  })
  headImg: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    defaultValue: '',
    comment: '邮件',
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: '',
    comment: '手机号',
  })
  phone: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: '',
    comment: '备注',
  })
  remark: string;

  @HasMany(() => UserRoleEntity, {
    sourceKey: 'userId',
    foreignKey: 'userId',
  })
  userRoles: UserRoleEntity[];
}
