'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  validate: {
    enable: true,
    package: 'egg-validate-plus',
  },

  //helper插件，把extend里面的helper分解出来到helpeer文件夹下
  helper :{
    enable: true,
    package: 'egg-helper',
  },

  //session
  sessionRedis : {
    enable: true,
    package: 'egg-session-redis',
  },

  //redis
  redis :{
    enable: true,
    package: 'egg-redis',
  },

  cors :{
    enable: true,
    package: 'egg-cors',
  },

  alinode: {
    enable: true,
    package: 'egg-alinode',
    env:"prod"
  },


};
