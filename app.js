const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users')

const app = express();

// 后台接口路由
const router = require("./routes/index");
console.log("output->router", router);

console.log("output->我来测试路径111", __dirname); // 当前文件目录
console.log("output->我来测试路径444", __filename); // 当前文件路径，会加上自身文件名
console.log("output->我来测试路径222", path.join(__dirname, "dist"));
console.log(
  "output->我来测试路径333",
  path.join(__dirname, "dist", "index.html"),
);

// 配置 CORS 跨域
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// api固定前缀。访问地址：/api/reg。拼接的是routes/api/reg.js文件中的路由
router(app);

// 排除 /api 的 SPA 回退（支持 History 模式）
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// // 跨域配置
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

module.exports = app;
