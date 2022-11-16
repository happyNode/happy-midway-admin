import { App, Inject } from '@midwayjs/decorator';
import { Application, Context } from '@midwayjs/koa';
import { Redis } from 'ioredis';
import { CacheManager } from '@midwayjs/cache';

export abstract class BaseService {
  @App()
  protected app: Application;

  @Inject()
  protected ctx: Context;

  @Inject()
  cacheManager: CacheManager;

  protected mapping;

  async findAndCountAll(page: number, limit: number, where = {}) {
    const res = await this.mapping.findAndCountAll(page, limit, where);
    return res;
  }

  async findAll(where = {}, options = {}) {
    const res = await this.mapping.findAll(where, options);
    return res;
  }

  async findOne(where) {
    const res = await this.mapping.findOne(where);
    return res;
  }

  async create(createParams) {
    const res = await this.mapping.saveNew(createParams);
    return res;
  }

  async update(updateParams, where) {
    const res = await this.mapping.modify(updateParams, where);
    return res;
  }

  async destroy(where) {
    const res = await this.mapping.destroy(where);
    return res;
  }

  async findByPk(id: number) {
    const res = await this.mapping.findByPk(id);
    return res;
  }

  getAdminRedis(): Redis {
    return (this.cacheManager.cache.store as any).getClient();
  }
}
