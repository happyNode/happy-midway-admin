import { Provide, Inject } from '@midwayjs/decorator';
import * as utils from 'happy-node-utils';

import { BaseService } from '../../../../core/baseService';
import { ReqLogMapping } from '../../../mapping/reqLog';

@Provide()
export class ReqLogService extends BaseService {
  @Inject()
  protected mapping: ReqLogMapping;

  async save(
    url: string,
    params: string,
    status: number,
    consumeTime: number,
    method: string | undefined,
    adminId: number | null
  ): Promise<void> {
    const ip = utils.getReqIP(this.ctx);
    await this.mapping.saveNew({
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
