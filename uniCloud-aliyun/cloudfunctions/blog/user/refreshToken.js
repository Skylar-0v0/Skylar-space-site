let getToken = require('.././utils/getToken.js')
module.exports = async (args, user, db, env) => {
  let token = await getToken(user, env)
  return token
}
