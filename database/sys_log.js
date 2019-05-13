/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_log', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    info: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    interface: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: '0'
    },
    symbol: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '0'
    },
    params: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'sys_log'
  });
};
