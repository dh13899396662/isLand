const util = require('util')
const axios = require('axios')
const { User } = require('../models/user')
const { generateToken } = require('../../core/util')
const { Auth } = require('../../middlewares/auth')
class WXManager {
    static async codeToToken (code) {
        // email password
        // code 小程序生成 微信
        // openid 唯一标识 鉴定

        // code appid appsecret
        const url = util.format(global.config.wx.loginUrl, global.config.wx.appId, global.config.wx.appSecret, code)

        const result = await axios.get(url)
        if (result.status !== 200) {
            throw new global.errs.AuthFaild('openid获取失败')
        }
        const errcode = result.data.errcode
        const errmsg = result.data.errmsg
        if (errcode) { // 腾讯的接口 成功不返回errCode，失败会返回
            throw new global.errs.AuthFaild('openid获取失败: ' + errmsg)
        }

        let user = await User.getUserByOpenid(result.data.openid)
        if (!user) {
            user = await User.registerByOpenid(result.data.openid)
        }

        return generateToken(user.id, Auth.USER)
    }
}

module.exports = {
    WXManager
}