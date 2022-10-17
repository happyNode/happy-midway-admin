import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseMapping } from '../../core/baseMapping';
import { RoleMenuEntity } from "../entity/roleMenu";

@Provide()
export class RoleMenuMapping extends BaseMapping<RoleMenuEntity> {
  @InjectRepository(RoleMenuEntity)
  repository: Repository<RoleMenuEntity>;

  async creatMany(params: {
    roleId: number;
    menuId: number;
  }[], options = {}) {
    await this.repository.bulkCreate(params, options);
  }
}
