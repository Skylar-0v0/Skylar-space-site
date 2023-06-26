module.exports = async (args, user, db, env, ctx) => {
  if (!user.link) {
    throw Error('用户信息错误，请重新登陆')
  }
  return await db.collection('link-audit').doc(user.link).get()
}
