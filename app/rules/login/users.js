'use strict';

const rule = {
  username: [
    { required: true, message: '账号不能为空' },
    { min:5,message:"不能少于5"},
    { max:20,message:"不能长于20"},
    { type: 'string', message: '账号格式不正确' },
  ],
  password: [
    { required: true, message: '密码不能为空' },
    { type: 'string', message: '密码字段需要是字符串' },
    {
      validator(rule, value, callback, source, options) {
        const pattern = /^(?=.*[a-z])(?=.*\d)[^]{8,16}$/;
        if (pattern.test(value)) {
          callback(); // 验证通过
          return;
        }
        callback({ message: '密码最少包含一个字母、数字并且为8-16位' }); // 验证不通过
      },
    },
  ],
};
module.exports = rule;