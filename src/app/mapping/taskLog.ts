import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { TaskLogEntity } from '../entity/taskLog';
import { BaseMapping } from '../../core/baseMapping';

@Provide()
export class TaskLogMapping extends BaseMapping<TaskLogEntity> {
  @InjectRepository(TaskLogEntity)
  repository: Repository<TaskLogEntity>;
}
