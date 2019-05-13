/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_permission_list', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    module_id: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'sys_permission_list'
  });
};
