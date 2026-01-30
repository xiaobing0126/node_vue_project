// 导入api/user.js中的路由
const user = require("./api/user");
// 导入api/accounts.js中的路由
const accounts = require("./api/accounts");

module.exports = (app) => {
  // 使用/api前缀来注册路由
  console.log("routes/index -> registering routes");
  app.use("/api/user", user);
  app.use("/api/accounts", accounts);
  console.log("routes/index -> routes registered");
};
