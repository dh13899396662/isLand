const Router = require('koa-router')
const { TokenValidator, NotEmptyValidator } = require('@validator')
const { LoginType } = require('@root/app/lib/enum')
const { User } = require('@models/user')
const { generateToken } = require('@root/core/util')
const { Auth } = require('@root/middlewares/auth')
const { WXManager } = require('@root/app/services/wx')
const router = new Router({
    prefix: '/v1/token'
})

router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    let token
    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL:
            token = await emailLogin(v.get('body.account'), v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM:
            token = await WXManager.codeToToken(v.get('body.account'))
            break;
            default:
                throw new global.errs.ParameterException('没有相应处理')
    }
    ctx.body = {
        token
    }
})

router.post('/verify', async (ctx) => {
     const v = await new NotEmptyValidator().validate(ctx)
     const result = Auth.verifyToken(v.get('body.token'))
     ctx.body = {
        is_valid: result
     }
})

async function emailLogin(account, secret) {
    const result = await User.verifyEmailPassword(account, secret)
    return generateToken(result.id, Auth.USER)
}

module.exports = router