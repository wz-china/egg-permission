const Service = require('egg').Service;

class SysPermissionService extends Service {
  constructor(ctx) {
    super(ctx)
    this.ctx = this.ctx
    this.all_group = []
    this.all_module = []
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
          children: this.circulData([], this.all_group[i]["id"])
        }
        new_data.push(json)
      }
    }
    return new_data
  }

  /**
   * 查询用户菜单
   * @param body
   */
  async query(body) {
    /**
     * father:树结构
     * children:含有url地址的
     */
    var father = await this.getUserModule(body)

    function dealKey(father) {
      var json = {
        menu_id: father.id,
        path: father.url,
        title: father.name,
      }
      if (father.list && father.list.length > 0) {
        json.children = []
        father.list.forEach(item => {
          if (item.id) {
            json.children.push(dealKey(item))
          }
        })
        if (json.children.length == 0) {
          delete json.children
        }
      }
      return json
    }

    var deal_father = []
    father.forEach(item => deal_father.push(dealKey(item)))

    //获取含有url的列表
    var user_group = await this.ctx.model.SysUserGroup.findAll({
      raw: true,
      attributes: ["group_id"],
      where: {
        user_id: body.user_id
      }
    })
    var group_list = []
    user_group.forEach(item => group_list.push("'" + item.group_id + "'"))
    var sql = ` SELECT c.id AS menu_id,c.name AS title,c.url AS path,c.father_id FROM sys_group_module a 
                LEFT JOIN sys_permission_list b ON a.module_id=b.id
                LEFT JOIN sys_permission_module c ON c.id = b.module_id
                WHERE a.group_id IN (${group_list}) GROUP BY c.url`

    var children = await this.ctx.model.query(sql, {type: 'SELECT'})
    return {
      father: deal_father,
      children: children,
    }
  }

  async del(body) {
    try {
      let res = await this.ctx.model.SysPermissionModule.update({
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
    } catch (err) {
      return this.ctx.helper.response.error(4040, err)
    }
  }

  async add(body) {
    var id = this.ctx.helper.tool.create_id()
    var time = this.ctx.helper.tool.create_date()
    var father_id = 0
    if (body.father_id) {
      var father_id = body.father_id
    }
    try {
      var res = await this.ctx.model.SysPermissionModule.create({
        id: id,
        created_time: time,
        name: body.name,
        level: body.level,
        father_id: father_id,
        url: body.url,
        orders: body.orders
      })
      return this.ctx.helper.response.success(res)
    } catch (err) {
      return this.ctx.helper.response.error(4040, err)
    }
  }

  async editor(body) {
    try {
      let res = await this.ctx.model.SysPermissionModule.update({
        name: body.name,
        orders: body.orders
      }, {
        where: {id: body.id}
      })
      return this.ctx.helper.response.success(res)
    } catch (err) {
      return this.ctx.helper.response.success(4040, err)
    }
  }

  /**
   * 批量插入权限
   */
  async insert_many_module_list(body) {
    var insert_data = body.insert_data
    var insert_data = ["117b9b9067d111e99962bbc8a4dd76cb"]
    if (insert_data.length == 0) {
      var res = await this.ctx.model.SysGroupModule.destroy({
        where: {
          group_id: body.group_id
        }
      })
      return this.ctx.helper.response.success(res)
    } else {
      var insert_arr = []
      insert_data.forEach(item => {
        insert_arr.push({
          id: this.ctx.helper.tool.create_id(),
          group_id: body.group_id,
          module_id: item
        })
      })
      let transction
      try {
        console.log(insert_arr)
        transction = await this.ctx.model.transaction();
        await this.ctx.model.SysGroupModule.destroy({
          where: {
            group_id: body.group_id
          }
        })
        await this.ctx.model.SysGroupModule.bulkCreate(insert_arr)
        await transction.commit()
        return this.ctx.helper.response.success(insert_arr.length)
      } catch (err) {
        console.log(err)
        await transction.rollback();
        return this.ctx.helper.response.error(4040, err)
      }
    }
  }

  /**
   * 获取全部模块，只有模块
   * @returns {Promise.<void>}
   */
  async _query_only_module() {
    var res = await this.ctx.model.SysPermissionModule.findAll({
      raw: true,
      where: {
        is_delete: 0
      }
    })
    this.all_module = res
  }

  /**
   * 向上递归获取父级
   * @param new_data
   * @param father_id
   * @returns {*}
   * @private
   */
  _circleUpData(module_item) {
    var temp = []
    var tree_json = {}
    var tree_arr = []
    module_item.forEach(item => {
      var index = temp.indexOf(item.level)
      if (index == -1) {    //未有
        tree_json[item.level] = [item]
        temp.push(item.level)
      } else {              //已有
        tree_json[item.level].push(item)
      }
    })

    for (var attr in tree_json) {
      var level = attr.split("-")
      level.splice(0, 1)
      var len = level.length
      if (len == 0) {
        tree_arr.push(tree_json[attr][0])
      } else if (len == 1) {
        var father = this.all_module.find(item => item.id == level[0])
        father.list = tree_json[attr]
        tree_arr.push(father)
      } else {
        var temp_json = []
        while (len > 0) {
          len--
          var father = this.all_module.find(item => item.id == level[len])
          if (len == level.length - 1) {
            temp_json.push({
              ...father,
              list: tree_json[attr]
            })
          } else {
            temp_json[0] = {
              ...father,
              list: [temp_json[0]]
            }
          }
        }
        tree_arr.push(temp_json[0])
      }
    }
    return tree_arr
  }

  /**
   * 获取用户当前的模块
   */
  async getUserModule(body) {
    /**
     * 1.查询用户属于那些组
     * 2.跟剧组查询所有list,
     * 3.根据list查询所有的module
     */
    if (body.group_id) {
      var group_list = [{group_id: body.group_id}]
    } else {
      var group_list = await this.ctx.model.SysUserGroup.findAll({
        raw: true,
        attributes: ["group_id"],
        where: {
          user_id: body.user_id
        }
      })
    }
    if (group_list.length != 0) {
      var group_temp = []
      group_list.forEach(item => group_temp.push(item.group_id))
      var module_list = await this.ctx.model.SysGroupModule.findAll({
        raw: true,
        attributes: ["module_id"],
        where: {
          group_id: {
            [this.ctx.model.Op.in]: group_temp
          }
        }
      })

      if (module_list.length != 0) {
        var module_temp = []
        module_list.forEach(item => module_temp.push(item.module_id))
        var permission_list = await this.ctx.model.SysPermissionModule.findAll({
          include: [
            {
              model: this.ctx.model.SysPermissionList,
              as: "list",
              attributes: [["id", 'list_id'], ["name", "name"]],
              where: {id: {[this.ctx.model.Op.in]: module_temp}}
            },
          ]
        })
        await this._query_only_module()
        //向上递归
        var tree = this._circleUpData(permission_list)
        return tree
      } else {
        return []
      }
    } else {
      return []
    }
  }


  /**
   * 获取组的权限
   * @param body
   * @returns {Promise.<void>}
   */
  async getGroupModule(body) {
    try {
      var res = await this.ctx.model.SysGroupModule.findAll({
        raw: true,
        attributes: ["module_id"],
        where: {
          group_id: body.group_id
        }
      })
      var result = []
      res.forEach(item => result.push(item.module_id))
      return this.ctx.helper.response.success(result)
    } catch (err) {
      return this.ctx.helper.response.error(4040, err)
    }
  }

  /**
   * 获取全部的模块
   * @param body
   * @returns {Promise.<*>}
   */
  async get_module(body) {
    try {
      //查询出来所有的模块 + 按钮权限
      var res = await this.ctx.model.SysPermissionModule.findAll({
        include: [
          {model: this.ctx.model.SysPermissionList, as: "list"}
        ],
        where: {
          is_delete: 0
        }
      })
      this.all_group = res
      //进行递归
      var module_lst = this.circulModuleData([], 0)
      return this.ctx.helper.response.success(module_lst)
    } catch (err) {
      return this.ctx.helper.response.error(4040, err)
    }
  }

  /**
   * 递归出来模块树
   * @param new_data
   * @param father_id
   * @returns {*}
   */
  circulModuleData(new_data, father_id) {
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
          url: this.all_group[i]["url"],
          list: this.all_group[i]["list"].length == 0 ? this.circulModuleData([], this.all_group[i]["id"]) : this.all_group[i]["list"]
        }
        new_data.push(json)
      }
    }
    return new_data
  }

  /**
   * 插入/更新按钮级别的模块
   * @param body
   */
  async insert_module_list(body) {
    if (body.which == "add") {
      var id = this.ctx.helper.tool.create_id()
      let transaction
      try {
        transaction = await this.ctx.model.transaction();
        await this.ctx.model.SysPermissionList.create({
          id: id,
          name: body.name,
          module_id: body.id,
          code: body.code
        })
        //为超级管理员加入该权限
        await this.ctx.model.SysGroupModule.create({
          id: this.ctx.helper.tool.create_id(),
          group_id: this.config.SUPER_ID,
          module_id: id
        })
        await transaction.commit()
        return this.ctx.helper.response.success({
          id: id,
          name: body.name,
          module_id: body.id,
          code: body.code
        })
      } catch (error) {
        await transaction.rollback();
        return this.ctx.helper.response.error(4040, error)
      }
    } else {
      try {
        var res = await this.ctx.model.SysPermissionList.update({
          name: body.name,
          code: body.code
        }, {
          where: {
            id: body.id
          }
        })
        return this.ctx.helper.response.success(res)
      } catch (err) {
        return this.ctx.helper.response.error(4040, err)
      }
    }

  }

  /**
   * 插入/更新模块
   * @param body
   * @returns {Promise.<*>}
   */
  async insert_module(body) {
    try {
      if (body.which == "add") {
        var res = await this.ctx.model.SysGroupModule.create({
          id: this.ctx.helper.tool.create_id(),
          name: body.name,
          level: body.level,
          father_id: body.father_id,
          created_time: this.ctx.helper.tool.create_date(),
          orders: body.orders,
        })
      } else {
        var res = await this.ctx.model.SysPermissionModule.update({
          name: body.name,
          orders: body.orders,
          url: body.url
        }, {
          where: {
            id: body.id
          }
        })
      }
      return this.ctx.helper.response.success(res)
    } catch (err) {
      return this.ctx.helper.response.error(4040, err)
    }
  }

  /**
   * 删除模块
   */
  async del_module(body) {
    if (body.which == "button") {   //按钮级别的
      //删除模块列表的
      let transaction
      try {
        transaction = await this.ctx.model.transaction();
        await this.ctx.model.SysPermissionList.destroy({
          where: {
            id: body.id
          }
        })
        await this.ctx.model.SysGroupModule.destroy({
          where: {
            module_id: body.id
          }
        })
        await transaction.commit()
        return this.ctx.helper.response.success([1])
      } catch (error) {
        await transaction.rollback();
        return this.ctx.helper.response.error(4040, error)
      }
    } else {        //菜单类型的
      /**
       * 1.删除模块
       * 2.删除权限
       */
      let transaction
      try {
        transaction = await this.ctx.model.transaction();
        await this.ctx.model.SysPermissionModule.update({
          is_delete: 1
        }, {
          where: {
            [this.ctx.model.Op.or]: {
              id: body.id,
              level: {[this.ctx.model.Op.like]: `%${body.id}%`}
            }
          }
        })
        await this.ctx.model.SysPermissionList.destroy({
          where: {
            module_id: body.id
          }
        })
        await transaction.commit()
        return this.ctx.helper.response.success([1])
      } catch (error) {
        await transaction.rollback();
        return this.ctx.helper.response.error(4040, error)
      }
    }
  }
}
module.exports = SysPermissionService;
