const Boom = require('boom');
const { createHash, createCipheriv, createDecipheriv } = require('crypto');
// 加/解 密的密钥
const { const: C } = require('../../config');

const md5 = (s) => createHash('md5')
  .update(s, 'utf8')
  .digest('hex');

/** 加密函数
 * @param {string} content 要加密的电话号码
 * @param {string} key  加/解密的密钥（码）(二进制格式的字符串或一个Buffer对象)        length24
 * @param {string} iv   用于指定解密时所使用的初始向量(二进制格式的字符串或一个Buffer对象)   length16
 */
const encrypt = (content = '', key = '', iv = '') => {
  if (key.length !== 24) {
    throw Boom.unauthorized('invalid key length');
  }
  if (iv.length !== 16) {
    throw Boom.unauthorized('invalid iv length');
  }
  const cipher = createCipheriv('aes192', key, iv);
  return cipher.update(content, 'utf8', 'hex') + cipher.final('hex');
};

/** 解密函数
 * @param {string} content 要加密的电话号码
 * @param {string} key     加/解密的密钥（码）(二进制格式的字符串或一个Buffer对象)        length24
 * @param {string} iv      用于指定解密时所使用的初始向量(二进制格式的字符串或一个Buffer对象)   length16
 */
const decrypt = (content = '', key = '', iv = '') => {
  if (key.length !== 24) {
    throw Boom.unauthorized('invalid key length');
  }
  if (iv.length !== 16) {
    throw Boom.unauthorized('invalid iv length');
  }
  const decipher = createDecipheriv('aes192', key, iv);
  return decipher.update(content, 'hex', 'utf8') + decipher.final('utf8');
};

/**
 * @param {string} mobile 要加密的电话号码
 * @param {string} portalId iv 三个参数用于指定/加解密时所使用的初始向量
 *
 * node -pe "require('./app/middleware/crypto.js').encryptMobile('13265492148', 'koa')
 */
const encryptMobile = (mobile, portalId) => {
  if (mobile.length !== 11) {
    throw Boom.badRequest('invalid key length');
  }
  const iv = portalId.padEnd(16, portalId);
  return encrypt(mobile, C.mobileEncryptPassword, iv);
};

/**
 * @param {string} mobileEncrypted 要揭秘的的电话号码乱码
 * @param {string} portalId iv 三个参数用于指定/加解密时所使用的初始向量
 *
 * node -pe "require('./app/middleware/crypto.js')
 * .decryptMobile('41fd04cefc28e0045a56ee73092e37bc', 'koa')"
 */
const decryptMobile = (mobileEncrypted, portalId) => {
  const iv = portalId.padEnd(16, portalId);
  return decrypt(mobileEncrypted, C.mobileEncryptPassword, iv);
};

/** 模糊交易账号/电话号码也行
 * @param {string} tradeId 交易账号
 *
 * node -pe "require('./app/middleware/crypto.js').blurTradeId('123121132123123')"
 * node -pe "require('./app/middleware/crypto.js').blurMobile('13265492148')"
 */
const blurTradeId = (tradeId) => tradeId.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2');

const blurMobile = (mobile = '') => mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');

module.exports = {
  encryptMobile, decryptMobile, blurTradeId, blurMobile, md5,
};
