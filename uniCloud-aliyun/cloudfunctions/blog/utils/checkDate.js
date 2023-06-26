let maxTime = {
  messageTime: 5
}
module.exports = async (type, user, db) => {
  let toDay = new Date().toDateString()
  let data = {}
  let times = 0
  if (toDay != user.toDay) {
    data = {
      toDay,
      messageTime: 0
    }
  } else {
    times = user[type]
    data[type] = times
  }
  if (times < maxTime[type]) {
    data[type] = ++times
    await db.collection('users').doc(user._id).update(data)
    return true
  } else {
    return false
  }
}
