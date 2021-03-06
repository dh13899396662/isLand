const { sequelize } = require('../../core/db')
const {
    Sequelize, Model, Op
} = require('sequelize')
const { Art } = require('./art')
class Favor extends Model {
    // 业务表
    static async like (art_id, type, uid) {
        // 1 添加记录
        // classic fav_nums
        // 数据库事务 => 保障数据一致性
        // ACID 原则性 一致性 隔离性 持久性
        const favor = await Favor.findOne({
            where: {
                art_id, type, uid
            }
        })
        if (favor) {
            throw new global.errs.LikeError()
        }

        return sequelize.transaction(async t => {
            await Favor.create({
                art_id, type, uid
            }, { transaction: t })
            const art = await Art.getData(art_id, type, false)
            await art.increment('fav_nums', { by: 1, transation: t })
        })

    }

    static async dislike (art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id, type, uid
            }
        })
        if (!favor) {
            throw new global.errs.DislikeError()
        }
        // Favor 表 favor 记录
        return sequelize.transaction(async t => {
            await favor.destroy({
                force: true,
                transaction: t
            })
            const art = await Art.getData(art_id, type, false)
            await art.decrement('fav_nums', { by: 1, transaction: t })
        })
    }

    static async userLikeIt (art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id, type, uid
            }
        })
        return favor ? true : false
    }

    static async getMyClassicFavors(uid) {
        // type !== 400
        const arts = await Favor.findAll({
            where: {
                uid,
                type: {
                    [Op.not]: 400
                }
            }
        })
        if (!arts) {
            throw new global.errs.NotFound()
        }

        return await Art.getList(arts)
    }

    static async getBookFavor(uid, bookID) {
        const favorNums = Favor.count({
            where: {
                art_id: bookID,
                type: 400
            }
        })

        const myFavor = Favor.findOne({
            where: {
                art_id: bookID,
                uid,
                type: 400
            }
        })

        return {
            fav_nums: favorNums,
            like_statue: myFavor ? 1 : 0
        }
    }
}

Favor.init({
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'favor'
})

module.exports = { Favor }