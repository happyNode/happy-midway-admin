import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseMapping } from '../../core/baseMapping';
import { RoleEntity } from "../entity/role";

@Provide()
export class MenuMapping extends BaseMapping<RoleEntity> {
  @InjectRepository(RoleEntity)
  repository: Repository<RoleEntity>;
}
