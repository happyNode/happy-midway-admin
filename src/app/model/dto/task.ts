import * as parser from 'cron-parser';
import { CustomHelpers, ErrorReport } from 'joi';
import { Rule, RuleType } from '@midwayjs/validate';
import { isEmpty } from 'lodash';
import { ApiProperty } from '@midwayjs/swagger';

import { QueryParamDTO } from './base';

export const IsCronExpression = (
  value: string,
  helpers: CustomHelpers
): string | ErrorReport => {
  try {
    if (isEmpty(value)) {
      throw new Error('cron expression is empty');
    }
    parser.parseExpression(value);
    return value;
  } catch (e) {
    return helpers.error('cron expression invalid');
  }
};

export class TaskIdDTO {
  @ApiProperty({
    type: 'number',
    description: '任务id',
    required: true,
  })
  @Rule(RuleType.number().integer().greater(0).required())
  taskId: number;
}

export class CreateTaskDTO {
  @ApiProperty({ type: 'string', description: '任务名称', required: true })
  @Rule(RuleType.string().min(2).max(50).required())
  taskName: string;

  @ApiProperty({ type: 'number', description: '应用id' })
  @Rule(RuleType.number().integer().default(0).optional())
  appId: number;

  @ApiProperty({
    type: 'number',
    description: '类别:1-cron,2-interval',
    enum: [1, 2],
    required: true,
  })
  @Rule(RuleType.number().integer().valid(1, 2).required())
  type: number;

  @ApiProperty({
    type: 'number',
    description: '状态:0-暂停中,1-启动中',
    enum: [0, 1],
    required: true,
  })
  @Rule(RuleType.number().integer().valid(0, 1).required())
  status: number;

  @ApiProperty({ type: 'Date', description: '开始时间' })
  @Rule(RuleType.date().empty('').optional())
  startTime: Date;

  @ApiProperty({ type: 'Date', description: '结束时间' })
  @Rule(RuleType.date().empty('').optional())
  endTime: Date;

  @ApiProperty({
    type: 'number',
    description: '执行次数,负数为不限制',
    default: -1,
  })
  @Rule(RuleType.number().integer().optional())
  limit: number;

  @ApiProperty({ type: 'string', description: 'cron配置' })
  @Rule(
    RuleType.string().when('type', {
      is: 1,
      then: RuleType.custom(IsCronExpression, 'cron expression validate'),
      otherwise: RuleType.optional(),
    })
  )
  cron: string;

  @ApiProperty({ type: 'number', description: '执行间隔时间' })
  @Rule(
    RuleType.number().integer().when('type', {
      is: 2,
      then: RuleType.required(),
      otherwise: RuleType.optional(),
    })
  )
  every: number;

  @ApiProperty({ type: 'string', description: '参数' })
  @Rule(RuleType.string().empty('').allow(null).optional())
  args: string;

  @ApiProperty({ type: 'string', description: '异常邮件通知地址' })
  @Rule(RuleType.string().empty('').allow(null).optional())
  emailNotice: string;

  @ApiProperty({ type: 'string', description: '备注' })
  @Rule(RuleType.string().empty('').allow(null).optional())
  remark: string;
}

export class UpdateTaskDTO extends CreateTaskDTO {
  @ApiProperty({ type: 'number', description: '任务id' })
  @Rule(RuleType.number().integer().greater(0).required())
  taskId: number;
}

export class GetListDTO extends QueryParamDTO {}

export class GetLogsDTO extends QueryParamDTO {
  @ApiProperty({ type: 'number', description: '任务id' })
  @Rule(RuleType.number().integer().greater(0).optional())
  taskId?: number;
}
