const Sentry = require('@sentry/node');
const { sentry } = require('../../config');

Sentry.init(sentry);

module.exports = Sentry;
