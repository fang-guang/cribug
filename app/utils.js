const moment = require('moment');
const _ = require('lodash');

exports.reject = (msg = 'something happen', code = 400) => {
  const error = new Error(msg);
  error.code = code;
  return Promise.reject(error);
};

/**
 * tool to easy handler exist or not issue by promise
 * @param {Object} payload - input arguments
 * @param {Promise} promise - promise obejct to then
 * @param {boolean} [isEmpty=true] - whether resource should be empty
 * @param {string} [msg=resource not found] - is used to reject as error.message
 * @param {number} [code=400] - error.code
 * @return {Promise} reject when conditions are met else return orignal result
 * @example
 * u.emptyReject({
 *   promise: Promise.resolve(''),
 * })
 *   .catch(console.log)
 *   // Error { message: 'resource not found', code: 400 }
 *
 * u.emptyReject({
 *   promise: Promise.resolve([]),
 *   isEmpty: false
 * })
 *   .catch(console.log)
 *   // Error { message: 'resource already exist', code: 400 }
 *
 * u.emptyReject({
 *   promise: Promise.resolve('test'),
 * })
 *   .then(console.log)
 *   // test
 */
exports.emptyReject = (payload = {}) => {
  const {
    promise, isEmpty = true, msg, code = 400,
  } = payload;
  if (!promise) {
    return exports.reject('invalid promise input');
  }
  let errorMsg = msg;
  if (!msg) {
    errorMsg = isEmpty ? 'resource not found' : 'resource already exist';
  }

  return Promise.resolve(promise)
    .then((resource) => {
      const isResourceEmpty = _.isEmpty(resource);
      const isReject = !!isEmpty === !!isResourceEmpty;
      if (isReject) {
        return exports.reject(errorMsg, code);
      }

      return resource;
    });
};

exports.date = {
  now: (time = Date.now()) => moment(time).utcOffset(8),
  // defaults value is from the begin of day to the time use this method
  mongo: (
    min = exports.date.now().startOf('day'),
    max = exports.date.now(),
    intervals = '[]'
  ) => {
    let minVal = (min instanceof moment ? min : exports.date.now(min)).toDate();
    let maxVal = (max instanceof moment ? max : exports.date.now(max)).toDate();
    if (maxVal < minVal) {
      [maxVal, minVal] = [minVal, maxVal];
    }
    const result = {};
    const mapper = {
      '[': () => {
        result.$gte = minVal;
      },
      ']': () => {
        result.$lte = maxVal;
      },
      '(': () => {
        result.$gt = minVal;
      },
      ')': () => {
        result.$lt = maxVal;
      },
    };
    [...intervals].map((interval) => mapper[interval]());
    return result;
  },
  yesterdayFormat: (formator = 'YYYY-MM-DD') => moment().subtract(1, 'day').format(formator),
};
