<template>
  <div :class="isPrinter?'max_box':''">
    <div>
      <public-header v-if="!isCur" />
      <div class="app_content">
        <div class="app_menu" v-if="!isCur && !isClose" >
          <public-menu />
        </div>
        <div class="app_center">
          <div class="app_crumbs" v-show="!to.meta.hideCrumbs"  v-if="!isCur && !isLogistics && !isClose" >
            <public-crumbs  />
          </div>
          <router-view v-if="isRouterAlive"/>
        </div>
        <div class="app_bar"  v-if="!isCur && !isLogistics">
          <order-bar />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/assets/js/lrz.all.bundle.js';
  import PublicHeader from './components/public/publicHeader.vue';
  import PublicMenu from './components/public/publicMenu.vue';
  import PublicCrumbs from './components/public/publicCrumbs.vue';
  import OrderBar from './components/public/orderBar.vue';
  import PublicFooter from './components/public/publicFooter.vue';

  export default {
    components: {
      PublicHeader,
      PublicMenu,
      PublicCrumbs,
      OrderBar,
      PublicFooter
    },
    provide(){
      return{
        reload:this.reload
      };
    },
    data() {
      return {
        to: {
          meta: {}
        },
        isRouterAlive:true,
        curRouteName: ['FeeStandard', 'Login','Printer'],
        logisticsDetails:['LogisticsDetails'],
        printerList:['Printer'],
        closeList:['Close','Freeze'],

      }
    },
    computed: {
      isCur() {
        return this.curRouteName.some(res => {
          return res.includes(this.$route.name)
        })
      },
      isLogistics() {
        return this.logisticsDetails.some(res => {
          return res.includes(this.$route.name)
        })
      },
      isPrinter() {
        return this.printerList.some(res => {
          return res.includes(this.$route.name)
        })
      },
      isClose() {
        return this.closeList.some(res => {
          return res.includes(this.$route.name)
        })
      }

    },
    watch: {
      '$route'(to, from) {
        // 对路由变化作出响应...
        this.to = to;
      }
    },
    methods: {
       reload(){
            this.isRouterAlive=false;
            this.$nextTick(function () {
               this.isRouterAlive =true;
            })
       }
    },
    created() {

    }
  }
</script>

<style lang="less" scoped>
  @import "//at.alicdn.com/t/font_1151411_dnv0ziz7qkp.css";

  .app_content {
    display: flex;
    margin-top: 12px;
    height: calc(100vh - 141px);
    .app_menu {
      height: 100%;
      width: 252px;
      background-color: #ffffff;
      padding: 0 4px;
    }
    .app_center {
      width: 100%;
      height: 100%;
      flex: 1;
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      overflow: auto;
      .app_crumbs {
        height: 34px;
        margin-bottom: 10px;
      }
    }
    .app_bar {
      height: 100%;
      width: 48px;
      background-color: rgba(102, 102, 102, 0.1);
    }
  }
  .max_box{
    width: 1200px;
    margin: 0 auto;
    overflow: auto;
  }

</style>

<style lang="less">
  @import './assets/css/viewer.min.css';
  @import "./assets/less/theme.less";

  html {
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    /*备用 antd font*/
    /*font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";*/
  }

  body {
    font-size: 14px;
    line-height: normal;
    background-color: @background;
    overflow: hidden;
  }

  * {
    margin: 0;
    padding: 0;
    outline: 0;
  }

  ul, li {
    list-style: none;
  }

  a {
    color: #00a2ff;
    text-decoration: none;
  }

  a:hover {
    color: @color;
    text-decoration: underline;
  }

  .vue-lazyload {
    opacity: 0;
    transition: opacity .4s ease;
  }

  .vue-lazyload[lazy=loaded] {
    opacity: 1;
  }

  .vue-lazyload[lazy=loading] {
    opacity: 1;
  }

  .vue-lazyload[lazy=error] {
    opacity: 1;
  }

/*  重置遮罩层样式*/
  .el-loading-mask {
    background-color: rgba(255,255,255,.6);
  }
</style>
