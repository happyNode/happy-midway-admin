import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  modelName: 'role',
  timestamps: true,
})
export class RoleEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'role_id',
    comment: '角色id',
  })
  roleId: number;

  @Column({
    type: DataType.STRING(255),
    field: 'name',
    allowNull: false,
    defaultValue: '',
    comment: '角色名称',
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
    field: 'label',
    allowNull: false,
    defaultValue: '',
    comment: '标签',
  })
  label: string;

  @Column({
    type: DataType.STRING(255),
    field: 'remark',
    allowNull: false,
    defaultValue: '',
    comment: '备注',
  })
  remark: string;
}
