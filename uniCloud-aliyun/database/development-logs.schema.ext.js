const redis = uniCloud.redis()

module.exports = {
    trigger: {
        afterRead: async function({
            isEqualToJql,
            clientInfo
        } = {}) {
            if (clientInfo.clientIP == '127.0.0.1') return
            if (isEqualToJql("db.collection('development-log').orderBy('createdAt', 'desc').get()")) {
                await redis.hincrby('click', 'development_log', 1)
            }
        }
    }
}