const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')

const { LoginType } = require('../lib/enum')

class PositiveIntegerValidator extends LinValidator {
    constructor () {
        super()
        this.id = [
            new Rule('isInt', '需要是正整数', { min: 1 })
        ]
    }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
        new Rule('isEmail', '电子邮箱不符合规范，请输入正确的邮箱')
      ],
      this.password1 = [
        new Rule('isLength', '密码至少6个字符，最多32个字符', {
          min: 6,
          max: 32
        }),
        new Rule('matches', '密码不符合规范', "^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,20}$")
      ],
      this.password2 = this.password1,
      this.nickname = [
        new Rule('isLength', '昵称不符合长度规范', {
          min: 4,
          max: 32
        }),
      ]
  }

  validatePassword(vals) {
    const password1 = vals.body.password1
    const password2 = vals.body.password2
    if (password1 !== password2) {
      throw new Error('两个密码不一致')
    }
  }

  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email
      }
    })

    if (user) {
      throw new Error('邮箱已存在')
    }
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('isLength', '不符合账号规则', {
        min: 4,
        max: 32
      })
    ]
    this.secret = [
      // 1.可以为空 可以不传
      // 2.空 不为空
      // 是否必须传入
      // web 账号+密码
      // 登录 多元化 小程序 密码
      // 微信 打开小程序 合法用户

      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', {
        min: 6,
        max: 128
      })
    ] 
  }

  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error('type是必须参数')
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('type参数不合法')
    }
  }
}

class NotEmptyValidator extends LinValidator {
  constructor(msg, errorCode){
      super()
      this.token = [
        new Rule('isLength', '不允许为空', { min : 1 })
      ]
  }
}

function checkType(vals) {
  if (!vals.body.type) {
    throw new Error('type是必须参数')
  }
  if (!LoginType.isThisType(vals.body.type)) {
    throw new Error('type参数不合法')
  }
}

class LikeValidator extends PositiveIntegerValidator {
  constructor(msg, errorCode){
      super()
      this.validateType = checkType
  }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator
}