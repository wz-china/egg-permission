var dateFormat = require("dateformat")
module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;

  const SysPermissionModule = app.model.define('sys_permission_module', {
    id: {
      type: STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: STRING(10),
      allowNull: false
    },
    level: {
      type: STRING(255),
      allowNull: false,
      defaultValue: '0'
    },
    url: {
      type: STRING(50),
      allowNull: true
    },
    father_id: {
      type: STRING(35),
      allowNull: true,
      defaultValue: '0'
    },
    is_delete: {
      type: STRING(1),
      allowNull: false,
      defaultValue: '0'
    },
    orders: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: 0
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
    tableName: 'sys_permission_module',
    freezeTableName: true,
    timestamps: false,
  })

  SysPermissionModule.associate = function() {
    app.model.SysPermissionModule.hasMany(app.model.SysPermissionList,{as:"list",foreignKey: 'module_id'})
    app.model.SysPermissionModule.belongsToMany(app.model.SysGroup, {
      as:"group",
      through: app.model.SysGroupModule,
      foreignKey: 'module_id',
    });
  };
  return SysPermissionModule;
};