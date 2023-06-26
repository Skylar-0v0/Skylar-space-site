const redis = uniCloud.redis()

module.exports = {
    trigger: {
        afterRead: async function({
            collection,
            operation,
            where,
            isEqualToJql,
            clientInfo
        } = {}) {
            // let a = await data_statistics.add('hhh')
            // console.log(a)
            // await redis.hmset('web_info', 'web_view', 0, 'messages', 0),
            // await redis.hmset('click', 'web', 0, 'guestbook', 0, 'link', 0, 'development_log', 0)
            if (clientInfo.clientIP == '127.0.0.1') return
            if (isEqualToJql("db.collection('blog').doc('main').get()")) {
                uniCloud.callFunction({
                    name: 'blog-skylar',
                    type: 'fun',
                    data: {
                        api: 'webInfo',
                        args: {
                            ip: clientInfo.clientIP,
                            where: 'main',
                            field: 'view_count',
                            sence: 'blog',
                            inc: 1
                        }
                    }
                })
            }

        }
    }
}