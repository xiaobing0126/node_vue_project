const { verifyToken } = require("../utils/token");

/**
 * 校验用户是否登录的中间件
 */
const checkUserLogin = (req, res, next) => {
  // 从请求头中获取 token,一般放在 headers 的 token 字段中
  // 依赖于前端请求时设置 headers: { token: 'xxxx' }
  // 解析token，获取生成token时存储的用户信息
  const token = req.headers["x-csrf-token"];

  if (!token) {
    return res.status(401).json({
      code: 1,
      message: "未提供 token，访问被拒绝",
    });
  }

  // 验证 token
  const result = verifyToken(token);
  console.log("output->验证 token 结果:", result.decoded);

  if (!result.valid) {
    return res.status(401).json({
      code: 1,
      message: "无效的token，访问被拒绝: " + result.message,
    });
  }

  // 将解码后的用户信息存储在请求对象中，供后续中间件或路由处理使用
  // result.decoded 包含 { userId, username, iat, exp }
  req.user = result.decoded;
  next(); // 继续处理请求
};

module.exports = checkUserLogin;
