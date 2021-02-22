const { Schema } = require('mongoose');

// 判断koaDB是不是数据名
const { koaDB } = require('../connectors/mongodb');

const RoomSchema = new Schema(
  {
    order_id: String, // 订单编号
    goods_cost_price: String, // 成本价
    goods_name: String, // 商品名称
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);
exports.modelFuc = ((name) => koaDB.model(name, RoomSchema));
