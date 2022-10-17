import {
  ALL,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
} from '@midwayjs/decorator';

import { BaseController } from '../../../core/baseController';
import { UserService } from '../../service/admin/sys/user';
import MyError from '../../comm/myError';
import { AdminVerifyService } from '../../service/admin/comm/verify';
import { UpdatePasswordDto, UpdatePersonInfoDto } from '../../model/dto/user';

@Provide()
@Controller('/common/account', {
  tagName: 'AdminAccount',
  description: '后台账号信息控制器',
})
export class AdminAccountController extends BaseController {
  @Inject()
  userService: UserService;

  @Inject()
  adminVerifyService: AdminVerifyService;

  @Get('/info', {
    summary: '获取管理员资料',
  })
  async info() {
    const res = await this.userService.getAccountInfo(
      this.ctx.state.admin.userId
    );
    return this.success(res);
  }

  @Post('/update', {
    summary: '更改管理员资料',
  })
  async update(@Body(ALL) personInfo: UpdatePersonInfoDto) {
    await this.userService.updatePersonInfo(
      this.ctx.state.admin.userId,
      personInfo
    );
    return this.success();
  }

  @Post('/password', {
    summary: '更改管理员密码',
  })
  async password(@Body(ALL) dto: UpdatePasswordDto) {
    const result = await this.userService.updatePassword(
      this.ctx.state.admin.userId,
      dto
    );
    if (result) {
      return this.success();
    }
    throw new MyError('旧密码与原密码不一致');
  }

  @Post('/logout', {
    summary: '管理员登出',
  })
  async logout() {
    await this.adminVerifyService.clearLoginStatus(this.ctx.state.admin.userId);
    return this.success();
  }

  @Get('/permmenu', {
    summary: '获取菜单列表及权限列表',
  })
  async permmenu() {
    const res = await this.adminVerifyService.getPermMenu(
      this.ctx.state.admin.userId
    );
    return this.success(res);
  }
}
