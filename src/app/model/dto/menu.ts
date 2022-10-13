import { Rule, RuleType } from '@midwayjs/validate';
import {ApiProperty} from "@midwayjs/swagger";

/**
 * 增加菜单
 */
export class CreateMenuDto {
  @ApiProperty({
    type: 'number',
    description: '类型',
    example: '1',
  })
  @Rule(RuleType.number().integer().min(0).max(2).required())
  type: number;

  @ApiProperty({
    type: 'number',
    description: '父级id',
    example: '1',
  })
  @Rule(RuleType.number().integer().required())
  parentId: number;

  @ApiProperty({
    type: 'string',
    description: '名称',
    example: 'xxx',
  })
  @Rule(RuleType.string().min(2).required())
  name: string;

  @ApiProperty({
    type: 'number',
    description: '排名',
    example: '1',
  })
  @Rule(RuleType.number().integer().min(0))
  rank: number;

  @ApiProperty({
    type: 'string',
    description: '路由',
    example: '1',
  })
  @Rule(
    RuleType.string().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required(),
        },
        {
          is: 0,
          then: RuleType.required(),
        },
      ],
      otherwise: RuleType.optional(),
    })
  )
  router: string;

  @ApiProperty({
    type: 'number',
    description: '是否显示 0:不显示 1:显示',
    example: '1',
  })
  @Rule(
    RuleType.number().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required(),
        },
        {
          is: 0,
          then: RuleType.required(),
        },
      ],
      otherwise: RuleType.optional(),
    })
  )
  isShow: number;

  @ApiProperty({
    type: 'number',
    description: '路由缓存',
    example: '1',
  })
  @Rule(
    RuleType.number().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required(),
        },
      ],
      otherwise: RuleType.optional(),
    })
  )
  keepalive: boolean;

  @ApiProperty({
    type: 'string',
    description: '图标',
    example: 'xxx',
  })
  @Rule(
    RuleType.string().when('type', {
      switch: [
        {
          is: 1,
          then: RuleType.required(),
        },
        {
          is: 0,
          then: RuleType.required(),
        },
      ],
      otherwise: RuleType.optional(),
    })
  )
  icon: string;

  @ApiProperty({
    type: 'string',
    description: '权限表示',
    example: 'xxx',
  })
  @Rule(
    RuleType.string().when('type', {
      is: 2,
      then: RuleType.required(),
      otherwise: RuleType.allow('').optional(),
    })
  )
  perms: string;

  @ApiProperty({
    type: 'string',
    description: ' 视图地址，对应vue文件',
    example: 'xxx',
  })
  @Rule(RuleType.string())
  viewPath: string;
}

@Rule(CreateMenuDto)
export class UpdateMenuDto extends CreateMenuDto {
  @ApiProperty({
    type: 'number',
    description: '菜单id',
    example: '1',
  })
  @Rule(RuleType.number().integer().required())
  menuId: number;
}

/**
 * 删除菜单
 */
export class DeleteMenuDto {
  @ApiProperty({
    type: 'number',
    description: '菜单id',
    example: '1',
  })
  @Rule(RuleType.number().integer().required())
  menuId: number;
}

/**
 * 查询菜单
 */
export class InfoMenuDto {
  @ApiProperty({
    type: 'number',
    description: '菜单id',
    example: '1',
  })
  @Rule(RuleType.number().integer().required())
  menuId: number;
}
