const redis = uniCloud.redis()

async function update(db, where, field, inc) {
    await db.collection('blog').doc(where).update({
        [field]: db.command.inc(inc)
    })
}

module.exports = async(args, db, env, ctx) => {
    let {
        ip,
        where,
        field,
        sence,
        inc
    } = args
    try {
        let res = await redis.sadd('ip:' + ip, sence)
        if (!res && field == 'view_count') throw 0
        await update(db, where, field, inc)
    } catch (err) {
        if (err) console.log(err)
    } finally {
        redis.expire('ip:' + ip, 21600)
    }
}