module.exports = async(args, db, env, ctx) => {
    db.collection('link-audit').doc(args.id).update({
        status: 1,
        tip: '待审核...'
    })
}