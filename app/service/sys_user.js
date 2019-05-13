const Service = require('egg').Service;

class SysUserService extends Service {
  constructor(ctx) {
    super(ctx)
    this.all_group = []
    this.ctx = this.ctx
  }

  //只能查询同组和下属
  async query(body) {
    /**
     * 1. 先查询用户属于哪个组
     * 2. 查询这个组的子集
     * 3. 查询子集对应的用户集
     */
    try {
      var search = ""
      if(body.user_name){
        search = `where user_name like '%${body.user_name}%'`
      }
      if(body.name){
        if(search){
          search += ` and name like '%${body.name}%'`
        }else{
          search = `where name like '%${body.name}%'`
        }
      }

      var group_list = await this.ctx.model.SysUserGroup.findAll({
        attributes: ["group_id"],
        raw: true,
        where: {
          user_id: body.user_id
        }
      })
      if (group_list.length != 0) {
        var like_condition = ""
        group_list.forEach((item, index) => {
          if (index == group_list.length - 1) {
            like_condition += ` a.level like '%${item.group_id}%' or id = '${item.group_id}'`
          } else {
            like_condition += ` a.level like '%${item.group_id}%' or id = '${item.group_id}' or`
          }
        })

        var where = `select id from sys_group a where ${like_condition}`
        var content = `
        SELECT b.id,b.name,b.user_name,b.password from sys_user_group a 
        left join sys_user b on a.user_id=b.id 
        where a.group_id in (${where}) and b.is_delete = 0
        UNION ALL 
        SELECT a.id,a.name,a.user_name,a.password FROM sys_user a
        WHERE a.id NOT IN (SELECT user_id FROM sys_user_group) and a.is_delete = 0`

        var list = `select * from (${content}) a ${search} limit ${body.limit * body.offset},${body.limit}`
        var number_all = `select count(a.id) as total from (${content}) a ${search}`

        var group_res = await this.ctx.model.query(list, {type:'SELECT'})

        group_res.forEach(item => {
          item["password"] = this.ctx.helper.password.uncrypt(item["password"])
        })

        var number = await this.ctx.model.query(number_all, {type: 'SELECT'})

        return this.ctx.helper.response.success({
          query_list: group_res,
          total: number[0].total
        })
      } else {
        return this.ctx.helper.response.success([])
      }
    } catch (err) {
      return this.ctx.helper.response.error(4040, err)
    }
  }

  /**
   * 查询这个某个组对应的员工 + 可选员工
   * @param body
   * @returns {Promise.<*>}
   */
  async group_user(body) {
    var sql = `SELECT b.id,b.name FROM sys_user_group a LEFT JOIN sys_user b ON a.user_id = b.id WHERE a.group_id = '${body.group_id}' and is_delete = 0`
    var select_user = await this.ctx.model.query(sql, {type: 'SELECT'})

    var sql2 = `SELECT id,name FROM sys_user WHERE id NOT IN (SELECT user_id FROM sys_user_group) and is_delete = 0`
    var have_no_group = await this.ctx.model.query(sql2, {type:'SELECT'})

    return this.ctx.helper.response.success({
      selected: select_user,
      all: [...select_user, ...have_no_group]
    })
  }

  async add(body) {
    try{
      var id = this.ctx.helper.tool.create_id()
      var time = this.ctx.helper.tool.create_date()
      var res = await this.ctx.model.SysUser.create({
        id: id,
        created_time: time,
        user_name: body.user_name,
        password: this.ctx.helper.password.encrypt(String(body.password)),
        name: body.name
      })
      return this.ctx.helper.response.success(res)
    }catch (err){
      return this.ctx.helper.response.error(4040,err)
    }
  }

  async editor(body) {
    try{
      var res = await this.ctx.model.SysUser.update({
        user_name: body.user_name,
        name: body.name,
        password: this.ctx.helper.password.encrypt(String(body.password)),
      }, {
        where: {
          id: body.id
        }
      })
      return this.ctx.helper.response.success(res)
    }catch (err){
      return this.ctx.helper.response.error(4040,err)
    }

  }

  async del(body) {
    try{
      var res =await this.ctx.model.SysUser.update({
        is_delete: 1
      }, {
        where: {
          id: body.id
        }
      })
      return this.ctx.helper.response.success(res)
    }catch (err){
      return this.ctx.helper.response.error(4040,err)
    }
  }

  /**
   * 为用户添加组
   * @param body
   * @returns {Promise.<*>}
   */
  async add_group(body) {
    var insert_data = []
    var group_list = JSON.parse(body.group_list)
    if (group_list.length != 0) {
      group_list.forEach(item => {
        insert_data.push({
          id: this.ctx.helper.tool.create_id(),
          group_id: item,
          user_id: body.user
        })
      })
      var res = await this.ctx.model.SysUserGroup.bulkCreate(insert_data)
      return this.ctx.helper.response.success(res)
    } else {
      return this.ctx.helper.response.error(4008)
    }
  }

  /**
   * 查询用户的权限都有哪些
   */
  async query_module(body) {
    try {
      var res = await this.ctx.model.SysUserGroup.findAll({
        raw: true,
        attributes: ["group_id"],
        where: {
          user_id: body.user_id
        }
      })
      if (res.length > 0) {
        var group_list = []
        res.forEach(item => group_list.push("'" + item.group_id + "'"))
        var sql = `SELECT c.name,c.url,b.name,b.code FROM sys_group_module a LEFT JOIN sys_permission_list b ON a.module_id=b.id
                    LEFT JOIN sys_permission_module c ON c.id = b.module_id where a.group_id in (${group_list})`
        var module_list = await this.ctx.model.query(sql, {type: 'SELECT'})
        var deal_module = module_list.filter((cur,index,arr)=>{
          if(cur.url){return true}
        })
        return this.ctx.helper.response.success(deal_module)
      } else {
        return this.ctx.helper.response.success([])
      }
    } catch (err) {
      return send_res.errors(4040, err)
    }
  }
}

module.exports = SysUserService;
