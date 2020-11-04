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
        expiresIn: 60 * 60
    }
}