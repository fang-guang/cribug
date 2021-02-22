/* eslint-disable no-plusplus */
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const _ = require('lodash');
const Boom = require('boom');
const { modelFuc } = require('../models/file');

const smallFileUpload = async ({ file, filename }) => {
  const data = fs.readFileSync(file.path);
  const parseData = parse(data, { columns: true, auto_parse: true });

  const allSaveDate = await Promise.allSettled(parseData.map((doc) => modelFuc(filename).create(_.pick(doc, ['order_id', 'goods_cost_price', 'goods_name']))));
  let [sucessNum, defeatNum] = [0, 0];
  allSaveDate.forEach((element) => {
    if (element.status === 'fulfilled') {
      sucessNum += 1;
    }
    if (element.status === 'rejected') {
      defeatNum += 1;
    }
  });

  return {
    all_date_num: allSaveDate.length, success_num: sucessNum, defeat_nnm: defeatNum,
  };
};

/**
 * 对比取出与自身数据不一致的数据
 * @param {Array} compare 需要比对的数组
 * @param {Array} compareUniq 去重后的自身数组
 */
function selfRepetition(compare, compareUniq) {
  let j = 0;
  const remoteArr = [];
  for (let i = 0; i < compareUniq.length; i++) {
    if (compareUniq[i] !== compare[j]) {
      remoteArr.push(compare[j]);
      j += 1;
    }
    j += 1;
  }
  return remoteArr;
}

/**
 * 输出对比的字段
 * @param {String} Filename 自己的数据表名
 * @param {*} remoteFileName 需要对比的数据表名
 */
const throwDiffDoc = async (Filename, remoteFileName) => {
  // 用于查找我们自己的数据库
  const integration = modelFuc(Filename).find({})
    .orFail(Boom.notFound('the from name error', Filename))
    .select({ _id: 0, order_id: 1, goods_cost_price: 1 })
    .lean();

  // 查询需要对比的数据库
  const remoteCompare = modelFuc(remoteFileName).find({})
    .orFail(Boom.notFound('the from name error', remoteFileName))
    .select({ _id: 0, order_id: 1, goods_cost_price: 1 })
    .lean();
  const [
    integrationData, remoteCompareData,
  ] = await Promise.all([integration, remoteCompare]);

  // lakala的外部数据格式不对 "'132009080307684usi-0"
  if (_.get(remoteCompareData, '[0].order_id').startsWith("'")) {
    remoteCompareData.forEach((data) => {
      data.order_id = data.order_id.replace(/'/g, '').replace(/-0/g, '');// slice(1, 19);
      return data;
    });
  }
  // 合并2个大数组，去重
  const concatAndUniqArr = _.uniqWith(integrationData.concat(remoteCompareData), _.isEqual);
  // 取出与大数组不相等的数据(ps: differenceWith方法只会添加不一致的方法，不能添加数据重复对象)
  let integral = _.differenceWith(concatAndUniqArr, remoteCompareData, _.isEqual);
  let remote = _.differenceWith(concatAndUniqArr, integrationData, _.isEqual);
  // 不管2个数据对等否都会出现数据不想等的问题
  const integrationUniq = _.uniqBy(integrationData, 'order_id');
  const remoteCompareUniq = _.uniqBy(remoteCompareData, 'order_id');
  // 去重后的数据不相等的情况（数据重复的情况）
  if (integrationUniq.length !== integrationData.length
           || remoteCompareUniq.length !== remoteCompareData.length) {
    integral = integral.concat(selfRepetition(integrationData, integrationUniq));
    remote = remote.concat(selfRepetition(remoteCompareData, remoteCompareUniq));
  }

  return [{ integral }, { remote }];
};

module.exports = {
  smallFileUpload,
  throwDiffDoc,
};
