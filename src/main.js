// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import element from './config/element'
import ElementUI from 'element-ui'
import store from './config/vuex'
import {JSEncrypt} from 'jsencrypt'
import VueLazyload from 'vue-lazyload'
import Viewer from 'v-viewer';
import VCharts from 'v-charts';
import echarts from 'echarts'
import * as filters from './assets/js/filter'
import { Message } from 'element-ui';

import "./assets/js/sdkIM/webim";
import "./assets/js/sdkIM/json2";
import "./assets/js/sdkIM/spark-md5";
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont/iconfont.css';

import Tool from './assets/js/tool';
import Storage from '@/assets/js/storage';
import Global from '@/assets/js/global';
import VueClipboards from 'vue-clipboards';

import Vamap from 'vue-amap'

Vue.prototype.$Storage = Storage;
Vue.prototype.$Global = Global;
Vue.prototype.$Tool = Tool;

Vue.use(VueClipboards);

Object.keys(filters).forEach(key => { //过滤器挂载在Vue上
  Vue.filter(key, filters[key])
});

window.eventBus = new Vue();

// Vue.use(element);
Vue.use(ElementUI);
Vue.use(VCharts);
Vue.prototype.echarts = echarts;
Vue.config.productionTip = false;

Vue.use(Vamap);

Vamap.initAMapApiLoader({
  // 高德的key
  key: '1c7629af464e626722890d35a15b0de5',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation','AMap.Geocoder'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});


Vue.use(VueLazyload, {
  attempt: 1, // 失败重新加载次数
  // error: 'http://bpic.588ku.com/element_origin_min_pic/01/37/82/88573c6372e4ae5.jpg', // 加载失败图
  error: require('./assets/img/ic_default.png'), // 加载失败图
  loading: require('./assets/img/ic_default.png'), // 加载中的占位图
});
Vue.use(Viewer, {
  defaultOptions: {
    // title: false,
    // navbar: false,
    // toolbar: false,
    zIndex: 9999
  }
});


router.beforeEach((to, from, next) => {
  console.log('router to: ', to);
  console.log('router from: ', from);
  //判断是否已经登录且有token信息
  //排除登录页
  if (to.name !== 'Login') {
    let token_info = sessionStorage.getItem('tokenInfo');
    if (!token_info) {
      next({name: 'Login'});
      return;
    }
    //判断是否有权限
    //判断二级及以下路由
    // if (to.matched.length > 1) {
    //   let menu_meta = to.matched[1].meta; //二级菜单路由元信息
    //   let menu_ids = sessionStorage.getItem('menuIds') ? JSON.parse(sessionStorage.getItem('menuIds')) : []; //存储的菜单权限
    //   if (menu_meta.id && menu_ids.indexOf(menu_meta.id) !== -1) {
    //     //有权限
    //
    //   } else {
    //     //无权限
    //     Message.error('访问页面没有权限');
    //     next({name: from.name});
    //     return;
    //   }
    // }
  }
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
