let bcrypt = require('bcryptjs')
let getToken = require('.././utils/getToken.js')
module.exports = async (args, db, env, ctx) => {
  let type = args.type
  if (!(type == 'Login' || type == 'Registration' || type == 'Reset')) {
    throw Error('无效类型')
  }
  let user = await db.collection('users').where({
    email: args.email
  }).get()
  let token
  // 登陆
  if (type == 'Login') {
    if (!user.data[0]) {
      throw Error('用户未注册')
    }
    let check = await bcrypt.compare(args.password, user.data[0].hash)
    if (!check) {
      throw Error('密码错误')
    }
    if (user.data[0].ip != ctx.CLIENTIP) {
      user.data[0].ip = ctx.CLIENTIP
      db.collection('users').doc(user.data[0]._id).update({
        ip: ctx.CLIENTIP
      })
    }
    token = await getToken(user.data[0], env)
  } else {
    // 校验验证码
    let code = await db.collection('code').doc(args.email).get()
    if (!code.data[0]) {
      throw Error('未发送验证码')
    } else if (Date.now() - code.data[0].createdAt > 1800000) {
      throw Error('验证码已失效')
    } else if (code.data[0].code != args.code) {
      throw Error('验证码不正确')
    }
    // 注册
    if (type == 'Registration') {
      let nickname = await db.collection('users').where({
        nickname: args.nickname
      }).get()
      if (nickname.data[0]) {
        throw Error('该昵称已被使用')
      }
      let createdAt = Date.now()
      let hash = await bcrypt.hash(args.password, 10)
      user = {
        email: args.email,
        hash,
        nickname: args.nickname,
        createdAt,
        ban: false,
        ip: ctx.CLIENTIP,
        link: '',
        toDay: new Date().toDateString(),
        messageTime: 0
      }
      let id = await db.collection('users').add(user)
      user._id = id.id
      db.collection('blog').doc('main').update({
        users: db.command.inc(1)
      })
      token = await getToken(user, env)
      // 找回密码
    } else if (type == 'Reset') {
      let hash = await bcrypt.hash(args.password, 10)
      await db.collection('users').doc(user.data[0]._id).update({
        hash: hash
      })
      token = await getToken(user.data[0], env)
    }
  }
  return {
    token,
    user
  }
}
