import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseMapping } from '../../core/baseMapping';
import { UserEntity } from "../entity/user";

@Provide()
export class UserMapping extends BaseMapping<UserEntity> {
  @InjectRepository(UserEntity)
  repository: Repository<UserEntity>;
}
