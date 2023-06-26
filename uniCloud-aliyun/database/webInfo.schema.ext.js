const redis = uniCloud.redis()
const db = uniCloud.database()

module.exports = {
    trigger: {
        afterRead: async function({
            isEqualToJql,
            clientInfo
        } = {}) {
            if (clientInfo.clientIP == '127.0.0.1') return
            if (isEqualToJql("db.collection('webInfo').doc('main').field('web_view_count,messages_count,user_count,article').get()")) {
                let res = await redis.sadd('ip:' + clientInfo.clientIP, 'web')
                if (res) {
                    Promise.all([
                        await redis.hincrby('web_info', 'web_view', 1),
                        await redis.hincrby('click', 'web', 1)
                    ])
                } else {
                    await redis.hincrby('click', 'web', 1)
                }
                redis.expire('ip:' + clientInfo.clientIP, 21600)
            }
        }
    }
}