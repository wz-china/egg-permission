const dateFormat = require("dateformat")

module.exports = app => {
  const { DATE,STRING } = app.Sequelize;

  const SysLog = app.model.define('sys_log', {
    id: {
      type: STRING(35),
      allowNull: false,
      primaryKey: true
    },
    create_time: {
      type: DATE,
      allowNull: true,
      get() {
        if(this.getDataValue('created_time')){
          return dateFormat(this.getDataValue('created_time').toString(), "yyyy-mm-dd HH:MM:ss")
        }else{
          return this.getDataValue('created_time')
        }
      }
    },
    info: {
      type: STRING(100),
      allowNull: true
    },
    user_id: {
      type: STRING(35),
      allowNull: true
    },
    interface: {
      type: STRING(50),
      allowNull: true
    },
    status: {
      type: STRING(1),
      allowNull: true,
      defaultValue: '0'
    },
    symbol: {
      type: STRING(50),
      allowNull: true,
      defaultValue: '0'
    },
    params: {
      type: STRING(200),
      allowNull: true
    }
  },{
    tableName: 'sys_log',
    freezeTableName: true,
    timestamps: false,
  })

  return SysLog;
};