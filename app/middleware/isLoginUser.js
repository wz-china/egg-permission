/**
 * 用户登录鉴权
 */
module.exports = options => {
  return async function isLoginUser(ctx, next) {
    let user = await ctx.session.user
    let token = ctx.cookies.get('token',{ httpOnly: false, signed: false })
    if(token && user && user.token_time && (new Date(user.token_time).getTime() - new Date().getTime()) > 0){
      // 为请求的参数添加用户相关信息
      // Object.assign(ctx.request.body,{
      //   user_id:user.id,
      // })
      await next()
    }else{
      ctx.body = ctx.helper.response.error(6001)
      return
    }
  }
};