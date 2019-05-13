const secret = "nivudsafsnseiurt89v43nvsvs854"
const crypto = require("crypto")

module.exports = app => {
  return {
    /**
     * 加密
     * @returns {string}
     */
    encrypt(str) {
      var cipher = crypto.createCipher("aes192", secret); //设置加密类型 和 要使用的加密密钥
      var enc = cipher.update(str, "utf8", "hex");    //编码方式从utf-8转为hex;
      enc += cipher.final("hex"); //编码方式从转为hex;
      return enc; //返回加密后的字符串
    },

    /**
     * 解密
     */
    uncrypt(str){
      var decipher = crypto.createDecipher("aes192", secret);
      var dec = decipher.update(str.toString(), "hex", "utf8");//编码方式从hex转为utf-8;
      dec += decipher.final("utf8");//编码方式从utf-8;
      return dec;
    }
  };
};