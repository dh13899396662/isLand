const Koa = require('koa')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')
require('./app/models/user')
const catchError = require('./middlewares/exception')
// const book = require('./api/v1/book')
// const classic = require('./api/v1/classic')

const app = new Koa() // 应用程序对象 中间件

app.use(parser())
app.use(catchError)
InitManager.initCore(app)

// app.use(book.routes())
// app.use(classic.routes())

app.listen(3000)