const Koa = require('koa');
// 应用记录接口日志
const koaWinston = require('koa2-winston');
// swagger自动生成api文档
const koaBody = require('koa-body');
// 既解析post请求，又支持文件上传功能 http://www.ptbird.cn/koa-body.html
const swaggerUIRoutes = require('./app/middleware/swagger_ui_routes');
// 异常处理抓取error
const errorHanler = require('./app/middleware/error_handler');
// sentry 报错
const sentry = require('./app/connectors/sentry');
// 设置数据返回规范
const resMsg = require('./app/middleware/res_msg');
const logger = require('./app/connectors/logger');
const routes = require('./app/routes');
const cors = require('./app/middleware/cors');

const app = new Koa();

app.on('error', (err) => {
  logger.error(err);
  sentry.captureException(err);
});
// sentry
app.use(errorHanler(app));
app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    maxFileSize: 20000 * 1024 * 1024, // 设置上传文件大小最大限制，默认200M
    multipart: true, // 是否支持 multipart-formdate 的表单
  },
}));
app.use(
  koaWinston.logger({
    // 增加记录request字段log
    reqSelect: ['body.error', 'body.success'],
  })
);

app.use(swaggerUIRoutes({ file: './swagger.json', prod: false }));

app.use(resMsg());
app.use(routes());
app.use(cors());
if (!module.parent) {
  app.listen(3000);
  logger.info('app start port in 3000');
}

module.exports = app;
