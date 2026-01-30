const express = require("express");
const AccountsModel = require("../../model/AccountsModel");
const checkUserLogin = require("../../middlewares/checkLoginWare");
const mongoose = require("mongoose");

const router = express.Router();

// 所有 accounts 接口都需要登录验证
router.use(checkUserLogin);

/**
 * 创建账单接口
 * POST /api/accounts/create
 * 请求体参数：amount, type, category, date, notes
 */
router.post("/create", function (req, res, next) {
  const { amount, type, category, date, notes } = req.body;
  // 利用中间件checkLoginWare，解析 token 后获取 userId，不再依赖前端传递
  const userId = req.user.userId;

  // 确保 userId 是有效的 ObjectId
  let objectIdUserId;
  try {
    objectIdUserId = new mongoose.Types.ObjectId(userId);
  } catch (err) {
    return res.json({
      code: 1,
      message: "无效的用户ID",
    });
  }

  AccountsModel.create({
    amount,
    type,
    category,
    date,
    notes,
    userId: objectIdUserId,
  })
    .then((newAccount) => {
      res.json({
        code: 0,
        message: "创建账单成功",
        data: newAccount,
      });
    })
    .catch((err) => {
      console.error("创建账单失败:", err);
      res.json({
        code: 1,
        message: "创建账单失败，服务器错误",
      });
    });
});

/**
 * 获取用户账单列表接口
 * post /api/accounts/list
 */
router.post("/list", function (req, res, next) {
  // 利用中间件checkLoginWare，解析 token 后获取 userId，不再依赖前端传递
  const userId = req.user.userId;
  console.log("output->当前用户 userId:", userId);

  // 确保 userId 是有效的 ObjectId
  let objectIdUserId;
  try {
    objectIdUserId = new mongoose.Types.ObjectId(userId);
  } catch (err) {
    return res.json({
      code: 1,
      message: "无效的用户ID",
    });
  }

  AccountsModel.find({ userId: objectIdUserId })
    .sort({ _id: -1 }) // 按创建时间降序，最新的账单排在最前面
    .then((results) => {
      res.json({
        code: 0,
        message: "获取账单列表成功",
        data: results,
      });
    })
    .catch((err) => {
      console.error("获取账单列表失败:", err);
      res.json({
        code: 1,
        message: "获取账单列表失败，服务器错误",
      });
    });
});

/**
 * 更新账单接口
 */
router.post("/update", function (req, res, next) {
  const { _id, amount, type, category, date, notes } = req.body;
  // 利用中间件checkLoginWare，解析 token 后获取 userId，不再依赖前端传递
  const userId = req.user.userId;

  // 确保 userId 和 _id 是有效的 ObjectId
  let objectIdUserId, objectId;
  try {
    objectIdUserId = new mongoose.Types.ObjectId(userId);
    objectId = new mongoose.Types.ObjectId(_id);
  } catch (err) {
    return res.json({
      code: 1,
      message: "无效的ID参数",
    });
  }

  AccountsModel.findOneAndUpdate(
    { _id: objectId, userId: objectIdUserId }, // 确保只能更新自己的账单
    { amount, type, category, date, notes },
    { new: true }, // 返回更新后的文档
  )
    .then((updatedAccount) => {
      if (updatedAccount) {
        res.json({
          code: 0,
          message: "更新账单成功",
          data: updatedAccount,
        });
      } else {
        res.json({
          code: 1,
          message: "未找到对应的账单或无权限更新",
        });
      }
    })
    .catch((err) => {
      console.error("更新账单失败:", err);
      res.json({
        code: 1,
        message: "更新账单失败，服务器错误",
      });
    });
});

/**
 * 删除账单接口
 */
router.post("/delete", function (req, res, next) {
  const { _id } = req.body;
  // 利用中间件checkLoginWare，解析 token 后获取 userId，不再依赖前端传递
  const userId = req.user.userId;

  // 确保 userId 和 _id 是有效的 ObjectId
  let objectIdUserId, objectId;
  try {
    objectIdUserId = new mongoose.Types.ObjectId(userId);
    objectId = new mongoose.Types.ObjectId(_id);
  } catch (err) {
    return res.json({
      code: 1,
      message: "无效的ID参数",
    });
  }

  AccountsModel.findOneAndDelete({ _id: objectId, userId: objectIdUserId }) // 确保只能删除自己的账单
    .then((deletedAccount) => {
      if (deletedAccount) {
        res.json({
          code: 0,
          message: "删除账单成功",
        });
      } else {
        res.json({
          code: 1,
          message: "未找到对应的账单或无权限删除",
        });
      }
    })
    .catch((err) => {
      console.error("删除账单失败:", err);
      res.json({
        code: 1,
        message: "删除账单失败，服务器错误",
      });
    });
});

module.exports = router;
