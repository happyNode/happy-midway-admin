import { App, Inject } from '@midwayjs/core';
import { Application, Context } from '@midwayjs/koa';
import { DatabaseError, ValidationError, Transaction } from 'sequelize';
import { Model, Repository } from 'sequelize-typescript';
import { Redis } from 'ioredis';
import { CacheManager } from '@midwayjs/cache';

export abstract class BaseService<T extends Model> {
  @App()
  protected app: Application;

  @Inject()
  protected ctx: Context;

  @Inject()
  cacheManager: CacheManager;

  abstract getModel(): Repository<T>;

  async getTransaction(): Promise<Transaction> {
    const t = await this.getModel().sequelize.transaction();
    return t;
  }

  async execSql(func) {
    try {
      const res = await func;
      return res;
    } catch (error) {
      let logText;
      if (error instanceof DatabaseError) {
        const { message, sql, stack, parameters, name } = error;
        const parametersStr =
          typeof parameters === 'object'
            ? JSON.stringify(parameters)
            : parameters;
        logText = `[sequelize error] DatabaseError||name=${name} message=${message} sql=${sql} parameters=${parametersStr} stack=${stack}`;
      } else if (error instanceof ValidationError) {
        const { message, stack, name, errors } = error;
        logText = `[sequelize error] ValidationError||name=${name} message=${message} errors=${errors} stack=${stack}`;
      }
      (this as any).ctx.logger.error(logText);
      throw error;
    }
  }

  async findAndCountAll(page: number, limit: number, where = {}, option = {}) {
    const offset = (page - 1) * limit;
    const res = await this.getModel().findAndCountAll({
      where,
      ...option,
      limit,
      offset: offset > 0 ? offset : 0,
      order: [['createdAt', 'desc']],
    });

    return res;
  }

  async findAll(where = {}, options = {}) {
    const res = await this.getModel().findAll({
      where,
      ...options,
      order: [['createdAt', 'desc']],
    });

    return res;
  }

  async findOne(where = {}, options = {}) {
    const res = await this.getModel().findOne({
      where,
      order: [['createdAt', 'desc']],
      ...options,
    });
    return res;
  }

  async save(param, options = {}) {
    const res = await this.getModel().create(param, options);
    return res;
  }

  async modify(param, where, options = {}) {
    const [effect] = await this.getModel().update(param, {
      where,
      ...options,
    });
    return effect;
  }

  async destroy(where = {}, options = {}) {
    const res = await this.getModel().destroy({
      where,
      ...options,
    });
    return res;
  }

  async findByPk(id: number, options = {}) {
    const res = await this.getModel().findByPk(id, { ...options });
    return res;
  }

  async queryRaw(sqlStr: string, option?: any) {
    const res = await this.getModel().sequelize.query(sqlStr, option);
    return res;
  }

  async createMany(params, options = {}) {
    await this.getModel().bulkCreate(params, options);
  }

  async count(where) {
    const number = await this.getModel().count({ where });
    return number;
  }

  getAdminRedis(): Redis {
    return (this.cacheManager.cache.store as any).getClient();
  }
}
