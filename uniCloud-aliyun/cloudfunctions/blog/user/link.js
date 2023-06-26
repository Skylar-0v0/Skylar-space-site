module.exports = async (args, user, db, env, ctx) => {
  if (!(args.type == 'new' || args.type == 'revise' || args.type == 'delete')) {
    throw Error('无效类型')
  }
  if (args.type == 'new' && user.link) {
    throw Error('无效类型')
  }
  if (args.type == 'revise' && !user.link) {
    throw Error('无效类型')
  }
  if (args.type == 'delete' && !user.link) {
    throw Error('无效类型')
  }
  if (args.type == 'delete') {
    await db.collection('link').doc(user.link).remove()
    await db.collection('link-audit').doc(user.link).remove()
    await db.collection('users').doc(user._id).update({
      link: ''
    })
    return {
      message: '删除成功'
    }
  }
  let link = {
    name: args.data.name,
    content: args.data.content,
    url: args.data.url,
    logo: args.data.logo,
    tip: '待审核'
  }
  if (args.type == 'new') {
    link.state = 'new'
    link.public = false
    let id = await db.collection('link-audit').add(link)
    await db.collection('users').doc(user._id).update({
      link: id.id
    })
    return {
      id: id.id,
      message: '提交成功，请等待审核'
    }
  } else if (args.type == 'revise') {
    link.state = 'revise'
    await db.collection('link-audit').doc(user.link).update(link)
    return {
      message: '提交成功，请等待审核'
    }
  }
}
