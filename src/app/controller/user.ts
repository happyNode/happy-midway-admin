import { Validate } from '@midwayjs/validate';
import {
  Inject,
  Controller,
  Get,
  Post,
  ALL,
  Body,
  Param,
  Query
} from '@midwayjs/decorator';
import { UserService } from '../service/user';
import { BaseController } from '../../core/baseController';
import { MenuService } from "../service/menu";
import {CreateUserDto, PasswordUserDto, UpdateUserDto} from "../model/dto/user";
import MyError from "../comm/myError";
import {QueryParamDTO} from "../model/dto/base";

@Controller('/user', { tagName: 'User', description: '用户管理控制器' })
export class UserController extends BaseController {
  @Inject()
  protected service: UserService;

  @Inject()
  protected menuService: MenuService;

  @Get('/:userId', { summary: '用户详情' })
  @Validate()
  async index(@Param('userId')userId: number) {
    const user = await this.service.info(userId);
    return this.success(user);
  }

  @Get('/page')
  @Validate()
  async page(@Query(ALL) dto: QueryParamDTO){
    const list = await this.service.page(
      this.ctx.admin.uid,
      dto.page - 1,
      dto.limit
    );
    const total = await this.service.count(
      this.ctx.admin.uid,
    );
    return this.success({
      list, total
    });
  }

  @Post('/add', {
    summary: '创建用户',
    description: '',
  })
  @Validate()
  async add(@Body(ALL) dto: CreateUserDto) {
    const result = await this.service.add(dto);
    if (!result) {
      throw new MyError('系统用户已存在');
    }
    return this.success(result);
  }

  @Post('/modify', {
    summary: '更新用户',
    description: '',
  })
  @Validate()
  async modify(@Body(ALL) dto: UpdateUserDto) {
    await this.service.update(dto);
    await this.menuService.refreshPerms(dto.userId);
    return this.success();
  }


  @Post('/delete', {
    summary: '删除用户',
    description: '',
  })
  @Validate()
  async delete(@Body('userIds') userIds: number[]) {
    await this.service.delete(userIds);
    await this.service.multiForbidden(userIds);
    return this.success();
  }

  @Post('/password')
  @Validate()
  async password(@Body(ALL) dto: PasswordUserDto) {
    await this.service.forceUpdatePassword(
      dto.userId,
      dto.password
    );
    return this.success();
  }
}
