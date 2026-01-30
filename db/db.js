// 完成链接数据库的封装
// 链接成功时调用success回调，链接失败时调用error回调
// monogoose链接数据库是一个异步操作
const mongoose = require("mongoose");

// 引入配置文件
const config = require("../config/config");

// 获取配置信息
const { DBHOST, DBPORT, DBNAME } = config.database;

// 拼接链接字符串
const dbURL = `mongodb://${DBHOST}:${DBPORT}/${DBNAME}`;

// 定义链接数据库函数并暴露
// 我们在链接数据库后希望执行其他操作，所以这里接受两个回调函数作为参数，供调用时使用
module.exports = (success, error) => {
  // 连接数据库
  mongoose
    .connect(dbURL)
    .then(() => {
      // 调用成功的回调函数
      success && success();
    })
    .catch((err) => {
      console.log("数据库链接失败", err);
      // 调用失败的回调函数
      error && error(err);
    });

  mongoose.connection.on("disconnected", () => {
    console.log("数据库断开链接");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("数据库重新链接");
  });
};
