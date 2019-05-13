const Service = require('egg').Service;

class UserService extends Service{

  async query(body){
    return this.ctx.helper.response.success({
      token:"asdmniqr"
    })

  }


}
module.exports = UserService;

