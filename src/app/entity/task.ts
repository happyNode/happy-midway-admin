import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  modelName: 'task',
  timestamps: true,
})
export class TaskEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'task_id',
    comment: '定时任务id',
  })
  taskId: number;

  @Column({
    type: DataType.TINYINT({
      length: 1,
      unsigned: true,
    }),
    field: 'app_id',
    allowNull: false,
    defaultValue: 0,
    comment: '任务所属应用ID: 0-无所属',
  })
  appId: number;

  @Column({
    type: DataType.TINYINT({
      length: 1,
      unsigned: true,
    }),
    field: 'user_id',
    allowNull: false,
    comment: '用户id',
  })
  userId: number;

  @Column({
    type: DataType.STRING(64),
    field: 'task_name',
    allowNull: false,
    comment: '定时任务名称',
  })
  taskName: string;

  @Column({
    type: DataType.TINYINT({
      length: 1,
      unsigned: true,
    }),
    field: 'type',
    allowNull: false,
    defaultValue: 1,
    comment: '定时任务类别:1-cron,2-interval',
  })
  type: number;

  @Column({
    type: DataType.TINYINT({
      length: 1,
      unsigned: true,
    }),
    field: 'status',
    allowNull: false,
    defaultValue: 0,
    comment: '定时任务状态:0-暂停中,1-启动中',
  })
  status: number;

  @Column({
    type: DataType.DATE,
    field: 'start_time',
    comment: '定时任务开始时间',
  })
  startTime: Date;

  @Column({
    type: DataType.DATE,
    field: 'end_time',
    comment: '定时任务结束时间',
  })
  endTime: Date;

  @Column({
    type: DataType.INTEGER({
      length: 11,
    }),
    allowNull: false,
    field: 'limit',
    defaultValue: -1,
    comment: '定时任务执行次数',
  })
  limit: number;

  @Column({
    type: DataType.STRING(128),
    field: 'cron',
    allowNull: false,
    defaultValue: '',
    comment: '定时任务cron配置',
  })
  cron: string;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    field: 'every',
    defaultValue: 0,
    comment: '定时任务执行间隔时间',
  })
  every: number;

  @Column({
    type: DataType.STRING(128),
    field: 'args',
    allowNull: false,
    defaultValue: '',
    comment: '参数',
    set(val) {
      const args = (val as string).replace(/'/g, '"');
      this.setDataValue('args', args);
    },
  })
  args: string;

  @Column({
    type: DataType.STRING(128),
    field: 'email_notice',
    allowNull: false,
    defaultValue: '',
    comment: '异常邮件通知地址（多个地址用逗号隔开）',
  })
  emailNotice: string;

  @Column({
    type: DataType.STRING(128),
    field: 'remark',
    allowNull: false,
    defaultValue: '',
    comment: '备注',
  })
  remark: string;
}
