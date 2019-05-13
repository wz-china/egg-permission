/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_permission_module', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    level: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '0'
    },
    url: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    father_id: {
      type: DataTypes.STRING(35),
      allowNull: true
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
    tableName: 'sys_permission_module'
  });
};
