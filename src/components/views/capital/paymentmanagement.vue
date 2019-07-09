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
    name: '支付管理',
    data() {
      return {
        carList: ['店铺转账'],
        choice: '店铺转账',
      }
    },
    methods: {
      changeChoice(name) {
        this.choice = name;
        switch (name) {
          case '店铺转账':
            this.$router.push({name: "TransferList"});
            break;
          case '店铺续费':
            this.$router.push({name: "Xufei"});
            break;
        }
      },
    },
    watch: {
      '$route': {
        handler(to, from) {
          // 对路由变化作出响应...
          if (to.name === 'Xufei') {
            this.choice = '店铺续费'
          } else {
            this.choice = '店铺转账'
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./less/index.less";
</style>
