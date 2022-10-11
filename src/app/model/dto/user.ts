import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
export class CreateUserInput {
  @ApiProperty({
    type: 'string',
    description: '姓',
  })
  @Rule(RuleType.string().min(1).max(3).required())
  firstName: string;

  @ApiProperty({ type: 'string', description: '名字' })
  @Rule(RuleType.string().min(1).max(3).required())
  lastName: string;

  @ApiProperty({ type: 'integer', example: '1', description: '班级id' })
  @Rule(RuleType.number().required())
  classroomId: number;
}

export class UpdatePersonInfoDto {
  @ApiProperty({ type: 'string', description:'管理员昵称',example: '源b' })
  @Rule(RuleType.string().allow('').allow(null))
  nickName: string;

  @ApiProperty({ type: 'string', description:'邮箱',example: 'qa894178522@qq.com' })
  @Rule(RuleType.string().email().allow('').allow(null))
  email: string;

  @ApiProperty({ type: 'string', description:'手机号码',example: '13124314551' })
  @Rule(RuleType.string().allow('').allow(null))
  phone: string;

  @ApiProperty({ type: 'string', description:'备注',example: '这是xxx管理员的备注' })
  @Rule(RuleType.string().allow('').allow(null))
  remark: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ type: 'string', description:'原密码',example: 'xxxx' })
  @Rule(RuleType.string().min(6).required())
  originPassword: string;

  @ApiProperty({ type: 'string', description:'新密码',example: 'xxxx' })
  @Rule(
    RuleType.string()
      .min(6)
      .pattern(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
      .required()
  )
  newPassword: string;
}

export class CreateUserDto {
  @ApiProperty({ type: 'string', description:'管理员名称',example: 'xxxx' })
  @Rule(RuleType.string().min(2).required())
  name: string;

  @ApiProperty({ type: 'string', description:'管理员登录账号',example: 'xxxx' })
  @Rule(
    RuleType.string()
      .min(6)
      .max(20)
      .pattern(/^[a-z0-9A-Z]+$/)
      .required()
  )
  username: string;

  @ApiProperty({ type: 'object', description:'角色' })
  @Rule(RuleType.array().items(RuleType.number()).min(1).max(3).required())
  roles: number[];

  @ApiProperty({ type: 'string', description:'备注' })
  @Rule(RuleType.string().empty('').optional())
  remark: string;

  @ApiProperty({ type: 'string', description:'邮箱' })
  @Rule(RuleType.string().empty('').email().optional())
  email: string;

  @ApiProperty({ type: 'string', description:'手机号码' })
  @Rule(RuleType.string().empty('').optional())
  phone: string;

  @ApiProperty({ type: 'number', description:'状态是否可用' })
  @Rule(RuleType.number().integer().valid(0, 1).optional())
  status: number;
}

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty({ type: 'number', description:'需要更新的管理员ID' })
  @Rule(RuleType.number().integer().required())
  userId: number;
}

export class PasswordUserDto {
  @ApiProperty({ type: 'number', description:'需要更改密码的管理员ID' })
  @Rule(RuleType.number().integer().required())
  userId: number;

  @ApiProperty({ type: 'string', description:'更改的新密码' })
  @Rule(
    RuleType.string()
      .min(6)
      .pattern(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
      .required()
  )
  password: string;
}
