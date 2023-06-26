let checkDate = require('.././utils/checkDate.js')

module.exports = async (args, user, db, env) => {
  if (!(await checkDate('messageTime', user, db))) {
    throw Error('今日留言次数已用完')
  }
  let message = {
    sender: user._id,
    message: args.message,
    public: true,
    createdAt: Date.now()
  }
  let id = await db.collection('messages').add(message)
  db.collection('blog').doc('main').update({
    messages: db.command.inc(1)
  })
  message._id = id.id
  return message
}
