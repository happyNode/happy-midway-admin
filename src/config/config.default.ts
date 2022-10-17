import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core';
import * as redisStore from 'cache-manager-ioredis';

export default (appInfo: MidwayAppInfo): MidwayConfig => {
  const config = {} as MidwayConfig;
  config.keys = appInfo.name + '_1640593084642_6476';
  config.accessLogConfig = {
    ignore: [/\/swagger-u.*/u],
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.jwt = {
    secret: '123456',
    expiresIn: 1000 * 60 * 60 * 24,
  };
  config.jwtWhitelist = [
    '/swagger-ui',
    '/api/admin/public/login',
    '/api/public/login',
    '/api',
    '/api/user',
    '/api/public/captcha/img',
  ];
  config.cors = {
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    origin: req => req.headers.origin,
  };
  config.task = {
    prefix: 'midway-task', // 这些任务存储的key，都是midway-task开头，以便区分用户原有redis里面的配置。
    defaultJobOptions: {
      repeat: {
        tz: 'Asia/Shanghai', // Task等参数里面设置的比如（0 0 0 * * *）本来是为了0点执行，但是由于时区不对，所以国内用户时区设置一下。
      },
    },
  };
  config.sequelize = {
    dataSource: {
      default: {
        dialect: 'mysql',
        define: {
          timestamps: true, // 是否需要增加createdAt、updatedAt、deletedAt字段
          paranoid: true, // 此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
          underscored: true, // 所有属性设置下划线
          freezeTableName: true, //不会尝试更改模型名以获取表名。否则，型号名称将是复数
          engine: 'innodb', // 默认的存储引擎
        },
        timezone: '+08:00',
        benchmark: true,
        logging: (sql, timing) => {
          // 每次日志输出都会调用的函数，可以在此进行重写
          if (typeof timing === 'number' && timing > 5000) {
            // 记录执行时间超过阈值的sql
            console.warn(`[sequelize](${timing} ms) ${sql}`);
          }
        },
        dialectOptions: {
          // 此处配置将直接传给数据库
          connectTimeout: 30000, // 单次查询连接超时时间
          dateStrings: true, // 不会返回UTC格式时间
          typeCast: true, // 驼峰命名
          bigNumberStrings: true, // bigInt和decimal 以字符串返回
        },
        sync: false, // 本地的时候，可以通过sync: true直接createTable
        entities: ['/app/entity'],
      },
    },
  };
  config.koa = {
    contextLoggerFormat: info => {
      const ctx = info.ctx;
      return `${info.timestamp} ${info.LEVEL} ${info.pid} [${ctx.reqId} - ${
        Date.now() - ctx.startTime
      }ms ${ctx.method} ${ctx.url}] ${info.message}`;
    },
    port: 7001,
    globalPrefix: '/api',
  };

  config.cache = {
    store: redisStore,
    options: {
      keyPrefix: 'cache:',
      ttl: 100,
    },
  };

  config.rootRoleId = [0];
  return config;
};
