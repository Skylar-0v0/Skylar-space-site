module.exports = async (args, user, db, env) => {
  let {
    nickname
  } = args
  let nick = await db.collection('users').where({
    nickname
  }).get()
  if (nick.data[0]) {
    throw Error('该昵称已被使用')
  }
  await db.collection('users').doc(user._id).update({
    nickname
  })
}
