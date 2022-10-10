import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseMapping } from '../../core/baseMapping';
import { UserRoleEntity } from "../entity/userRole";

@Provide()
export class UserRoleMapping extends BaseMapping<UserRoleEntity> {
  @InjectRepository(UserRoleEntity)
  repository: Repository<UserRoleEntity>;

  async creatMany(params: {
    userId: number;
    roleId: number;
  }[], options = {}) {
    await this.repository.bulkBuild(params, options);
  }
}
