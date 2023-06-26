let jwt = require("jsonwebtoken")
const fs = require("fs")
let files = fs.readdirSync(__dirname + "/public")
let Fun = {}
files.map((filename) => {
  let name = filename.replace(".js", "");
  Object.defineProperty(Fun, name, {
    value: require("./public/" + filename),
  });
});
let db = uniCloud.database({
  throwOnNotFound: false
})
let env = require("./env.js")
let user = require("./user.js")
// const redis = uniCloud.redis()
const uniID = require('uni-id-common')

exports.main = async (event, context) => {
  try {
    let {
      api,
      args,
      token
    } = event
    let data = {}
    if (token) {
      let auth = jwt.verify(token.replace("Bearer ", ""), env.ADMIN_SECRET)
      data = await user(api, args, auth, db, env, context)
    } else {
      data = await Fun[api](args, db, env, context)
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
};
