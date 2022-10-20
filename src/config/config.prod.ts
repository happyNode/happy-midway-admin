import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';
import { join } from 'path';

export default (appInfo: MidwayAppInfo): MidwayConfig => {
  const config = {} as MidwayConfig;
  config.redis = {
    client: {
      port: +process.env.REDIS_CLIENT_PORT,
      host: process.env.REDIS_CLIENT_HOST,
      db: +process.env.REDIS_CLIENT_DB,
      password: process.env.REDIS_CLIENT_PASSWORD,
    },
  };
  config.task = {
    redis: {
      port: +process.env.REDIS_CLIENT_PORT,
      host: process.env.REDIS_CLIENT_HOST,
      db: +process.env.REDIS_CLIENT_DB,
      password: process.env.REDIS_CLIENT_PASSWORD,
    },
  };
  config.sequelize = {
    dataSource: {
      default: {
        database: process.env.DATABASE_DATABASE,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        logging: false,
      },
    },
  };

  config.cache = {
    options: {
      host: process.env.REDIS_CLIENT_HOST,
      port: +process.env.REDIS_CLIENT_PORT,
      password: process.env.REDIS_CLIENT_PASSWORD,
      db: +process.env.REDIS_CLIENT_DB,
    },
  };

  config.jwt = {
    secret: process.env.SECRET,
  };

  config.grpc = {
    services: [
      {
        url: process.env.GRPC_URL,
        protoPath: join(appInfo.appDir, 'proto/email.proto'),
        package: 'email',
      },
    ],
  };

  return config;
};
