const fs = require("fs")
let db = uniCloud.database({
    throwOnNotFound: false
})
const uniID = require('uni-id-common')

exports.main = async(event, context) => {
    try {
        let {
            api,
            type,
            args,
            uniIdToken
        } = event
        let payload = null
        try { // 身份权限判断
            if (type === "visitor") { // 游客调用
                throw 0
            } else if (type === "fun") { // 云端内部调用
                if (context.SOURCE !== 'function') throw Error('Invalid request')
                throw 0
            }
            const uniIDIns = uniID.createInstance({
                context: context,
            })
            payload = await uniIDIns.checkToken(uniIdToken)
            if (payload.code) throw Error(payload.message)
            if (type === "user") { // 普通用户调用
                throw 0
            } else if (type === "admin") { // 管理员调用
                if (payload.role.some(item => item === 'admin')) throw Error('Invalid request')
                throw 0
            }
            throw Error('Invalid request')
        } catch (err) { //如果 err 是 0 则正常执行业务代码，否则继续向外抛出错误
            if (err) {
                throw Error(err)
            } else {
                let Files = fs.readdirSync(`${__dirname}/${type}`)
                let Fun = {}
                Files.map((filename) => {
                    let name = filename.replace(".js", "")
                    Object.defineProperty(Fun, name, {
                        value: require(`./${type}/${filename}`)
                    })
                })
                if (typeof Fun[api] !== "function") throw Error("Invalid api")
                let data = await Fun[api](args, db, payload, context)
                return {
                    success: true,
                    data
                }
            }
        }
    } catch (err) {
        console.log(err)
        return {
            success: false,
            errorMessage: err.message
        }
    }
}