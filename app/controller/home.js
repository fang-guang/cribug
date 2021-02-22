exports.hello = (ctx) => {
  ctx.resMsg({ hello: 'ding' });
};

exports.throw = (ctx) => {
  const { status = 400 } = ctx.request.query;

  const error = new Error('this is error message');
  error.status = Number(status);

  throw error;
};
