let uuid = require("uuid")
var dateFormat = require('dateformat');

module.exports = app => {
  return {
    create_id() {
      return uuid.v1().split("-").join("")
    },
    create_date(time){
      let date = new Date()
      if(time){
        date = time
      }
      return dateFormat(date, "yyyy-mm-dd HH:MM:ss")
    }
  };
};