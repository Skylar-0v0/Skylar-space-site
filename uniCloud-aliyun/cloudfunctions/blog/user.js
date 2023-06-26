const fs = require("fs")
let files = fs.readdirSync(__dirname + "/user")
let AdminFiles = fs.readdirSync(__dirname + "/admin")
let Fun = {}
let Admin = {}
files.map((filename) => {
  let name = filename.replace(".js", "");
  Object.defineProperty(Fun, name, {
    value: require("./user/" + filename),
  });
});
AdminFiles.map((filename) => {
  let name = filename.replace(".js", "");
  Object.defineProperty(Admin, name, {
    value: require("./admin/" + filename),
  });
});
module.exports = async (api, args, auth, db, env, ctx) => {
  let user = await db.collection('users').doc(auth.user).get()
  if (user.data[0].ban) {
    throw Error('账号被封禁')
  }
  if (args.ADMIN) {
    if (user.data[0]._id != '63c6a2e2e1a35ce43aa28932') throw Error('权限验证失败')
    if (api == 'verifyId') return true
    return await Admin[api](args, db, env, ctx)
  }
  if (user.data[0].ip != ctx.CLIENTIP) {
    user.data[0].ip = ctx.CLIENTIP
    db.collection('users').doc(user.data[0]._id).update({
      ip: ctx.CLIENTIP
    })
  }
  return await Fun[api](args, user.data[0], db, env, ctx)
}
