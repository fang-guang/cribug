const Router = require('koa-router');

const controller = require('./controller');

module.exports = () => {
  const router = new Router();

  router.get('/hello', controller.home.hello);
  router.get('/throw', controller.home.throw);

  return router.routes();
};
