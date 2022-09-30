import { Provide, Inject } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';

import { AdminMapping } from '../mapping/admin';
import { BaseService } from '../../core/baseService';
import { AdminLoginDTO } from '../../app/model/dto/admin';
import MyError from '../../app/comm/myError';
import Crypto from '../../app/comm/crypto';

enum ADMIN_STATUS {
  NORMAL = 1,
  BAN = -1,
}

@Provide()
export class AdminService extends BaseService {
  @Inject()
  protected mapping: AdminMapping;

  @Inject()
  protected crypto: Crypto;

  @Inject()
  private jwtService: JwtService;

  // 登录
  async login(param: AdminLoginDTO) {
    const { account, pwd } = param;
    const adminRes = await this.mapping.findOne({
      account,
      status: ADMIN_STATUS.NORMAL,
    });
    if (this.utils.isEmpty(adminRes)) {
      throw new MyError('用户不存在');
    }

    const { pwd: oldPwd, adminId } = adminRes;

    const correct = this.crypto.compareSync(pwd, oldPwd);
    if (!correct) {
      throw new MyError('密码错误');
    }

    const token = await this.jwtService.sign({
      userId: adminId,
      email: '',
      type: 1,
    });

    await this.getAdminRedis().set(`admin:passwordVersion:${adminId}`, 1);
    await this.getAdminRedis().set(`admin:token:${adminId}`, token);

    return {
      token,
      account,
    };
  }
}
