
module.exports = app => {
  return {
    /**
     * 成功返回体
     * @param data
     * @returns {Buffer | string}
     */
    success(data) {
      return {
        code:0,
        data:data
      }
    },

    /**
     * 失败的返回体
     * @param str
     * @returns {Buffer | string}
     */
    error(code,msg){
      let message = ""
      if(code == 4040){
        message = msg
      }else{
        message = this._code_list(code)
      }
      return {
        code:code,
        msg:message
      }
    },

    /**
     *  返回码
     * @param code
     * @private
     */
    _code_list(code){
      let message = ""
      switch (code) {
        case 4001:message = "参数错误，请检查";break
        case 4002:message = '缺少必要的参数';break
        case 4003:message = "账号或密码错误";break
        case 4004:message = "数据库更新失败";break
        case 4005:message = "用户名或账号重复";break
        case 4006:message = "暂无数据";break
        case 4007:message = "已有重复信息";break
        case 4008:message = "参数值不正确";break
        case 5001:message = "没有该方法";break
        case 5002:message = "事物处理执行失败";break
        case 5003:message = "请检查加密方式";break
        case 5004:message = "文件类型错误";break
        case 6001:message = "请重新登录";break
        case 7001:message = "获取云存储token失败";break
      }
      return message
    }
  };
};