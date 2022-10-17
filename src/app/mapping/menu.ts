import { Provide } from '@midwayjs/decorator';
import { InjectRepository } from '@midwayjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseMapping } from '../../core/baseMapping';
import { MenuEntity } from "../entity/menu";

@Provide()
export class MenuMapping extends BaseMapping<MenuEntity> {
  @InjectRepository(MenuEntity)
  repository: Repository<MenuEntity>;
}
