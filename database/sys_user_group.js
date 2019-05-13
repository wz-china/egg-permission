/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_user_group', {
    id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(35),
      allowNull: false,
      references: {
        model: 'sys_user',
        key: 'id'
      }
    },
    group_id: {
      type: DataTypes.STRING(35),
      allowNull: true,
      references: {
        model: 'sys_group',
        key: 'id'
      }
    }
  }, {
    tableName: 'sys_user_group'
  });
};
