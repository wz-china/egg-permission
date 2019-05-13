/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1557110582096_5847';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    SUPER_ID:1
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: "root",
    password: "qq709044233",
    port: 3306,
    database: 'egg_test',
    timezone: "+08:00",
  };

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      password:"",
      db:0
    },
    agent:true
  };

  config.sessionRedis = {
    name: 'session', // specific instance `session` as the session store
    key: "EGG_SESSION",
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: false
  };

  config.security ={
    csrf:{
      enable:false
    },
    domainWhiteList: ['http://127.0.0.1:8080']
  }

  config.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.logger = {
    outputJSON: true
  }

  return {
    ...config,
    ...userConfig,
  };
};
