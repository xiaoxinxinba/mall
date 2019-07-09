import Vue from 'vue'
import router from '../../router';
import qs from "qs";
import Global from './global';

/**
 * 金钱格式化
 * @param money 钱(int)
 * @param digit 保留小数
 * @returns {*} 带小数格式的钱
 */
const fmoney = (money, digit) => {
  !digit ? digit = 2 : null;
  if (money && digit) {
    // console.log(money, digit);
    money = money.toFixed(digit);
    if (null === money) {
      return "";
    }
    money = money + "";
    let array = money.split(".");
    let s = array[0];
    let r = "";
    let m = s.substring(0, 1);
    if ('-' === m) {
      s = s.substring(1);
    } else {
      m = "";
    }
    let f = s.split("").reverse();
    for (let i = 0; i < f.length; i++) {
      r += f[i] + ((i + 1) % 3 === 0 && (i + 1) != f.length ? "," : "");
    }
    let after = "";
    if (array.length > 1) {
      after = array[1];
      if (after.length > digit) {
        after = after.substring(0, digit);
      }
    }
    return m + r.split("").reverse().join("") + (array.length > 1 ? "." + after : "");
  } else {
    return 0.00;
  }
};

/**
 * 时间处理附属，不满10自动添0
 * @param str
 * @param targetLength
 * @returns {*}
 */
const addZeros = (str, targetLength = 2) => {
  while (str.length < targetLength) {
    str = `0${str}`
  }
  return str
};

/**
 * 字符串时间转换成时间戳
 * @param dateStr 支持 2018-11-5 11:24:51 | 2018/11/5 11:24:54 | 2018-11-5T11:25:09.256Z
 * @returns {number} 时间戳
 */
const parseDate = (dateStr) => {
  const rShortMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/,
    rLongMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s*$/,
    rMaxMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2}).*\s*$/,
    rLedMatch = /^\s*(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s*$/;
  var match;

  if (match = dateStr.match(rShortMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3])
  } else if (match = dateStr.match(rLongMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6])
  } else if (match = dateStr.match(rMaxMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6])
  } else if (match = dateStr.match(rLedMatch)) {
    return +new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6])
  }
};

const getCurrentDate = (format = 'YYYY-MM-DD hh:mm:ss') => {
  const date = new Date(),
    year = `${date.getFullYear()}`,
    month = `${date.getMonth() + 1}`,
    day = `${date.getDate()}`,
    hours = `${date.getHours()}`,
    minutes = `${date.getMinutes()}`,
    seconds = `${date.getSeconds()}`,
    rMatch = /Y+|M+|D+|h+|m+|s+|S+/g;

  return format.replace(rMatch, match => {
    const len = match.length;

    switch (match[0]) {
      case 'Y':
        return year.slice(-len);
      case 'M':
        return addZeros(month).slice(-len);
      case 'D':
        return addZeros(day).slice(-len);
      case 'h':
        return addZeros(hours).slice(-len);
      case 'm':
        return addZeros(minutes).slice(-len);
      case 's':
        return addZeros(seconds).slice(-len)
    }
  })

}

/**
 * 时间戳转时间字符串
 * @param  {Number} timestamp js时间戳
 * @param  {String} format 输出格式
 * @return {String} Return format result 时间字符串
 */
const formatDate = (timestamp, format = 'YYYY-MM-DD hh:mm:ss') => {

  const date = new Date(timestamp),
    year = `${date.getFullYear()}`,
    month = `${date.getMonth() + 1}`,
    day = `${date.getDate()}`,
    hours = `${date.getHours()}`,
    minutes = `${date.getMinutes()}`,
    seconds = `${date.getSeconds()}`,
    rMatch = /Y+|M+|D+|h+|m+|s+|S+/g;

  return format.replace(rMatch, match => {
    const len = match.length;

    switch (match[0]) {
      case 'Y':
        return year.slice(-len);
      case 'M':
        return addZeros(month).slice(-len);
      case 'D':
        return addZeros(day).slice(-len);
      case 'h':
        return addZeros(hours).slice(-len);
      case 'm':
        return addZeros(minutes).slice(-len);
      case 's':
        return addZeros(seconds).slice(-len)
    }
  })
};

/**
 * 获取地址栏参数
 * @param name 参数名
 * @returns {*} value
 * @constructor
 */
const GetQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

/**
 * 计算机计算噪点误差修复
 * @type {{Add: (function(*, *): number), Sub: (function(*, *=): *), Mul: (function(*, *=): number), Div: (function(*, *=): number)}}
 */
