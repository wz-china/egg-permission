const Service = require('egg').Service;
const dateFormat = require("dateformat")

class LoginService extends Service{

  async search(where){
    const {ctx} = this
    try{
      var user = await ctx.model.SysUser.findAll({
        raw:true,
        where
      })
      return user
    }catch (err){
      ctx.logger.error(err)
      return null
    }
  }

  async update_token(data,where){
    const {ctx} = this
    try{
      var user = await ctx.model.SysUser.update(data,where)
      return user
    }catch (err){
      ctx.logger.error(err)
      return null
    }
  }

  async loginIn(data){
    const {ctx} = this
    var user = await this.search({
      user_name:data.username,
      password:ctx.helper.password.encrypt(data.password)
    })
    if(user && user.length > 0){    //用户存在
      var token = ctx.helper.tool.create_id()
      var token_time = dateFormat(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), "yyyy-mm-dd HH:MM:ss")
      var update = await this.update_token({
        token:token,
        token_time:token_time
      },{
        where:{id:user[0].id}
      })
      if(update){
        //存储session里面
        ctx.session.user = {
          id:user[0].id,
          token:token,
          token_time:token_time
        }
        return ctx.helper.response.success({
          token:token,
          user_name: user[0]["user_name"],
          uuid: user[0]["id"],
          name: user[0]["name"]
        })
      }else{
        return ctx.helper.response.error({msg:"刷新token失败"})
      }
    }else{            //用户不存在
      console.log(1111)
      return ctx.helper.response.error(4003)
    }
  }

}
module.exports = LoginService;

