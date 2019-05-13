/**
 * 传递参数解密
 */
let json_sort = require("jsonkeysort")
let md5 = require("md5")

module.exports = options => {
  return async function isEncryption(ctx, next) {
    let req_body = ctx.request.body
    let user = await ctx.session.user
    let token = ctx.cookies.get('token',{ httpOnly: false, signed: false })
    let none_str = req_body.none_str
    if (none_str) {
      delete req_body.none_str
      let str = json_sort.objKeySort(req_body) + "&token=" + token
      if (md5(str) == none_str) {
        req_body.user_id = user.id
        Object.assign(ctx.request.body,req_body)
        await next()
      } else {
        ctx.body = ctx.helper.response.error(4040,err)
        return
      }
    } else {
      ctx.body = ctx.helper.response.error(4040,err)
      return
    }
  }
};