const { koaSwagger } = require('koa2-swagger-ui');
const Router = require('koa-router');
const path = require('path');
const _ = require('lodash');

/**
 * load swagger file to swagger ui plugin
 * 配置swagger中的配置，并将配置生成路由，返回路由
 * @param {Object} payload - input arguments
 * @param {string} payload.file - local swagger file path
 * @param {boolean} payload.prod - should this swagger ui appear in production env
 */
const swaggerUIRoutes = (payload = {}) => {
  const router = new Router();
  const { NODE_ENV } = process.env;
  // 生产环境下不返回swagger路由
  if (/prod/.test(NODE_ENV) && !payload.prod) {
    return router.routes();
  }
  // key 一样保留最初的值
  const pl = _.defaultsDeep(payload, {
    routePrefix: '/swagger',
    swaggerOptions: {
      url: 'http://petstore.swagger.io/v2/swagger.json',
    },
  });
  if (pl.file) {
    // .cwd(),返回运行当前脚本路径 /User
    const filePath = path.join(process.cwd(), pl.file);
    Object.defineProperty(pl.swaggerOptions, 'spec', {
      get: () => {
        // 引用对应的swagger文件名
        const spec = module.require(filePath);
        // 是否没有配置环境变量或者环境变量中包含dev
        if (!NODE_ENV || /dev/.test(NODE_ENV)) {
          // json文档中的open api字段
          if (spec.openapi) {
            spec.servers = spec.servers && spec.servers.reverse();
          } else {
            delete spec.basePath;
          }
        }
        // 修饰的名字改成字符串才会再/swagger出现
        if (Array.isArray(spec.info.description)) {
          spec.info.description = spec.info.description.join('\n');
        }
        return spec;
      },
      enumerable: true,
    });
  }
  // 对应的配置，加载swagger文件到swagger ui插件
  router.get(pl.routePrefix, koaSwagger(pl));
  // 返回对应的/swagger路由
  return router.routes();
};

module.exports = swaggerUIRoutes;
