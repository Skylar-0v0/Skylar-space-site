let jwt = require('jsonwebtoken')
module.exports = async (user, env) => {
  let time = 604800000
  let role = user.role ? user.role : ''
  return jwt.sign({
    user: user._id,
    role
  }, env.ADMIN_SECRET, {
    expiresIn: time
  })
}
