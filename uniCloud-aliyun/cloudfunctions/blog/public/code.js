let Core = require('@alicloud/pop-core')
module.exports = async(args, db, env) => {
    let {
        email,
        type
    } = args
    if (!(type == 'Registration' || type == 'Reset')) {
        throw Error('无效类型')
    }
    let user = await db.collection('users').where({
        email
    }).get()
    if (type == 'Registration' && user.data[0]) {
        throw Error('邮箱已注册')
    } else if (type == 'Reset' && !user.data[0]) {
        throw Error('邮箱未注册')
    }
    let code = ''
    for (let index = 0; index < 6; index++) {
        code = code + Math.floor(Math.random() * 10)
    }
    res = await db.collection('code').doc(email).get()
    if (res.data[0]) {
        await db.collection('code').doc(email).update({
            code,
            createdAt: Date.now()
        })
    } else {
        await db.collection('code').add({
            _id: email,
            code,
            createdAt: Date.now()
        })
    }
    let ali = new Core({
        accessKeyId: env.ACCESS_KEY_ID,
        accessKeySecret: env.ACCESS_KEY_SECRET,
        endpoint: 'https://dm.aliyuncs.com',
        apiVersion: '2015-11-23',
    });
    return await ali.request('SingleSendMail', {
        accountName: 'email@email.cyber0101.com',
        addressType: 1,
        replyToAddress: 'false',
        subject: '来自Skylar的日常小栈的验证码',
        toAddress: email,
        htmlBody: '<div><h1>' + code + '</h1></div>'
    }, {
        method: 'POST'
    });
}