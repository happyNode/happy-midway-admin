import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { TaskEntity } from '../entity/task';
import { BaseMapping } from '../../core/baseMapping';

@Provide()
export class TaskMapping extends BaseMapping<TaskEntity> {
  @InjectRepository(TaskEntity)
  repository: Repository<TaskEntity>;
}
