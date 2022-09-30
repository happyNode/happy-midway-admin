import { Provide, Inject } from '@midwayjs/decorator';

import { TaskLogMapping } from '../mapping/taskLog';
import { BaseService } from '../../core/baseService';

@Provide()
export class TaskLogService extends BaseService {
  @Inject()
  protected mapping: TaskLogMapping;
}
