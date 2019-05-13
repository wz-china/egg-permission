'use strict';
const dateFormat = require("dateformat")

module.exports = app => {
  const { STRING ,INTEGER,DATE} = app.Sequelize;

  const SysGroup = app.model.define('sys_group', {
    id: {
      type: STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: STRING(10),
      allowNull: false
    },
    orders: {
      type: INTEGER(11),
      defaultValue: 0
    },
    father_id: {
      type: STRING(35),
      allowNull: false,
      defaultValue: '0'
    },
    level: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '0'
    },
    is_delete: {
      type: STRING(1),
      allowNull: false,
      defaultValue: '0'
    },
    created_time: {
      type: DATE,
      allowNull: true,
      get() {
        if(this.getDataValue('created_time')){
          return dateFormat(this.getDataValue('created_time').toString(), "yyyy-mm-dd HH:MM:ss")
        }else{
          return this.getDataValue('created_time')
        }
      }
    }
  },{
    tableName: 'sys_group',
    freezeTableName: true,
    timestamps: false,
  })

  SysGroup.associate = function() {
    app.model.SysGroup.belongsToMany(app.model.SysUser, {
      as:"user",
      through: app.model.SysUserGroup,
      foreignKey: 'group_id',
    });

    app.model.SysGroup.belongsToMany(app.model.SysPermissionModule, {
      as:"module",
      through: app.model.SysGroupModule,
      foreignKey: 'group_id',
    });
  };
  return SysGroup;
};