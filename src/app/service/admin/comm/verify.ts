import { Provide, Inject } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import * as svgCaptcha from 'svg-captcha';
import * as _ from 'lodash';
import * as utils from 'happy-node-utils';

import { UserEntity } from '../../../entity/user';
import { BaseService } from '../../../../core/baseService';
import MyError from '../../../comm/myError';
import { Crypto } from '../../../comm/crypto';
import { LoginImageCaptchaDto } from '../../../model/dto/verify';
import { IImageCaptchaResult } from '../interface';
import { MenuService } from '../sys/menu';
import { UserService } from '../sys/user';
import { IPermMenuResult } from '../../../../interface';
import { Repository } from 'sequelize-typescript';

@Provide()
export class AdminVerifyService extends BaseService<UserEntity> {
  @Inject()
  private crypto: Crypto;

  @Inject()
  private jwtService: JwtService;

  @Inject()
  private menuService: MenuService;

  @Inject()
  private userService: UserService;

  getModel(): Repository<UserEntity> {
    return UserEntity;
  }

  /**
   * 生成图片验证码
   * 预览：https://www.bejson.com/ui/svg_editor/
   */
  async getImgCaptcha(
    captcha: LoginImageCaptchaDto
  ): Promise<IImageCaptchaResult> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: _.isEmpty(captcha.width) ? 100 : captcha.width,
      height: _.isEmpty(captcha.height) ? 50 : captcha.height,
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64'
      )}`,
      id: utils.getRandom(15, 'alphanumeric'),
    };
    // 10分钟过期时间
    await this.getAdminRedis().set(
      `admin:captcha:img:${result.id}`,
      svg.text,
      'EX',
      60 * 10
    );
    return result;
  }

  async checkImgCaptcha(id: string, code: string): Promise<boolean> {
    const result = await this.getAdminRedis().get(`admin:captcha:img:${id}`);
    if (_.isEmpty(result)) {
      return false;
    }
    if (code.toLowerCase() !== result!.toLowerCase()) {
      return false;
    }
    // 校验成功后移除验证码
    await this.getAdminRedis().del(`admin:captcha:img:${id}`);
    return true;
  }

  async getLoginSign(username: string, password: string) {
    const user = await this.findOne({
      username,
      status: 1,
    });
    if (utils.isEmpty(user)) {
      throw new MyError('用户名或者密码错误');
    }
    const correct = this.crypto.compareSync(password, user.password);

    if (!correct) {
      throw new MyError('用户名或者密码错误');
    }

    const perms = await this.menuService.getPerms(user!.userId);
    const jwtSign = await this.jwtService.sign(
      {
        userId: parseInt(user!.userId.toString()),
        pv: 1,
      },
      {
        expiresIn: '24h',
      }
    );
    await this.getAdminRedis().set(`admin:passwordVersion:${user!.userId}`, 1);
    await this.getAdminRedis().set(`admin:token:${user!.userId}`, jwtSign);
    await this.getAdminRedis().set(
      `admin:perms:${user!.userId}`,
      JSON.stringify(perms)
    );
    // 保存登录日志
    // await this.adminSysLoginLogService.save(user!.id);
    return jwtSign;
  }

  /**
   * 获取权限菜单
   */
  async getPermMenu(uid: number): Promise<IPermMenuResult> {
    const menus = await this.menuService.getMenus(uid);
    const perms = await this.menuService.getPerms(uid);
    return { menus, perms };
  }

  /**
   * 清除登录状态信息
   */
  async clearLoginStatus(uid: number): Promise<void> {
    await this.userService.forbidden(uid);
  }

  async getRedisPermsById(id: number): Promise<string> {
    return this.getAdminRedis().get(`admin:perms:${id}`);
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.getAdminRedis().get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.getAdminRedis().get(`admin:token:${id}`);
  }
}
