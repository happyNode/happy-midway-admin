import { MenuEntity } from './app/entity/menu';
import { RoleEntity } from './app/entity/role';
import { RoleMenuEntity } from './app/entity/roleMenu';

export { NpmPkg } from '@waiting/shared-types';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  id: number;
  name: string | null;
  email: string;
}

export interface IGetUserResponse {
  success: boolean;
  message: string;
  data: IUserOptions[];
}

export interface IAccessLogConfig {
  ignore: RegExp[];
}

export interface IExecuteData {
  taskId: number;
  args: string;
  runMode?: number;
}

export interface IRoleInfoResult {
  roleInfo: RoleEntity;
  menus: RoleMenuEntity[];
}

export interface IMenuItemAndParentInfoResult {
  menu: MenuEntity | undefined;
  parentMenu: MenuEntity | undefined;
}
export interface IAccountInfo {
  name: string;
  username: string;
  email: string;
  phone: string;
  remark: string;
  headImg: string;
}

export interface IPageSearchUserResult {
  createdAt: string;
  email: string;
  headImg: string;
  userId: number;
  name: string;
  phone: string;
  remark: string;
  status: number;
  updatedAt: string;
  username: string;
  roleNames: string[];
}

export interface IImageCaptchaResult {
  img: string;
  id: string;
}

export interface ITaskArgs {
  method: string;
  url: string;
}
