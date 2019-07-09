<template>
  <div>
    <div class="title">
      <p>更换银行卡</p>
    </div>
    <div class="main">
      <p>1、更换银行卡需下载申请表；</p>
      <p>2、公司账户变更银行帐号时，需提交开户许可证或印鉴卡复印件或扫描件加盖公章；</p>
      <p>3、需提交法定代表人或授权代理人身份证复印件加盖公章，授权代理人办理需提交授权委托书</p>
      <p><el-button type="primary">下载申请表</el-button></p>

    </div>
  </div>
</template>

<script>
  export default {
    name: "bankChange",
    data() {
      return {

      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    border-bottom: 2px solid #00a2ff;

    p {
      width: 6.1rem;
      height: 2.3rem;
      background-color: #00a2ff;
      border-radius: 0.2rem 0.2rem 0rem 0rem;
      color: #fff;
      text-align: center;
      line-height: 2.3rem;
    }
  }
  .main {
    background-color: #fff;
    overflow: auto;
    p {
      padding: 10px;
    }
  }
</style>
