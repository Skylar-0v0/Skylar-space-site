const fs = require("fs")
let publicFiles = fs.readdirSync(__dirname + "/public")
let userFiles = fs.readdirSync(__dirname + "/user")
let publicFun = {}
let userFun = {}
publicFiles.map((filename) => {
  let name = filename.replace(".js", "")
  Object.defineProperty(publicFun, name, {
    value: require("./public/" + filename)
  })
})
userFiles.map((filename) => {
  let name = filename.replace(".js", "")
  Object.defineProperty(userFun, name, {
    value: require("./user/" + filename)
  })
})
let db = uniCloud.database({
  throwOnNotFound: false
})
let env = require("./env.js")
const uniID = require('uni-id-common')

exports.main = async (event, context) => {
  try {
    let {
      api,
      args,
      uniIdToken
    } = event
    let data = {}
    if (!args.useToken) {
      data = await publicFun[api](args, db, env, context)
    } else {
      const uniIDIns = uniID.createInstance({
        context: context,
      })
      let payload = await uniIDIns.checkToken(uniIdToken)
      if (payload.code) throw Error(payload.message)
      data = await userFun[api](args, db, payload, {
        env,
        ctx: context
      })
    }
    return {
      success: true,
      data
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      errorMessage: error.message
    }
  }
}
