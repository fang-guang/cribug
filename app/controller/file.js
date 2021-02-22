const {
  smallFileUpload,
  throwDiffDoc,
} = require('../proxy/file');

// 文件上传
exports.fileUpload = async (ctx) => {
  const { files: { file } } = ctx.request;
  const { filename } = ctx.query;
  const data = await smallFileUpload({ file, filename });
  ctx.resMsg(data);
};
// 文件对比
exports.compares = async (ctx) => {
  const { local, remote } = ctx.request.body;
  const throwData = await throwDiffDoc(local, remote);
  ctx.resMsg(throwData);
};
