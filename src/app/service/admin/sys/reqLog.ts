import { Provide } from '@midwayjs/decorator';
import * as utils from 'happy-node-utils';
import { Repository } from 'sequelize-typescript';

import { BaseService } from '../../../../core/baseService';
import { ReqLogEntity } from '../../../entity/reqLog';

@Provide()
export class ReqLogService extends BaseService<ReqLogEntity> {
  getModel(): Repository<ReqLogEntity> {
    return ReqLogEntity;
  }

  async saveNew(
    url: string,
    params: string,
    status: number,
    consumeTime: number,
    method: string | undefined,
    adminId: number | null
  ): Promise<void> {
    const ip = utils.getReqIP(this.ctx);
    await this.save({
      action: url,
      param: JSON.stringify(params),
      adminId: adminId || 1,
      ip,
      method: method ? method.toUpperCase() : undefined,
      status,
      consumeTime,
    });
  }
}
