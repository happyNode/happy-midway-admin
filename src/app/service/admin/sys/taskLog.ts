import { Provide } from '@midwayjs/decorator';
import { Repository } from 'sequelize-typescript';

import { TaskLogEntity } from '../../../entity/taskLog';
import { BaseService } from '../../../../core/baseService';

@Provide()
export class TaskLogService extends BaseService<TaskLogEntity> {
  getModel(): Repository<TaskLogEntity> {
    return TaskLogEntity;
  }
}
