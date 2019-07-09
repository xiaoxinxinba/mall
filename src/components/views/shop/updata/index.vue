<template>
  <!--更新-->
  <div class="container">
    <ul>
      <li v-for="(item,index) in list" :class="name - 1 === index?'choose':''">{{item}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        list: ['1. 公司信息', '2. 银行卡信息'],
        name: '',
      }
    },
    methods: {
      change(val) {
        this.name = val;
      }
    }
  }
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  ul {
    font-size: 0px;

    li {
      display: inline-block;
      width: 50%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 16px;
      color: #333333;
      background: #ffffff;
      border: 1px solid #cccccc;
      border-right: none;
    }

    li:nth-last-of-type(1) {
      border-right: 1px solid #cccccc;
    }

    .choose {
      background: #00a2ff;
      color: #ffffff;
    }
  }
</style>
