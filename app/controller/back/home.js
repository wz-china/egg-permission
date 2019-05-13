'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx ,app} = this;
    let body = ctx.request.body
    let address = ctx.params.address
    //参数校验
    let vali_param = await ctx.validate(`back.home`,body)
    if(!vali_param) return

    //业务逻辑处理
    var which_service = body.class
    var exec_class = ""
    if(which_service.indexOf("_")  == -1){
      exec_class = which_service
    }else{
      let temp_arr = which_service.split("_")
      exec_class = temp_arr[0] + temp_arr[1].slice(0, 1).toUpperCase() + temp_arr[1].slice(1)
    }
    let response = await eval(`ctx.service.${exec_class}.${body.type}(body)`)
    console.log(exec_class)
    ctx.body =response;
  }
}

module.exports = HomeController;
