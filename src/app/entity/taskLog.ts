import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({
  modelName: 'task_log',
  timestamps: true,
})
export class TaskLogEntity extends Model {
  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    field: 'task_log_id',
    comment: '定时任务日志id',
  })
  taskLogId: number;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    field: 'task_id',
    comment: '定时任务id',
  })
  taskId: number;

  @Column({
    type: DataType.TINYINT({
      length: 1,
      unsigned: true,
    }),
    field: 'run_mode',
    allowNull: false,
    defaultValue: 1,
    comment: '运行方式:1-自动,2-手动',
  })
  runMode: number;

  @Column({
    type: DataType.TINYINT({
      length: 1,
      unsigned: true,
    }),
    field: 'result',
    allowNull: false,
    defaultValue: 0,
    comment: '定时任务执行结果状态:0-失败,1-成功',
  })
  result: number;

  @Column({
    type: DataType.INTEGER({
      length: 11,
      unsigned: true,
    }),
    allowNull: false,
    field: 'consume_time',
    defaultValue: 0,
    comment: '定时任务执行花费时间(ms)',
  })
  consumeTime: number;

  @Column({
    type: DataType.TEXT,
    field: 'detail',
    comment: '定时任务执行结果返回',
  })
  detail: string;
}
