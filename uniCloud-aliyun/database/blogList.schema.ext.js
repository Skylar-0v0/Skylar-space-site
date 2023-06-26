const db = uniCloud.database()
const redis = uniCloud.redis()

function exp(ip) {
  redis.expire('ip:' + ip, 21600)
}
module.exports = {
  trigger: {
    afterRead: async function({
      collection,
      operation,
      where,
      clientInfo
    } = {}) {
      if (clientInfo.clientIP == '127.0.0.1') return
      if (where.subtitle) {
        let res = await redis.sadd('ip:' + clientInfo.clientIP, where.subtitle)
        if (!res) return exp(clientInfo.clientIP)
        await db.collection('blogList').where(where).update({
          view_count: db.command.inc(1)
        })
      }
    }
  }
}
