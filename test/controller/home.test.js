const test = require('ava');

const request = require('supertest');

const app = require('../../app');

test('should get 200 hello res', async (t) => {
  const { body: { data, success } } = await request(app.listen())
    .get('/hello');

  t.true(success);
  t.is(data.hello, 'ding');
});

test('should get default 400 error res', async (t) => {
  const { body: { error, success }, status } = await request(app.listen())
    .get('/throw');

  t.is(status, 400);

  t.false(success);
  t.is(error, 'this is error message');
});

test('should get 500 error res', async (t) => {
  const { body: { error, success }, status } = await request(app.listen())
    .get('/throw')
    .query({ status: 500 });

  t.is(status, 500);

  t.false(success);
  t.is(error, 'this is error message');
});

test('should get 500 error res when status out range', async (t) => {
  const { body: { error, success }, status } = await request(app.listen())
    .get('/throw')
    .query({ status: 605 });

  t.is(status, 500);

  t.false(success);
  t.is(error, 'this is error message');
});
