const Sequelize = require('sequelize')
const { dbName, host, port, user, password } = require('../config/config').database
const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: false, // 终端打印创建表
    timezone: '+08:00',
    define: {
        // create_time update_time delete_time
        timestamps: false,
        paranoid: true,
        undescored: true, // 驼峰改为下划线
        scopes: {
            bh: {
              attributes: {
                exclude: ['updatedAt', 'deletedAt', 'createdAt']
              }
            }
          }
    }
})

sequelize.sync({
    // force: true
})

module.exports = {
    sequelize
}