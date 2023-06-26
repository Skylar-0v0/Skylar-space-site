// 删除云存储图片
module.exports = async (args, db, payload, ctx) => {
  // 判读角色是否为管理员
  if (payload.role.some(item => item === 'admin')) {
    // 删除云存储图片
    let res = await uniCloud.deleteFile({
      fileList: args.urls
    })
    return res
  }
}
