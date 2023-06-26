const db = uniCloud.database()
const redis = uniCloud.redis()

module.exports = {
    trigger: {
        afterRead: async function({
            clientInfo
        } = {}) {
            if (clientInfo.clientIP == '127.0.0.1') return
            await redis.hincrby('click', 'guestbook', 1)
        },
        beforeDelete: async function({
            where
        } = {}) {
            const id = where && where._id
            if (typeof id !== 'string') { // 此处也可以加入管理员可以批量删除的逻辑
                throw Error('禁止批量删除')
            }
            const res = await db.collection('messages').where(where).get()
            const record = res.data[0]
            if (record) {
                await db.collection('messages-archived').add(record)
            }
        },
        afterDelete: async function() {
            await redis.hincrby('web_info', 'messages', -1)
        },
        beforeCreate: async function({
            addDataList,
            userInfo
        } = {}) {
            let res = await redis.incr(`messages:${userInfo.uid}`)
            if (res == 1) {
                await redis.expire(`messages:${userInfo.uid}`, 3600)
            }
            if (res > 10) throw Error('您的留言太多了，请稍后再试')
            if (addDataList.length > 1) throw Error('禁止批量增加')
        },
        afterCreate: async function() {
            await redis.hincrby('web_info', 'messages', 1)
        }
    }
}