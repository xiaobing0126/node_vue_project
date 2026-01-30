// mongoose创建集合规则
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 创建用户集合规则
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

// 创建并暴露用户集合
module.exports = mongoose.model("User", UserSchema);
