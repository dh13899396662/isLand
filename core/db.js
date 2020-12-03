const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
const { dbName, host, port, user, password } = require('../config/config').database
const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: false, // 终端打印创建表
    timezone: '+08:00',
    define: {
        // create_time update_time delete_time
        timestamps: false, // 是否禁用时间戳
        paranoid: true,
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
        update_time: 'update_time',
        undescored: true, // 驼峰改为下划线
        scopes: {
            bh: {
              attributes: {
                exclude: ['updated_at', 'deleted_at', 'created_at']
              }
            }
          }
    }
})

sequelize.sync({
    // force: true
})

Model.prototype.toJSON = function () {
  let data = this.dataValues
  data = clone(this.dataValues)
  unset(data, ' update_at')
  unset(data, ' deleted_at')
  unset(data, ' created_at')
  if (isArray(this.exclude)) {
    this.exclude.forEach(value => {
      unset(data, value)
    })
  }
  return data
}

module.exports = {
    sequelize
}