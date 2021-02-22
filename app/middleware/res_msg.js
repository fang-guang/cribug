const resMsg = require('ding-res-msg');

module.exports = (payload = {}) => {
  const { code = 200 } = payload;

  return async (ctx, next) => {
    // 给koa的ctx包装一下
    ctx.resMsg = (data, isPaging) => {
      ctx.body = resMsg({ data, code, isPaging });
    };

    await next();
  };
};
