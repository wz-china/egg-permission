'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const SysUserGroup = app.model.define('sys_user_group', {
    id: {
      type: STRING(35),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: STRING(35),
      allowNull: false
    },
    group_id: {
      type: STRING(35),
      allowNull: true
    }
  },{
    tableName: 'sys_user_group',
    freezeTableName: true,
    timestamps: false,
  })



  return SysUserGroup;
};