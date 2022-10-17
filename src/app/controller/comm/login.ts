import {
  Inject,
  Controller,
  Post,
  Body,
  Get,
  ALL,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import * as _ from 'lodash';

import { BaseController } from '../../../core/baseController';
import { adminVerifyService } from '../../service/admin/comm/verify';
import { LoginImageCaptchaDto, LoginInfoDto } from '../../model/dto/verify';
import MyError from '../../comm/myError';

@Controller('/public', {
  tagName: 'Admin',
  description: '后台登录控制器',
})
export class AdminController extends BaseController {
  @Inject()
  protected service: adminVerifyService;

  @Get('/captcha/img', {
    summary: '获取图片验证码',
  })
  @Validate()
  async captchaByImg(@Query(ALL) captcha: LoginImageCaptchaDto) {
    const result = await this.service.getImgCaptcha(captcha);
    return this.success(result);
  }

  @Validate()
  @Post('/login', { summary: '管理员登录' })
  async login(
    @Body()
    param: LoginInfoDto
  ) {
    const { captchaId, verifyCode, username, password } = param;

    const isSuccess = await this.service.checkImgCaptcha(captchaId, verifyCode);
    if (!isSuccess) {
      throw new MyError('验证码错误');
    }
    const sign = await this.service.getLoginSign(username, password);

    return this.success({ token: sign });
  }
}
