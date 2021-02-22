exports.cryptoAuth = {
  secrets: {
    test: 'test',
  },
};

exports.sch = {
  cron: {
    // every day
    d1: '0 3 * * * ',
    // every hour
    h1: '30 * * * *',
    // every minute
    m1: '* * * * *',
    // every 30 second
    s30: '*/30 * * * * *',
  },
};

exports.cacher = {
  redis: {
    db: 1,
    host: 'localhost',
  },
  prefix: 'cache.file.',
};

exports.mongoose = {
  options: {},
  cribugDB: {
    hosts: ['localhost'],
    database: 'cribug',
    options: {
      // auth: { user: 'gfwealth', password: 'gfwealth+1s', },
      readPreference: 'nearest',
      useNewUrlParser: true,
    },
  },
};

exports.sentry = {
  dsn: 'https://b239c5ec06b04ebea1f7f11d74abc2e4@o382783.ingest.sentry.io/5212168',
  options: {
    captureUnhandledRejections: true,
  },
};

exports.const = {
  mobileEncryptPassword: '653024ce796f89a9980b7684',
};

exports.winston = {
  console: {
    /**
     * @param {String} transport 日志信息输出到哪里控制台，默认[]当前支持的传输是：控制台、文件、内存。（ Console, File, Memory）
     * @param {Boolean} enable  确保应用config配置
     * @param {Object} option 配置控制台输出
     * @param {String} option.json 输出为json对象 默认false）
     * @param {String} option.stringify 输出通过JSON.stringify传递 默认false
     * @param {String} option.timestamp 在输出前加上时间戳 默认false
     * @param {String} option.humanReadableUnhandledException 未捕获的异常输出为可读的
     */
    enable: true,
    transport: 'Console',
    option: {
      json: true,
      stringify: true,
      timestamp: true,
      humanReadableUnhandledException: true,
    },
  },
};
