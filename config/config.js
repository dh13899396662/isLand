module.exports = {
    env: 'dev',
    database: {
        dbName: '7yue',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: ''
    },

    security: {
        secretKey: 'abcdefg',
        expiresIn: 60 * 60 * 24 * 30
    },
    wx: {
        appId: 'wx3b501070e74761c3',
        appSecret: '48223f52f175bb4476dc6ebf5b62f675',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    }
}