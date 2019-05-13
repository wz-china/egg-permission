
module.exports = app => {
  const {  STRING } = app.Sequelize;

  const SysGroupModule = app.model.define('sys_group_module', {
    id: {
      type: STRING(35),
      allowNull: false,
      primaryKey: true
    },
    module_id: {
      type: STRING(35),
      allowNull: false
    },
    group_id: {
      type: STRING(35),
      allowNull: false
    }
  },{
    tableName: 'sys_group_module',
    freezeTableName: true,
    timestamps: false,
  })

  return SysGroupModule;
};