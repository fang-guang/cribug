const winston = require('winston');
const _ = require('lodash');

const config = require('../../config').winston;

const transports = _.map(config, (payload) => {
  if (!payload.enable) { return 0; }

  return new (winston.transports[payload.transport])(payload.option);
}).filter(_.identity);

const logger = winston.createLogger({ transports });

module.exports = logger;
