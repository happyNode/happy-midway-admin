import { Provide } from '@midwayjs/core';

import { UserRoleEntity } from '../../../entity/userRole';
import { BaseService } from '../../../../core/baseService';

@Provide()
export class UserRoleService extends BaseService<UserRoleEntity> {
  getModel() {
    return UserRoleEntity;
  }
}
