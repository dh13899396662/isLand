const { Sequelize, Model, Op } = require('sequelize')
  const { Favor } = require('@models/favor')
  
const { sequelize } = require('../../core/db')
class Comment extends Model {
    static async addComment (bookID, content) {
        const comment = await Comment.findOne({
            where: {
                book_id: bookID,
                content
            }
        })
        if (!comment) {
            return await Comment.create({
                book_id: bookID,
                content,
                nums: 1
            })
        } else {
            return await comment.increment('nums', { by: 1 })
        }
    }

    static async getComment (bookID) {
        const comment = await Comment.findOne({
            where: {
                book_id: bookID
            }
        })

        return comment
    }

    // toJSON () {
    //     return {
    //         nums: this.getDataValue('nums'),
    //         content: this.getDataValue('content')
    //     }
    // }
}

Comment.prototype.exclude = ['book_id', 'id']
Comment.init({
    content: Sequelize.STRING(12),
    nums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    book_id: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'comment'
})

module.exports = {
    Comment
}