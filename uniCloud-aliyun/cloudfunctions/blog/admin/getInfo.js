module.exports = async (args, db, env, ctx) => {
  return await db.collection(args.data).orderBy('_id', 'desc').get()
}
