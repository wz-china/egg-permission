const Service = require('egg').Service;

class CodeService extends Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = this.ctx
  }

  /**
   * 查询sys_code字典
   * @param body
   */
  async query_code(body){
    var res = await this.ctx.model.SysCode.findAll()
    return res
  }

}

module.exports = CodeService;
