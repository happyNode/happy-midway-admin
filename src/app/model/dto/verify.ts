import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';

export class LoginImageCaptchaDto {
  @ApiProperty({
    type: 'number',
    description: '验证码宽度',
    example: '100',
  })
  @Rule(RuleType.number().integer())
  width: number;

  @ApiProperty({
    type: 'number',
    description: '验证码高度',
    example: '50',
  })
  @Rule(RuleType.number().integer())
  height: number;
}

export class LoginInfoDto {
  @ApiProperty({
    type: 'string',
    description: '管理员用户名',
    example: 'root',
  })
  @Rule(RuleType.string().required())
  username: string;

  @ApiProperty({
    type: 'string',
    description: '管理员密码',
    example: '123456',
  })
  @Rule(RuleType.string().required())
  password: string;

  @ApiProperty({
    type: 'string',
    description: '验证码标识ID',
    example: '0CRq2jthWUp7DiLCftB',
  })
  @Rule(RuleType.string().required())
  captchaId: string;

  @ApiProperty({
    type: 'string',
    description: '登录验证码',
    example: 'xfDp',
  })
  @Rule(RuleType.string().max(4).min(4).required())
  verifyCode: string;
}
