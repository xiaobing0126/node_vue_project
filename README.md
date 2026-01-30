# 2026/01/22 - My Node Project

This is my Node.js project created on January 22, 2026. It uses Express as the web framework and includes various dependencies for handling cookies, logging, and routing.

## 1.生成项目模板确保电脑已经安装了[express-generator](https://www.npmjs.com/package/express-generator)

To generate the project template, use the following command:

```bash
express -e my-node-project
```

## 2.安装依赖&&启动项目(nodemon是热更新插件，可选)

```bash
cd my-node-project
npm install
npm start
```

## 3.项目结构

```
my-node-project
├── app.js          // 应用程序的主要入口文件
├── bin
│   └── www         // 服务器启动脚本
├── package.json    // 项目配置文件，包含依赖和脚本
├── public          // 静态文件目录
├── routes          // 路由定义目录
└── views           // 视图模板目录
```

## 4.调试代码

### 使用nodemon进行热更新调试

在`package.json`中添加开发脚本（如已有则跳过）:

```json
"scripts": {
  "start": "node ./bin/www",
  "dev": "nodemon ./bin/www"
}
```

运行开发模式：

```bash
npm run dev
```

### 使用VS Code调试

1. 创建`.vscode/launch.json`配置文件：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/bin/www",
      "restart": true,
      "runtimeArgs": ["--inspect-brk"],
      "console": "integratedTerminal"
    }
  ]
}
```

2. 在代码中设置断点（点击行号旁）
3. 点击左侧的运行图标，选择“运行脚本： start”，然后点击绿色的播放按钮开始调试。终端会显示运行脚本的输出，注意查看。
4. 这时候发起请求，程序会在断点处暂停，可以查看变量值，单步执行等。
5. 注意：要调试的话，必须先停止原来的服务，不然会冲突。修改了代码，需要重新启动调试。

### 使用console.log调试

在代码中输出变量值：

```javascript
console.log("调试信息:", data); // 开发时使用
console.error("错误信息:", error); // 错误输出
```

### 开发准备

1. 安装mongodb数据库并启动（需要去官网下载并安装），安装完后安装mongoose模块管理mongodb数据库

mongoose是node.js操作mongodb数据库的一个模块，安装mongoose模块:

```bash
npm install mongoose --save
```

2. mongodb数据库启动:

```bash
macOs: brew services start mongodb-community
windows: net start MongoDB
```

3. 查看数据库是否启动

```bash
macOs: brew services list
```

其他中间件如：cookie-parser、morgan等在用express -e 生成项目的时候就已经安装，直接npm install就行。

4. 链接&&配置数据库

   在config/config.js中配置数据库链接信息

5. 创建数据库链接文件db/db.js

注意：数据库集合是惰性的，必须在插入数据时才会创建。

## 开发思路

1. 先开发注册&登陆接口
   - 启动mongodb数据库,链接数据库,注册成功,将用户数据写入数据库中。
   - 在www文件中链接数据库(引用db/db.js,config/config.js)，数据库链接成功后再启动服务器。
   - model文件夹中：创建集合&&创建集合规则
   - routes文件夹中：创建注册&登陆路由接口

     1.1 注册接口

   - 接收前端传递的用户名和密码
   - 查询数据库中是否存在该用户名
   - 如果存在，返回用户已存在
   - 如果不存在，将用户名和密码写入数据库，返回注册成功

     1.2 登陆接口

   - 接收前端传递的用户名和密码
   - 查询数据库中用户名和密码是否匹配
   - 如果不匹配，返回用户名或密码错误
   - 如果匹配，生成token，返回给前端
   - token生成：使用jsonwebtoken模块生成token
   - 安装jsonwebtoken模块:

   ```bash
   npm install jsonwebtoken --save
   ```

   - 创建utils/token.js文件，封装生成token和验证token的方法

2. 然后开发前端页面
   - 账单页面的增删改查
   - 先创建schema,然后创建model
   - routes文件夹中：创建账单路由接口
   - 创建routes/api/accounts.js文件，编写增删改查接口
   - 创建前端页面，使用fetch或axios调用接口

   ### 根据不同用户获取不同账单数据
   - 前端发起登录请求，后端会用jsonwebtoken生成token，包含用户的userId，时效
   - 前端拿到token后，在每次请求时携带token，放在请求头中
   - 利用中间件checkLoginWare，解析 token 后获取 userId，放在req对象中，供后续接口使用
   - 通过在token中存储userId，后端接口根据token解析出userId，查询对应用户的账单数据，确保数据隔离和安全。

3. 最后对接前后端
4. 部署上线
