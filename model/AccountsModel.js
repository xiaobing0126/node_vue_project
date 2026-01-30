const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 定义账单的Schema
const AccountsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

// 创建并暴露账单集合
module.exports = mongoose.model("Accounts", AccountsSchema);
