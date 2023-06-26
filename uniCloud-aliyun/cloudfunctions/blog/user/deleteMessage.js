module.exports = async (args, user, db, env) => {
  let data = await db.collection('messages').doc(args._id).get()
  if (data.data[0].sender != user._id) {
    throw Error('删除失败')
  }
  db.collection('blog').doc('main').update({
    messages: db.command.inc(-1)
  })
  return await db.collection('messages').doc(args._id).remove()
}
