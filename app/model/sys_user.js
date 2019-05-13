'use strict';
var dateFormat = require('dateformat');

module.exports = app => {
  const { STRING, DATE } = app.Sequelize;
  const SysUser = app.model.define('sys_user', {
    id: {
      type:  STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type:  STRING(10),
      allowNull: false
    },
    user_name: {
      type:  STRING(20),
      allowNull: false
    },
    password: {
      type:  STRING(35),
      allowNull: false
    },
    token: {
      type:  STRING(35),
      allowNull: true
    },
    created_time: {
      type:  DATE,
      allowNull: false,
      get() {
        if(this.getDataValue('created_time')){
          return dateFormat(this.getDataValue('created_time').toString(), "yyyy-mm-dd HH:MM:ss")
        }else{
          return this.getDataValue('created_time')
        }
      }
    },
    token_time: {
      type:  DATE,
      allowNull: true,
      get() {
        if(this.getDataValue('token_time')){
          return dateFormat(this.getDataValue('token_time').toString(), "yyyy-mm-dd HH:MM:ss")
        }else{
          return this.getDataValue('token_time')
        }
      }
    },
    is_delete: {
      type:  STRING(1),
      allowNull: true,
      defaultValue: '0'
    }
  },{
    tableName: 'sys_user',
    freezeTableName: true,
    timestamps: false,
  });

  SysUser.associate = function() {
    app.model.SysUser.belongsToMany(app.model.SysGroup, {
      as:"user",
      through: app.model.SysUserGroup,
      foreignKey: 'group_id',
    });
  };

  return SysUser;

};