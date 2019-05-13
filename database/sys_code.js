/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_code', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'sys_code'
  });
};
