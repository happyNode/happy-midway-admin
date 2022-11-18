import { Provide } from '@midwayjs/core';

import { RoleMenuEntity } from '../../../entity/roleMenu';
import { BaseService } from '../../../../core/baseService';

@Provide()
export class RoleMenuService extends BaseService<RoleMenuEntity> {
  getModel() {
    return RoleMenuEntity;
  }
}
