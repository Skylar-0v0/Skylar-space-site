// 删除云存储图片
module.exports = async(args, db, payload, ctx) => {
    let res = await uniCloud.deleteFile({
        fileList: args.urls
    })
    return res
}