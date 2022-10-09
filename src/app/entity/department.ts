import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  modelName: 'sys_department',
  timestamps: true,
})
export class DepartmentEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'department_id',
    comment: '部门id',
  })
  departmentId: number;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '父级部门ID',
  })
  parentId: number;

  @Column({
    type: DataType.STRING(255),
    field: 'name',
    allowNull: false,
    defaultValue: '',
    comment: '部门名称',
  })
  name: string;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '顺序',
  })
  rank: number;
}
