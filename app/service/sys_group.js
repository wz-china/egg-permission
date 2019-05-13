const Service = require('egg').Service;

class SysGroupService extends Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = this.ctx
    this.all_group = []
  }

  /**
   * 处理菜单成树形
   * @param new_data
   * @param father_id
   */
  circulData(new_data, father_id) {
    let i = this.all_group.length
    while (i > 0) {
      i--
      let json = {}
      if (this.all_group[i]["father_id"] == father_id) {
        json = {
          id: this.all_group[i]["id"],
          name: this.all_group[i]["name"],
          father_id: this.all_group[i]["father_id"],
          level: this.all_group[i]["level"],
          orders: this.all_group[i]["orders"],
          children: this.circulData([], this.all_group[i]["id"])
        }
        new_data.push(json)
      }
    }
    return new_data
  }

  async query(body) {
    // body.user_id = '55993460632e11e99de715d66409dc83'
    var res = await this.ctx.model.SysUserGroup.findAll({
      raw: true,
      attributes: ["group_id"],
      where: {
        user_id: body.user_id
      }
    })
    if (res.length != 0) {
      var id_list = "("
      var like_list = ""
      var group_list = []
      res.forEach((item, index) => {
        group_list.push(item.group_id)
        if (index == res.length - 1) {
          id_list += `'${item.group_id}')`
          like_list += `a.level like '%${item.group_id}%'`
        } else {
          id_list += `'${item.group_id}',`
          like_list += `a.level like '%${item.group_id}%'` + " or "
        }
      })
      var sql = `SELECT * FROM sys_group a WHERE is_delete=0 and ( id in ${id_list} or ${like_list}) order by orders DESC`
      var group_res = await this.ctx.model.query(sql, {type: 'SELECT'})
      this.all_group = group_res

      if (group_res.length != 0) {    //递归出来树结构
        var group = []
        group_list.forEach(item => {
          var group_json = this.circulData([], item)
          if (group_json.length == 0) {
            group = group_res
          } else {
            var father = this.all_group.find(each => each.id == group_json[0]["father_id"])
            var father_group = {
              id: father["id"],
              name: father["name"],
              father_id: father["father_id"],
              level: father["level"],
              orders: father["orders"],
              children: group_json
            }
            group.push(father_group)
          }
        })
        return this.ctx.helper.response.success(group)
      } else {
        return this.ctx.helper.response.success([])
      }
    } else {
      return this.ctx.helper.response.success([])
    }
  }

  async del(body) {
    try{
      let res = await this.ctx.model.SysGroup.update({
        is_delete: 1
      }, {
        where: {
          [this.ctx.model.Op.or]: [
            {id: body.id},
            {level: {[this.ctx.model.Op.like]: `%${body.id}`}}
          ]
        }
      })
      return this.ctx.helper.response.success(res)
    }catch (err){
      return this.ctx.helper.response.error(4040,err)
    }

  }

  async add(body) {
    try{
      var id = this.ctx.helper.tool.create_id()
      var time = this.ctx.helper.tool.create_date()
      var father_id = 0
      if (body.father_id) {
        var father_id = body.father_id
      }
      var res = await this.ctx.model.SysGroup.create({
        id: id,
        created_time: time,
        name: body.name,
        level: body.level,
        father_id: father_id,
        orders: body.orders
      })
      return this.ctx.helper.response.success(res)
    }catch (err){
      return this.ctx.helper.response.error(4040,err)
    }
  }

  async editor(body) {
    try{
      let res = await this.ctx.model.SysGroup.update({
        name: body.name,
        orders: body.orders
      }, {
        where: {id: body.id}
      })
      return this.ctx.helper.response.success(res)
    }catch (err){
      return this.ctx.helper.response.error(4040,err)
    }
  }

  /**
   * 为组保存用户
   * @param body
   * @returns {Promise.<*>}
   */
  async save_user(body) {
    var user_list = body.user_list
    if(user_list.length !=0){
      var insert_arr = []
      user_list.forEach(item=>{
        insert_arr.push({
          id:this.ctx.helper.tool.create_id(),
          user_id:item,
          group_id:body.group_id
        })
      })
      let transaction
      try {
        transaction = await this.ctx.model.transaction();
        await this.ctx.model.SysUserGroup.destroy({
          where: {
            group_id: body.group_id
          }
        })
        await this.ctx.model.SysUserGroup.bulkCreate(insert_arr)
        await transaction.commit()
        return this.ctx.helper.response.success([user_list.length])
      } catch (err) {
        await transaction.rollback();
        return this.ctx.helper.response.error(4040,err)
      }
    }else{
      var del = await info.sys_user_group.destroy({
        where: {
          group_id: body.group_id
        }
      })
      return []
    }
  }

}

module.exports = SysGroupService;
