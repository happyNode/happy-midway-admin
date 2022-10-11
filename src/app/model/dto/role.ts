import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
export class CreateRoleDto {
  @ApiProperty({
    type: 'string',
    description: '角色名称',
  })
  @Rule(RuleType.string().min(2).required())
  name: string;

  @ApiProperty({
    type: 'string',
    description: '角色唯一标识',
  })
  @Rule(
    RuleType.string()
      .pattern(/^[a-z0-9A-Z]+$/)
      .required()
  )
  label: string;

  @ApiProperty({
    type: 'string',
    description: '角色备注',
  })
  @Rule(RuleType.string().allow('').allow(null).optional())
  remark: string;

  @ApiProperty({
    type: 'object',
    description: '菜单',
  })
  @Rule(RuleType.array().items(RuleType.number()).min(0).optional())
  menus: Array<number>;
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({
    type: 'string',
    description: '需要更新的角色ID',
  })
  @Rule(RuleType.number().integer().required())
  roleId: number;
}

export class DeleteRoleDto {
  @ApiProperty({
    type: 'object',
    description: '角色id',
  })
  @Rule(RuleType.array().items(RuleType.number()).min(1))
  roleIds: Array<number>;
}
