const redis = uniCloud.redis()

module.exports = {
    trigger: {
        afterRead: async function({
            isEqualToJql,
            clientInfo
        } = {}) {
            if (clientInfo.clientIP == '127.0.0.1') return
            await redis.hincrby('click', 'link', 1)
        }
    }
}