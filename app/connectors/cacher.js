const Cacher = require('cache-redis-fg');
const config = require('../../config');

const cacher = new Cacher(config.cacher);
module.exports = cacher;