const calc = {
  /*
  函数，加法函数，用来得到精确的加法结果
  说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  参数：numMap：要计算的数组['24.79', '0.72', 1.77]；d：保留默认小数，默认2位。
  调用：Calc.Add(numMap, d)
  返回值：多数相加的结果
  */
  Add: function (numMap, d) {
    if (numMap.length === 1) {
      return numMap[0]
    } else if (!numMap.length) {
      return 0;
    }
    d = d ? d : 2;
    var allMap = [], maxLen = 0, pow = 0;
    for (var i = 0; i < numMap.length; i++) {
      if (Object.prototype.toString.call(allMap[i]) !== '[object Object]') {
        allMap[i] = {
          num: '',
          numArr: '',
          d1: '',
        }
      }
      allMap[i].num = numMap[i].toString();
      allMap[i].numArr = allMap[i].num.split(".");
      allMap[i].d1 = allMap[i].numArr.length == 2 ? allMap[i].numArr[1] : "";
    }
    for (var i = 0; i < allMap.length; i++) {
      maxLen = maxLen.length > allMap[i].d1.length ? maxLen : allMap[i].d1;
    }
    maxLen = maxLen.length;
    pow = Math.pow(10, maxLen);
    var resNum = 0;
    for (var i = 0; i < allMap.length; i++) {
      resNum += allMap[i].num * pow;
    }
    var result = Number((resNum / pow).toFixed(maxLen));
    var d = arguments[d];
    return typeof d === "number" ? Number((result).toFixed(d)) : result;
  },
  /*
     函数：减法函数，用来得到精确的减法结果
     说明：函数返回较为精确的减法结果。
     参数：numMap：要计算的数组['24.79', '0.72', 1.77]；d：保留默认小数，默认2位。
     调用：Calc.Sub(numMap, d)
     返回值：两数相减的结果
  */
  Sub: function (numMap, d) {
    if (numMap.length === 1) {
      return numMap[0]
    } else if (!numMap.length) {
      return 0;
    }
    var addMap = [];
    for (var i = 0; i < numMap.length; i++) {
      addMap[i] = numMap[i];
      if (i > 0) {
        addMap[i] = -Number(numMap[i]);
      }
    }
    return Calc.Add(addMap, d);
  },

  /*
  函数：乘法函数，用来得到精确的乘法结果
  说明：函数返回较为精确的乘法结果。
  参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Mul(arg1,arg2)
  返回值：两数相乘的结果
  */
  Mul: function (numMap, d) {
    if (numMap.length === 1) {
      return numMap[0]
    } else if (!numMap.length) {
      return 0;
    }
    d = d ? d : 2;
    var resultVal, all = 0, dv = 0;
    for (var i = 0; i < numMap.length; i++) {
      let strNum = numMap[i].toString();
      dv += (strNum.split(".")[1] ? strNum.split(".")[1].length : 0)
      if (all === 0) {
        all = Number(strNum.replace(".", ""));
      } else {
        all *= Number(strNum.replace(".", ""));
      }
    }
    resultVal = all / Math.pow(10, dv);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  /*
  函数：除法函数，用来得到精确的除法结果
  说明：函数返回较为精确的除法结果。
  参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Div(arg1,arg2)
  返回值：arg1除于arg2的结果
  */
  Div: function (numMap, d) {
    if (numMap.length === 1) {
      return numMap[0]
    } else if (!numMap.length) {
      return 0;
    }
    d = d ? d : 2;
    var resultVal, all = 0, dv = 0;
    var sort = numMap.length;
    for (var i = 0; i < numMap.length; i++) {
      sort--;
      let strNum = numMap[i].toString();
      let sortStrNum = numMap[sort].toString();
      if (i === 0) {
        dv = (sortStrNum.split(".")[1] ? sortStrNum.split(".")[1].length : 0);
        all = Number(strNum.replace(".", ""));
      } else {
        dv -= (sortStrNum.split(".")[1] ? sortStrNum.split(".")[1].length : 0);
        all = all / Number(strNum.replace(".", ""));
      }
    }
    console.log(all, dv);
    resultVal = all * Math.pow(10, dv);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  }
};

/**
 * 合成图片地址
 */
const buildImgURL = (oldURL, width, height) => {
  let imgURL;
  imgURL = oldURL + '?x-oss-process=image/resize,m_lfit,w_' + width + ',h_' + height;
  return imgURL
};

/**
 * lw 根据名称获取路由地址
 * @param name 名称
 * @returns {string}
 */
const getRoutesPath = name => {
  let routes = router.options.routes;
  let path = '';
  routes.map(item => {
    name === item.name && (path = item.path)
  });
  return path;
};

/**
 * lw 750基数上的px自动转换
 * @param px
 * @returns {number}
 */
const winSize = px => {
  var docEl = document.documentElement;
  var clientWidth = docEl.clientWidth;
  var defWidth = 0;
  if (clientWidth >= 750) {
    defWidth = 100;
  } else {
    defWidth = 100 * (clientWidth / 750);
  }
  return defWidth / 100 * px;
};

export default {
  fmoney,
  parseDate,
  formatDate,
  GetQueryString,
  calc,
  getCurrentDate,
  buildImgURL,
  getRoutesPath,
  winSize,
}
