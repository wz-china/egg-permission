/**
 * 后端接口集合
 * @param app
 */
module.exports=app=>{
  const {isLoginUser,isEncryption} = app.middleware
  app.router.post('login','/back/login',app.controller.login.index);
  app.router.post('home','/back/:address', isLoginUser(),isEncryption(),app.controller.back.home.index);
}