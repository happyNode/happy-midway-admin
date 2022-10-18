import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';

import { ReqLogEntity } from '../entity/reqLog';
import { BaseMapping } from '../../core/baseMapping';

@Provide()
export class ReqLogMapping extends BaseMapping<ReqLogEntity> {
  @InjectRepository(ReqLogEntity)
  repository: Repository<ReqLogEntity>;
}
