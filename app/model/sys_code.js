'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const SysCode = app.model.define('sys_code', {
    id: {
      type: STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: STRING(10),
      allowNull: false
    },
    code: {
      type: STRING(10),
      allowNull: false
    }
  },{
    tableName: 'sys_code',
    freezeTableName: true,
    timestamps: false,
  })

  return SysCode;
};