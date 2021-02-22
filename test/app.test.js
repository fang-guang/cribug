const test = require('ava');

const app = require('../app');

test('app require test', (t) => {
  t.truthy(app);
});
