<template>
  <div class="crumbs_cont" v-if="routerName !== 'Index'">
    <!--<ul>-->
    <!--<li>-->
    <!--<router-link to="/">首页</router-link>-->
    <!--</li>-->
    <!--<li v-for="(item, i) in matched" :key="i">-->
    <!--<router-link :to="item.path">{{item.meta.title}}</router-link>-->
    <!--</li>-->
    <!--&lt;!&ndash;<li>&ndash;&gt;-->
    <!--&lt;!&ndash;<router-link to="/">项目列表</router-link>&ndash;&gt;-->
    <!--&lt;!&ndash;</li>&ndash;&gt;-->
    <!--</ul>-->

    <el-breadcrumb separator-class="el-icon-arrow-right"  style="line-height: 34px">
      <el-breadcrumb-item :to="{name: 'Index'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, i) in matched" :key="i" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        matched: [],
      }
    },
    computed: {
      routerName() {
        return this.$route.name;
      }
    },
    watch: {
      '$route': {
        handler(to, from) {
          // 对路由变化作出响应...
          let pathList = [];
          to.matched.map(item => {
            if(item.meta.title !== ''){
              item.path && pathList.push( item );
            }
          });
          //因为历史遗留原因 对数组对象去重。
          let hash = {};
          this.matched = pathList.reduce((preVal, curVal) => {
            hash[curVal.meta.title] ? '' : hash[curVal.meta.title] = true && preVal.push(curVal)
            return preVal
          }, []);
        },
        immediate: true
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "./less/crumbs.less";
</style>
