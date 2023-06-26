module.exports = async (args, db, env, ctx) => {
  if (ctx.SOURCE != 'function') throw Error('无效请求')
  db.collection('link-audit').doc(args.id).update({
    status: 1,
    tip: '待审核...'
  })
}
