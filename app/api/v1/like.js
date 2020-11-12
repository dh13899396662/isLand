const Router = require('koa-router')
const { Auth } = require('@root/middlewares/auth')
const { LikeValidator } = require('@validator')
const { Favor } = require('@models/favor')
const { success } = require('@root/app/lib/helper')
const router = new Router({ prefix: '/v1/like' })

router.post('/', new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx, { id: 'art_id' })
    // uid就是鉴权后 返回的当前用户在user表里的 id
    await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
    success()
})

router.post('/cancel', new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx, { id: 'art_id' })
    // uid就是鉴权后 返回的当前用户在user表里的 id
    await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
    success()
})

module.exports = router