<template>
  <div class="main">
    <div class="menu">
      <ul>
        <li :class="choice === item && 'active'" v-for="(item, i) in carList" :key="i" @click="changeChoice(item)">{{item}}</li>
      </ul>
      <div class="ribbon"></div>
    </div>
    <router-view/>
  </div>
</template>

<script>

  export default {
    components: {

    },
    data() {
      return {
        carList: ['经营范围', '资质证件'],
        choice: '经营范围',
      }
    },
    created: async function () {
      this.getTitle();
    },
    methods: {
      changeChoice(name) {
        this.choice = name;
        switch (name) {
          case '经营范围':
            this.$router.push({name: "RangeIndex"});
            break;
          case '资质证件':
            this.$router.push({name: "Certificates"});
            break;
        }
      },

      // 默认获取头部标题
      getTitle() {
        // let routerName = this.$router.history.current.name;
        let routerTitle = this.$router.history.current.meta.title;
        console.log(routerTitle, "routerName");
        this.choice = routerTitle;
      },
    },

    watch: {
      '$route': {
        handler(to, from) {
          // 对路由变化作出响应...
          this.choice = this.$router.history.current.meta.title;
        },
        immediate: true
      }

    },
  }
</script>

<style lang="less" scoped>
  @import "./less/index.less";
</style>
