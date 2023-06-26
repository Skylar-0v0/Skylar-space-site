const db = uniCloud.database()
const redis = uniCloud.redis()

module.exports = {
    trigger: {
        afterRead: async function({
            field,
            where,
            clientInfo,
            userInfo
        } = {}) {
            if (userInfo && userInfo.role.indexOf('admin') > -1) return
                //如果field包含content字段，说明是获取文章详情，需要增加阅读量
            if (field && field.indexOf('content') > -1) {
                let res = await redis.sadd('ip:' + clientInfo.clientIP, where.title.operands[0])
                if (res) {
                    await db.collection('article-list').where(where).update({
                        view_count: db.command.inc(1),
                        click_count: db.command.inc(1)
                    })
                } else {
                    await db.collection('article-list').where(where).update({
                        view_count: db.command.inc(1)
                    })
                }
                redis.expire('ip:' + clientInfo.clientIP, 21600)
            }
        }
    }
}