const mongoose = require('mongoose');

const config = require('../../config').mongoose;
const logger = require('../middleware/logger');

const createDb = (payload) => {
  const uri = payload.uri || `mongodb://${payload.hosts.join(',')}/${payload.database}`;
  logger.info(`mongoose connection uri: ${uri}`);

  const db = mongoose.createConnection(uri, payload.options);
  // 5s后重新连接mongodb
  const retry = (err) => {
    logger.error(`mongoose connection error: ${err}, retry after 5s`);
    return setTimeout(() => db.openUri(uri), 5000);
  };
  db.on('connected', () => logger.info('mongoose connected'));
  db.on('error', retry);
  db.on('disconnect', retry.bind(retry, 'disconnect'));

  return db;
};

const dbs = new Proxy(
  {},
  {
    get(target, dbName) {
      if (dbName in target) {
        return target[dbName];
      }
      if (typeof dbName !== 'string') {
        return undefined;
      }
      // 判断最后时候以DB结尾
      const validDBName = dbName.endsWith('DB') && dbName in config;
      if (!validDBName) {
        return logger.error(`invalid ${dbName} to get db`);
      }

      const payload = config[dbName];
      payload.options = { ...config.options, ...payload.options };
      target[dbName] = createDb(payload);
      return target[dbName];
    },
  }
);
/**
 * @type {Object}
 * @property {Object} testDB
 *
 * dbs.(dbName)等同调用new proxy(target, handle)的get方法
 */
module.exports = dbs;
