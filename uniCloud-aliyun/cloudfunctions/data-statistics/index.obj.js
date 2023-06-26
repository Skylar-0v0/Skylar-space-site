// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const redis = uniCloud.redis()
const db = uniCloud.database()
const _ = db.command

module.exports = {
    _timing: async function() { // 每日统计访问信息
        let data_web_info
        let data_click
        let main_data
        let users
        let links
        await Promise.all([
            data_web_info = await redis.hmget('web_info', 'web_view', 'messages'),
            data_click = await redis.hmget('click', 'web', 'guestbook', 'link', 'development_log'),
            main_data = await db.collection('webInfo').doc('main').get(),
            users = await db.collection('uni-id-users').count(),
            links = await db.collection('link').count()
        ])
        let data = {
            _id: new Date().toISOString().slice(0, 10),
            web_view_count: parseInt(data_web_info[0]),
            messages_count: parseInt(data_web_info[1]),
            user_count: users.total - main_data.data[0].user_count,
            links_count: links.total - main_data.data[0].links_count,
            click: {
                web: parseInt(data_click[0]),
                guestbook: parseInt(data_click[1]),
                link: parseInt(data_click[2]),
                development_log: parseInt(data_click[3]),
            }
        }
        await Promise.all([
            await db.collection('webInfo').add(data),
            await db.collection('webInfo').doc('main').update({
                web_view_count: _.inc(data.web_view_count),
                messages_count: _.inc(data.messages_count),
                user_count: users.total,
                links_count: links.total,
                click: {
                    web: _.inc(data.click.web),
                    guestbook: _.inc(data.click.guestbook),
                    link: _.inc(data.click.link),
                    development_log: _.inc(data.click.development_log)
                }
            }),
            await redis.hmset('web_info', 'web_view', 0, 'messages', 0),
            await redis.hmset('click', 'web', 0, 'guestbook', 0, 'link', 0, 'development_log', 0)
        ])
    }
}