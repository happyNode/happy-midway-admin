import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  modelName: 'role_menu',
  timestamps: true,
})
export class RoleMenuEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'role_menu_id',
    comment: '主键id',
  })
  roleMenuId: number;

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

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '菜单id',
  })
  menuId: number;
}
