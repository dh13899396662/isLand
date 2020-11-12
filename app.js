const Koa = require('koa') // 引入koa
require('module-alias/register')
const InitManager = require('./core/init') // 项目初始配置
const parser = require('koa-bodyparser') // 解析koa 返回 ctx.body
require('./app/models/user') // 引入数据库初始化文件——没有创建数据库
const catchError = require('./middlewares/exception') // 引入自己封装的 报错捕捉
// const book = require('./api/v1/book')
// const classic = require('./api/v1/classic')

const app = new Koa() // 应用程序对象 中间件

app.use(parser())
app.use(catchError)
InitManager.initCore(app)

// app.use(book.routes())
// app.use(classic.routes())

app.listen(3000)