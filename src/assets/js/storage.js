/*
    storage 主要放项目中的storage相关操作：存取等
*/
var storage = {
  /**
   对本地数据进行操作的相关方法，如localStorage,sessionStorage的封装
   */
  setStorage: function (key, value, duration) {
    var data = {
      value: value,
      expiryTime: !duration || isNaN(duration) ? 0 : this.getCurrentTimeStamp() + parseInt(duration)
    };
    localStorage[key] = JSON.stringify(data);
  },
  getStorage: function (key) {
    var data = localStorage[key];
    if (!data || data === "null") {
      return null;
    }
    var now = this.getCurrentTimeStamp();
    var obj;
    try {
      obj = JSON.parse(data);
    } catch (e) {
      return null;
    }
    if (obj.expiryTime === 0 || obj.expiryTime > now) {
      return obj.value;
    }
    return null;
  },
  removeStorage: function (key) {
    localStorage.removeItem(key);
  },
  getSession: function (key) {
    return sessionStorage.getItem(key) || '';
  },
  setSession: function (key, value) {
    sessionStorage.setItem(key, value)
  },
  getCurrentTimeStamp: function () {
    return Date.parse(new Date());
  }
};
export default storage;
