<template>
  <!-- 头部搜索区域 -->
  <div class="search">
    <p class="title">满集网</p>
    <img class="vue-vue-lazyload" v-lazy="pcLogo" alt="" width="46" height="46"/>
    <span class="name">{{storeName}}</span>
    <div class="input">
      <el-input placeholder="请输入关键字搜索" v-model="input3" size="mini"></el-input>
      <span class="el-icon-search icon"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      input3: ""
    };
  },
  computed: {
    storeName() {
      return this.$store.state.account.storeName
    },
    pcLogo() {
      return this.$store.state.account.pcLogo
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.search {
  width: 200px;
  height: 189px;
  background: #e45050;
  .title {
    padding: 10px;
    font-size: 14px;
    color: #8e3535;
    display: block;
  }
  img {
    margin-left: 10px;
    vertical-align: middle;
  }
  .name {
    margin: 0 auto;
    font-size: 14px;
    width: 100%;
    /* height: 20px; */
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    line-height: 14px;
    padding-top: 14px;
  }
  .input {
    padding: 0 10px;
    padding-right: 40px;
    position: relative;
    margin-top: 25px;
    .el-input__inner {
      height: 24px;
      line-height: 24px;
      padding: 0 3px;
      color: #757575;
    }
    .icon {
      position: absolute;
      display: block;
      top: 6px;
      right: 22px;
      color: #c24123;
      cursor: pointer;
    }
  }
}
</style>
