/* eslint-disable no-param-reassign */
const { nanoid } = require('nanoid');
const _ = require('lodash');
const Axios = require('axios');

const logger = require('../middleware/logger.js');

/** 自定义一个 axios 实例 */
const axios = Axios.create({
  // HTTP响应状态码。如果validateStatus返回true（或被设置为null） promise将被resolve; 否则，promise将被reject。
  validateStatus: () => true,
  timeout: 10000,
});

/** 添加请求拦截器 axios.interceptors.request.use（） */
axios.interceptors.request.use((config) => {
  // 对请求数据做些事
  config.id = nanoid();
  logger.info(_.pick(config, ['id', 'baseURL', 'url', 'params']));
  return config;
});
/** 添加响应拦截器 axios.interceptors.response.use（） */
axios.interceptors.response.use((res) => {
  // 对响应数据做些事
  logger.info(_.pick(res, ['config.id', 'status', 'headers', 'data']));
  return res;
});

module.exports = { axios };
