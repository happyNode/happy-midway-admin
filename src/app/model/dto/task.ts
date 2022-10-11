import * as parser from 'cron-parser';
import { CustomHelpers, ErrorReport } from 'joi';
import { Rule, RuleType } from '@midwayjs/validate';
import { isEmpty } from 'lodash';

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
  @Rule(RuleType.number().integer().greater(0).required())
  taskId: number;
}

export class CreateTaskDTO {
  @Rule(RuleType.string().min(2).max(50).required())
  taskName: string;

  @Rule(RuleType.number().integer().default(0).optional())
  appId: number;

  @Rule(RuleType.number().integer().valid(1, 2).required())
  type: number;

  @Rule(RuleType.number().integer().valid(0, 1).required())
  status: number;

  @Rule(RuleType.date().empty('').optional())
  startTime: Date;

  @Rule(RuleType.date().empty('').optional())
  endTime: Date;

  @Rule(RuleType.number().integer().optional())
  limit: number;

  @Rule(
    RuleType.string().when('type', {
      is: 1,
      then: RuleType.custom(IsCronExpression, 'cron expression validate'),
      otherwise: RuleType.optional(),
    })
  )
  cron: string;

  @Rule(
    RuleType.number().integer().when('type', {
      is: 2,
      then: RuleType.required(),
      otherwise: RuleType.optional(),
    })
  )
  every: number;

  @Rule(RuleType.string().empty('').allow(null).optional())
  args: string;

  @Rule(RuleType.string().empty('').allow(null).optional())
  emailNotice: string;

  @Rule(RuleType.string().empty('').allow(null).optional())
  remark: string;
}

export class UpdateTaskDTO extends CreateTaskDTO {
  @Rule(RuleType.number().integer().greater(0).required())
  taskId: number;
}

export class GetListDTO extends QueryParamDTO {}

export class GetLogsDTO extends QueryParamDTO {
  @Rule(RuleType.number().integer().greater(0).optional())
  taskId?: number;
}
