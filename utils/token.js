/**
 * jsonwebtoken生成随机 token 字符串
 */
const { USER_SECRET } = require("../config/config").database;

const jwt = require("jsonwebtoken");

// 密钥
const secretKey = USER_SECRET;

/**
 * 创建 token
 * @param {Object} payload - 载荷数据
 * 单位秒，设置一分钟过期
 */
function createToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: 60 * 30 });
}

// 验证 token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, message: err.message };
  }
}

module.exports = {
  createToken,
  verifyToken,
};
