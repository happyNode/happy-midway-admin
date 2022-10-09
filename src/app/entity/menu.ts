import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  modelName: 'menu',
  timestamps: true,
})
export class MenuEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'menu_id',
    comment: '菜单id',
  })
  menuId: number;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '父菜单ID',
  })
  parentId: number;

  @Column({
    type: DataType.STRING(255),
    field: 'name',
    allowNull: false,
    defaultValue: '',
    comment: '菜单名称',
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    field: 'router',
    allowNull: false,
    defaultValue: '',
    comment: '菜单地址',
  })
  router: string;

  @Column({
    type: DataType.STRING(255),
    field: 'perms',
    allowNull: false,
    defaultValue: '',
    comment: '权限表示',
  })
  perms: string;

  @Column({
    type: DataType.TINYINT({
      length: 3,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: '',
    comment: '0: 目录 1: 菜单 2：按钮',
  })
  type: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: '',
    comment: '图标',
  })
  icon: string;

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

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: '',
    comment: '视图地址，对应vue文件',
  })
  viewPath: string;

  @Column({
    type: DataType.TINYINT({
      length: 2,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '路由缓存',
  })
  keepalive: number;

  @Column({
    type: DataType.TINYINT({
      length: 2,
      unsigned: true,
    }),
    allowNull: false,
    defaultValue: 0,
    comment: '是否在菜单栏 0: 不显示 1：显示',
  })
  isShow: number;
}
