import axios from 'axios'
import refreshToken from '@/api/login/refreshToken'
import router from '@/router/index'

const API = require('@/config/vuex/state/api').state;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; // Form Data 模式
let isTokenRefreshing = false; //token是否正在刷新
let getNewToken;//新的token
//定义fetch函数，config为配置
export function fetch(config, options) {
  //返回promise对象
  return new Promise((resolve, reject) => {

    let opt = options || {};
    opt.headers = opt.headers || {};
    opt.headers['Content-Type'] = opt.headers['Content-Type'] || 'application/json';
    opt.timeout = opt.timeout || 50000;
    //创建axios实例，把基本的配置放进去
    const instance = axios.create(opt);

    //创建axios实例，把基本的配置放进去
    /*const instance = axios.create({
      //定义请求文件类型
      headers: {
        'Content-Type': 'application/json',
      },
      // 请求超时
      timeout: 50000,
      responseType: responseType
    });*/

    // 添加请求拦截器
    instance.interceptors.request.use(async function (config) {
      //是否为刷新token或登录接口
      if (config.url.indexOf('/auth/oauth/token') !== -1) {
        return config;
      } else {
        //token信息
        let tokeninfo = JSON.parse(sessionStorage.getItem('tokenInfo'));
        //过期时间
        let expire_time = new Date(tokeninfo.curTime).getTime() + tokeninfo.expires_in * 1000;
        console.log('过期时间', expire_time);
        //当前时间
        let current_time = new Date().getTime();
        console.log('当前时间', current_time);
        //token过时需要重新请求
        if (current_time > expire_time) {
          if (isTokenRefreshing) {//正在刷新
            await getNewToken;//等待请求完成
            config.headers['Authorization'] = 'Bearer ' + JSON.parse(sessionStorage.getItem('tokenInfo')).access_token;
            return config;
          }
          isTokenRefreshing = true;
          //请求新的token
          getNewToken = new Promise((resolve, reject) => {
            refreshToken.call(this, {
              refresh_token: tokeninfo.refresh_token,
              shopId: tokeninfo.shopId,
            }).then(res => {
              if (res.data.Code === 1) {
                isTokenRefreshing = false;
                //存储新的token信息
                res.data.Data.curTime = new Date().getTime();
                sessionStorage.setItem("tokenInfo", JSON.stringify(res.data.Data));
                //手动修改前一次请求的token
                config.headers['Authorization'] = 'Bearer ' + res.data.Data.access_token;
                resolve(config);
              } else {
                //刷新失败跳转回登录页面
                sessionStorage.clear();
                router.push({path: '/'});
                isTokenRefreshing = false;
                resolve(config);
              }
            }).catch(e => {
              isTokenRefreshing = false;
              resolve(config);
            });
          });
          return getNewToken;
        } else {
          //请求加上token
          config.headers['Authorization'] = 'Bearer ' + tokeninfo.access_token;
          // config.headers['Authorization'] = 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXIiOm51bGwsInNlc3Npb25JZCI6IjFmNDg4ZjI2LWI4MjItNGIwYS1iZWM2LWIwM2YyZTNkYjY2YyIsInVzZXJOYW1lIjoienNmcHhjIiwidVZhbHVlIjoiMjE0NDY0OCIsInVzZXJJZCI6MjE1MDU2NiwiYXV0aG9yaXRpZXMiOlsiMS05LTUiLCIxLTctNiIsIjEtNy00IiwiMS05LTIiLCIxLTYtNCIsIjEtOC0yIiwiMS05LTEiLCIxLTItNyIsIjEtNi0zIiwiMS04LTEiLCIxLTEiLCIxLTIiLCIxLTMiLCIxLTQiLCIxLTUiLCIxLTYiLCIxLTciLCIxLTgiLCIxLTkiLCJST0xFX1JPTEVfMjAxOTAyMDExMDA3NDE0MTAwMDMiLCIxLTItNiIsIjEtNC00IiwiMS01LTMiLCIxLTYtMiIsIjEtMS02IiwiMS0yLTUiLCIxLTMtNCIsIjEtNC0zIiwiMS01LTIiLCIxLTYtMSIsIjEtMS01IiwiMS0yLTQiLCIxLTMtMyIsIjEtNC0yIiwiMS0xLTQiLCIxLTItMyIsIjEtMy0yIiwiMS00LTEiLCIxLTEtMyIsIjEtMi0yIiwiMS0zLTEiLCIxLTEtMiIsIjEtMi0xIiwiMS0xLTEiXSwiY2xpZW50X2lkIjoic2hvcHBjIiwiY2xpZW50VHlwZSI6InBjIiwiY3JlYXRlVGltZSI6bnVsbCwicGhvbmUiOm51bGwsImdyYW50X3R5cGUiOiJwYXNzd29yZCIsInNjb3BlIjpbInNlcnZlciJdLCJ1VHlwZSI6IlNob3AiLCJzaG9wSWQiOiIyMTQ0NjQ4IiwiZXhwIjoxNTU5MDI2MDY4LCJqdGkiOiJmMmEwN2FiNy0zMzI5LTQ0YzgtOTU4Yi0zYzA2N2JhNDJmNjUifQ.aYVPJoFmWtCy8qQA2kU2lF2CC6U6eKdgX64UrIeOsDk9HTectpnXbiE8ZdePIkrW3yt7PJmKS9n-vJ7IjsyfE5jkGVk_KE8MPbTZHyx-Y3EtaLLMUqNAacNtKyUjYzWwXAUloEL_jSv4x7Gm29uIhbRr_Lw0Y3PZqnhCMCV6LEhyGf4TrYCYU_V9_shnBeSIdXUuOWq4bj-loFBt-2OE37YCnecN5iFkbaTli-vbGj8NQ3IeSpv8ncDNi8gXHfUvBQ6vgC_5-rs_Ll91Go8sYt3Dd73o5VXgyUpkqyqYsQ4P7XuE0bNc9kBV-7nwt2OUmE2lhV8GaO7uYRbI8oquUQ';
          return config;
        }
      }
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });

// 添加响应拦截器
    instance.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      return response;
    }, function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    });

    //请求成功后执行的函数
    instance(config).then(res => {

      resolve(res);
      if (res.data.Code === 101) {
        console.error('用户未登录');
      }
      //失败后执行的函数
    }).catch(err => {
      console.log('错误')
      console.log(err);
      reject(err);
    })
  });
}

// 封装调用的接口 getData
export function $axios(url, data, type = 'post', host, options) {

  let baseURL = host ? API[host] : API.host;
  // axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.sessionStorage.getItem('token') || this.$route.query.sessionId;
  // axios.defaults.headers.common['token'] = sessionStorage.getItem('tokenInfo') ? JSON.parse(window.sessionStorage.getItem('tokenInfo')).access_token : '';
  // 判断是否登录
  /*if (window.localStorage.getItem('token')) {
   data = _merge({
     /!*access_token: '3655b548-8d35-4cfe-92ac-9ce746f0b244'*!/
   }, data)
 } else {
   data = {}
 }*/
  if (type === 'post' && !data) {
    data = {}
  } else if (type === 'get' && !data) {
    data = ''
  }
  return fetch({
    url: type === 'post' ? baseURL + url : baseURL + url + data,
    method: type || 'post',
    data: data,
  }, options)
}
