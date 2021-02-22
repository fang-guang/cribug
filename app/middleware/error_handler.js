// const resMsg = require('res-msg-fg');
const resMsg = require('ding-res-msg');
const _ = require('lodash');

/**
 * @param {Object|Error} error
 * @param {boolean=} error.isBoom - when
 */
const getStatusCode = (error) => {
  let status;
  if (error.isBoom) {
    status = error.output.statusCode;
  } else {
    const validStatusKey = ['status', 'code', 'statusCode'].find((key) => typeof error[key] === 'number');
    status = error[validStatusKey];
  }

  const isOutRange = status === undefined || status > 600 || status < 200;

  return isOutRange === true ? 500 : status;
};

const parseError = (error) => {
  // rq get real throw error from TransformError
  if (error.name === 'TransformError' && error.cause instanceof Error) {
    return error.cause;
  }

  return error;
};

/**
 * use async await to catch app error
 * @param {Object} [app] - koa app instance
 * @param {Object} [payload] - config for this middleware
 * @param {boolean} payload.sentry - whether enable sentry
 */
module.exports = (app) => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const error = parseError(err);
    const body = { error };

    ctx.status = getStatusCode(error);
    body.code = (error.isBoom && _.get(error, 'data.code')) || ctx.status;
    ctx.body = resMsg(body);

    if (ctx.status > 499) {
      // 错误被try...catch捕获,不会触发error事件。必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效
      app.emit('error', err);
    }
  }
};
