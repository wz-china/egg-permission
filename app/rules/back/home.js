'use strict';

const rule = {
  type: [
    { required: true, message: '类型不能为空' },
  ],
  class:[
    { required: true, message: 'class不能为空' },
  ]
};
module.exports = rule;