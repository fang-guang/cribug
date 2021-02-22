const boom = require('boom');

module.exports = function core(options) {
  const defaults = {
    allowOrigin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    allowHeaders: 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
    // 设置预检测时间5s用于option请求
    maxAge: '5',
    // 允许客户端携带验证信息
    allowCredentials: true,
    // // 首部字段用于预检请求。其作用是，将实际请求所使用的 HTTP 方法告诉服务器。
    // requestMethod = GET,
  };
  options = Object.assign(defaults, options);
  return async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', options.allowOrigin);
    ctx.set('Access-Control-Allow-Headers', options.allowHeaders);
    ctx.set('Access-Control-Allow-Methosd', options.allowMethods);
    ctx.set('Access-Control-Allow-Credentials', options.allowCredentials);
    // 列出哪些首部可以作为响应的一部分暴露给外部
    if (options.exposeHeaders) {
      ctx.set('Access-Control-Expose-Headers', options.exposeHeaders);
    }
    // OPTIONS的请求是由WEB服务器处理跨域访问引发的。OPTIONS是一种预检请求，浏览器在处理跨域访问的请求时，如果判断请求为复杂请求(post)
    // 览器会向所请求的服务器发起两次请求，第一次是浏览器使用OPTIONS方法发起一个预检请求，第二次才是真正的异步请求，
    // 第一次的预检请求获知服务器是否允许该跨域请求：如果允许，才发起第二次真实的请求；如果不允许，则拦截第二次请求
    if (ctx.method === 'OPTIONS') {
      // 设置预检测时间5s用于option请求
      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', options.maxAge);
      }
      ctx.body = 200;
    }
    try {
      await next();
    } catch (err) {
      boom.forbidden('the domain forbid');
    }
  };
};
