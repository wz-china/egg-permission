/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_user', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    token_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_delete: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'sys_user'
  });
};
