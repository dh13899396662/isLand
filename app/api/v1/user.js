const bcrypt = require('bcryptjs')
const Router = require('koa-router')
const { RegisterValidator } = require('@validator')
const { User } = require('@models/user')
const { success } = require('@root/app/lib/helper')
const router = new Router({
    prefix: '/v1/user'
})

// 注册 新增数据 put get delete

router.post('/register', async (ctx) => {
    // 思维路径  接受参数 LinValidator校验
    // email password1 password2 nickname
    const v = await new RegisterValidator().validate(ctx)
    // const salt = bcrypt.genSaltSync(10) // 位数, 成本
    // const psw = bcrypt.hashSync(v.get('body.password2', salt))
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password2'),
        nickname: v.get('body.nickname')
    }
    await User.create(user)
    
    success()
})

module.exports = router