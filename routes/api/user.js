var express = require("express");
var router = express.Router();

const UserModel = require("../../model/UserModel");

// 导入生成token的方法
const { createToken, verifyToken } = require("../../utils/token");

// 注册接口
router.post("/reg", function (req, res, next) {
  const { username, password } = req.body;
  console.log("收到注册请求:", { username, password }); // 打印调试信息

  // 查询用户名是否存在
  UserModel.findOne({ username }).then((user) => {
    if (user) {
      console.log("output->用户已存在", user);
      const { createDate } = user;
      console.log("output->用户创建时间", createDate);
      // 用户名已存在
      res.json({
        code: 1,
        message: "用户名已存在",
      });
    } else {
      // 用户名不存在，创建新用户
      UserModel.create({ username, password })
        .then((newUser) => {
          res.json({
            code: 0,
            message: "注册成功",
            data: {
              username: newUser.username,
              createDate: newUser.createDate,
            },
          });
        })
        .catch((err) => {
          res.json({
            code: 1,
            message: "注册失败，服务器错误",
          });
        });
    }
  });
});

// 登陆接口，返回 token
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  // 查询用户名和密码是否匹配
  UserModel.findOne({ username, password }).then((user) => {
    if (user) {
      // 用户名和密码匹配，生成 token（包含 userId）
      const token = createToken({
        userId: user._id,
        username: user.username,
      });

      // 验证token是否生成成功
      console.log("output->生成的 token:", token);
      console.log("output->验证 token 结果:", verifyToken(token));

      res.json({
        code: 0,
        message: "登录成功",
        data: {
          token,
        },
      });
    } else {
      // 用户名或密码错误
      res.json({
        code: 1,
        message: "用户名或密码错误",
      });
    }
  });
});

module.exports = router;
