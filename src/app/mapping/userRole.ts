import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseMapping } from '../../core/baseMapping';
import { UserRoleEntity } from "../entity/userRole";

@Provide()
export class RoleMenuMapping extends BaseMapping<UserRoleEntity> {
  @InjectRepository(UserRoleEntity)
  repository: Repository<UserRoleEntity>;
}
