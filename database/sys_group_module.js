/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_group_module', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    module_id: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    group_id: {
      type: DataTypes.STRING(35),
      allowNull: false
    }
  }, {
    tableName: 'sys_group_module'
  });
};
