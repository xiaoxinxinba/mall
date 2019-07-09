<template>
  <div class="main">
    <h3 style="margin-bottom: 10px;color: #409EFF">寄送说明</h3>
    <div class="content">
      <div class="block">
        <h4>一、寄送资料</h4>
        <p>1、审核通过的且有法人签字并加盖红色公章的申请表；</p>
        <p>2、加盖公章的法人身份证复印件；</p>
        <p>3、营业执照内容有变更的，寄送加盖公章的营业执照复印件；</p>
        <p>4、若为公司账户的，寄送加盖公章的开户许可证或印鉴卡复印件或扫描件；</p>
        <p>5、若为法人账户的，寄送加盖公章的法人手持银行卡文件。</p>
      </div>
      <div class="block">
        <h4>二、寄送说明</h4>
        <p>1、平台承诺所有寄送的资料只用于申请变更银行卡，绝不另作他用或外泄相关信息；</p>
        <p>2、为保证变更成功，请严格按要求寄送所有纸质档资料；</p>
        <p>3、寄送方式可快递，也可自送，已寄出的请及时填写物流信息。</p>
      </div>
      <div class="block">
        <h4>三、寄送地址</h4>
        <p>重庆市江北区建新西路2号北城艺术大厦22-1 重庆满集网络科技有限公司财务部</p>
        <p>联系电话：023-67997451 </p>
        <p>邮编：400020</p>
      </div>
    </div>
    <div style="text-align: center">
      <el-button size="medium" type="info" @click="$router.go(-1)">取消</el-button>
<!--      <el-button size="medium" type="primary" @click="dialogVisible = true">下一步</el-button>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "sendDesc",
    data() {
      return {
        dialogVisible: false,
        type: 1,
      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;
    padding: 20px;

    .content {
      margin-bottom: 10px;
      border-top: 1px solid #e1e1e1;
      border-bottom: 1px solid #e1e1e1;
      padding: 20px;
      .block {
        margin-bottom: 30px;
        h4 {
          margin-bottom: 10px;
        }
        p {
          line-height: 1.5;
        }
      }
    }
  }
</style>
