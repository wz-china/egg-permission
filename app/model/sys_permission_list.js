
module.exports = app => {
  const { STRING } = app.Sequelize;

  const SysPermissionList = app.model.define('sys_permission_list', {
    id: {
      type: STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: STRING(10),
      allowNull: false
    },
    module_id: {
      type: STRING(35),
      allowNull: false
    },
    code: {
      type: STRING(50),
      allowNull: false
    }
  },{
    tableName: 'sys_permission_list',
    freezeTableName: true,
    timestamps: false,
  })

  return SysPermissionList;
};