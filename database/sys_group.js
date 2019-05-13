/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_group', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    father_id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      defaultValue: '0'
    },
    level: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '0'
    },
    is_delete: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '0'
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    orders: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'sys_group'
  });
};
