const _ = require('lodash');
/** 将环境变量中的CONFIG_前缀（CONFIG_mongo_db = '#####' => config:{mongo:{db:'####'}}）配置加入config {} */
const envConfig = require('ding-env-config');

const NODE_ENV = process.env.NODE_ENV || 'dev';
const defaultsConfig = module.require('./config.defaults.js');

// @ts-ignore 文件中的路径
const nodeEnvConf = module.require(`./env/${NODE_ENV}`);
// linux环境变量 + 对应的环境文件配置如有雷同，环境变量配置覆盖文件配置
const config = envConfig({ config: nodeEnvConf });

// 深合并，遇到嵌套的对象也会逐级对比合并， 保留前者;
module.exports = _.defaultsDeep(config, defaultsConfig);
