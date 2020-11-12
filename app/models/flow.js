const {
    Sequelize,
    Model
  } = require('sequelize')
  
  const {
    sequelize
  } = require('../../core/db')
  
  class Flow extends Model {
  
  }
  
  Flow.init({
    index: Sequelize.INTEGER,
    artId: {
      type: Sequelize.INTEGER,
      field: 'art_id'
    },
    type: Sequelize.INTEGER
  }, {
    sequelize,
    tableName: 'flow' // 重命名
  })
  
  module.exports = {
    Flow
  }