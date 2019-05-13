'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async index() {
    const { ctx ,app} = this;
    let vali_param = await ctx.validate('login.users',ctx.request.body)
    if(!vali_param) return
    let user = await ctx.service.login.loginIn(ctx.request.body)
    ctx.body = user;
  }
}
//需我

module.exports = LoginController;
