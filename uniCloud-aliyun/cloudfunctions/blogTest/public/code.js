let Core = require('@alicloud/pop-core')
const uniCaptcha = require('uni-captcha')
module.exports = async (args, db, env, ctx) => {
  let {
    email,
    scene,
    captcha
  } = args
  let user = await db.collection('uni-id-users').where({
    email
  }).get()
  if (!(scene == 'register' || scene == 'reset-pwd-by-email')) throw Error('无效类型')
  if (scene == 'register' && user.data[0]) throw Error('该邮箱已注册')
  if (scene == 'reset-pwd-by-email' && !user.data[0]) throw Error('该邮箱未注册')
  let res = await uniCaptcha.verify({
    scene: 'send-email-code',
    captcha
  })
  if (res.code) throw Error(res.message)
  let code = ''
  for (let index = 0; index < 6; index++) {
    code = code + Math.floor(Math.random() * 10)
  }
  await db.collection('opendb-verify-codes').add({
    email,
    scene,
    code,
    state: 0,
    ip: ctx.CLIENTIP,
    created_date: Date.now(),
    expired_date: Date.now() + 180000
  })
  let ali = new Core({
    accessKeyId: env.ACCESS_KEY_ID,
    accessKeySecret: env.ACCESS_KEY_SECRET,
    endpoint: 'https://dm.aliyuncs.com',
    apiVersion: '2015-11-23',
  })
  await ali.request('SingleSendMail', {
    accountName: 'email@email.cyber0101.com',
    addressType: 1,
    replyToAddress: 'false',
    subject: '来自Cyber的日常小栈的验证码',
    toAddress: email,
    htmlBody: '<div><h1>' + code + '</h1></div>'
  }, {
    method: 'POST'
  })
  return {
    message: '验证码已发送'
  }
}
