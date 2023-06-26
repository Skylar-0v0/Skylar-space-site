module.exports = async (args, db, env, ctx) => {
  for (let i of args.type) {
    await Fun[i](args, db)
  }
  return true
}

let Fun = {
  editTip: async (args, db) => {
    await db.collection('link-audit').doc(args._id).update({
      tip: args.tip
    })
  },
  pass: async (args, db) => {
    try {
      await db.collection('link').add(args.data)
    } catch {
      delete args.data._id
      await db.collection('link').doc(args._id).update(args.data)
    }
    await db.collection('link-audit').doc(args._id).update({
      state: 'pass'
    })
  },
  notPass: async (args, db) => {
    await db.collection('link-audit').doc(args._id).update({
      state: 'notPass'
    })
  },
  ban: async (args, db) => {
    await db.collection('link-audit').doc(args._id).update({
      state: 'ban'
    })
    await db.collection('link').doc(user.link).remove()
  }
}
