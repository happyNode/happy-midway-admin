export enum STATUS {
  STOP = 0, // 暂停中
  START = 1, // 启动中
}

export enum TYPE {
  CRON = 1, //
  INTERVAL = 2, //
}

export enum RUN_MODE {
  AUTO = 1, // 自动执行
  MANUAL = 2, // 手动执行
}

export enum RESULT {
  FAIL = 0, // 失败
  SUCCESS = 1, // 成功
}
