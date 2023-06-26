let Core = require('@alicloud/pop-core')
const uniCaptcha = require('uni-captcha')
const redis = uniCloud.redis()
const env = {
    ACCESS_KEY_ID: 'LTAI5tEmHUPTRrhdmUY84Hit',
    ACCESS_KEY_SECRET: 'gLLPz6gfaNr1iRuI8tgdlNmBktIoc2'
}
module.exports = async(args, db, payload, ctx) => {
    let {
        email,
        scene,
        captcha
    } = args
    // 从redis中获取当前ip的邮件发送次数,如果超过20次,则不再发送
    let times = await redis.get(`email-send-times:${ctx.CLIENTIP}`)
    let limit = await redis.ttl(`email-send-times:${ctx.CLIENTIP}`)
    if (times > 20) {
        let h = Math.floor(limit / 3600)
        let m = Math.floor((limit - h * 3600) / 60)
        let s = limit - h * 3600 - m * 60
        throw Error(`当前ip发送邮件次数过多,请${h}小时${m}分钟${s}秒后再试`)
    }
    let user = await db.collection('uni-id-users').where({
        email
    }).get()
    if (!(scene == 'register' || scene == 'reset-pwd-by-email')) throw Error('Invalid request')
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
            subject: '来自Skylar的空间站点的验证码',
            toAddress: email,
            htmlBody: '<div><h1>' + code + '</h1></div>'
        }, {
            method: 'POST'
        })
        // 将redis中的当前ip的邮件发送次数+1,如果times不存在,则设置过期时间为1天
    if (times) {
        await redis.set(`email-send-times:${ctx.CLIENTIP}`, parseInt(times) + 1, 'EX', parseInt(limit))
    } else {
        await redis.set(`email-send-times:${ctx.CLIENTIP}`, 1, 'EX', 86400)
    }
    return {
        message: '验证码已发送'
    }
}