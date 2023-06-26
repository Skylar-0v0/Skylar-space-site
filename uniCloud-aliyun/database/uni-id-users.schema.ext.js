const db = uniCloud.database()
module.exports = {
  trigger: {
    beforeUpdate: async function({
      collection,
      operation,
      updateData,
      clientInfo
    } = {}) {
      const dbJQL = uniCloud.databaseForJQL({
        clientInfo,
        skipTrigger: true
      })
      if (updateData.nickname) {
        let res = await dbJQL.collection('uni-id-users').where({
          nickname: updateData.nickname
        }).field('nickname').get()
        if (res.data[0]) throw Error('该昵称已被使用')
      }
    }
  }
}
