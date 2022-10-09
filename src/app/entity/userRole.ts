import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  modelName: 'user_role',
  timestamps: true,
})
export class UserRoleEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'user_role_id',
    comment: '主键id',
  })
  userRoleId: number;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '用户id',
  })
  userId: number;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '角色id',
  })
  roleId: number;
}
