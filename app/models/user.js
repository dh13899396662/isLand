const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')

class User extends Model {
    static async verifyEmailPassword (email, plainPassword) {
        const user = await User.findOne({
            where: { email }
        })
        if (!user) {
            throw new global.errs.NotFound('账号不存在')
        }

        const correct = await bcrypt.compare(plainPassword, user.password)
        if (!correct) {
            throw new global.errs.AuthFaild('密码不正确')
        }

        return user
    }
    
    static async getUserByOpenid(openid) {
        const user = await User.findOne({
            where: {
                openid
            }
        })
        return user
    }

    static async registerByOpenid(openid) {
        const user = await User.create({
            where: {
                openid
            }
        })
        return user
    }
}

User.init({
    //  主键 关系型数据库
    //  主键 : 不能重复 不能为空
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128), 
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10) // 位数, 成本
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    }, 
    openid: {
        type: Sequelize.STRING(64), 
        unique: true
    }
}, {
    sequelize,
    tableName: 'user'
})

module.exports = { User }