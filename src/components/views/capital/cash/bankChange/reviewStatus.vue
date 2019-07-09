<template>
  <div>
    <change-step :active-index="step_active"></change-step>
    <div style="padding: 15px;margin-bottom: 20px;background-color: #fff;text-align: right">
      <strong style="color: #00a2ff;cursor: pointer;" @click="$router.push({name: 'ChangeDesc'})"><img
        src="../../img/shuoming.png" alt="" style="vertical-align: middle;margin-right: 5px"/>变更说明</strong>
    </div>
    <div class="title">
      <!--      <p>公司/法人信息</p>-->
    </div>
    <div class="main">
<!--      等待审核-->
      <div v-if="step_status === 1">
        <div class="result">
          <img src="../../img/success.png" alt=""/>
          <div class="text text-success"><strong>变更申请表提交成功，等待审核</strong></div>
        </div>
      </div>
<!--      未通过-->
      <div v-else-if="step_status === 2">
        <div class="result">
          <img src="../../img/warning.png" alt=""/>
          <div class="text text-warning"><strong>对不起，您的变更申请未能审核通过，请修改后重新提交申请！</strong></div>
        </div>
        <div class="result-nopass">
          <div><strong>授权代理人信息</strong><strong class="text-error" style="float: right"><img src="../../img/nopass.png"
                                                                                            alt="">审核未通过</strong></div>
          <div><strong>公司信息</strong><strong class="text-success" style="float: right"><img src="../../img/pass.png"
                                                                                           alt="">审核通过</strong></div>
          <div><strong>银行卡信息</strong><strong class="text-success" style="float: right"><img src="../../img/pass.png"
                                                                                            alt="">审核通过</strong></div>
        </div>
        <div style="text-align: center;">
          <el-button type="primary" size="medium">前去修改</el-button>
          <el-button type="info" size="medium" @click="dialogVisible = true">重新申请</el-button>
        </div>
      </div>
<!--      通过-->
      <div v-else-if="step_status === 3">
        <div class="result">
          <img src="../../img/success.png" alt=""/>
          <div class="text text-success"><strong>恭喜您，变更申请审核通过 <br/> 请按要求邮寄纸质档资料！</strong></div>
        </div>
        <div class="desc-box">
<!--          法人-->
          <div>
            <div class="block">
              <p><strong>一、寄送资料</strong></p>
              <p>1、审核通过的且有法人签字并加盖红色公章的申请表；</p>
              <p>2、加盖公章的法人身份证复印件；</p>
              <p>3、营业执照内容有变更的，寄送加盖公章的营业执照复印件；</p>
              <p>4、若为公司账户的，寄送加盖公章的开户许可证或印鉴卡复印件或扫描件；</p>
              <p>5、若为法人账户的，寄送加盖公章的法人手持银行卡文件。</p>
            </div>
            <div class="block">
              <p><strong>二、寄送说明</strong></p>
              <p>1、平台承诺所有寄送的资料只用于申请变更银行卡，绝不另作他用或外泄相关信息；</p>
              <p>2、为保证变更成功，请严格按要求寄送所有纸质档资料；</p>
              <p>3、寄送方式可快递，也可自送，已寄出的请及时填写物流信息。</p>
            </div>
            <div class="block">
              <p><strong>三、寄送地址</strong></p>
              <p>重庆市江北区建新西路2号北城艺术大厦22-1 重庆满集网络科技有限公司财务部</p>
              <p>联系电话：023-67997451</p>
              <p>邮编：400020</p>
            </div>
          </div>
          <div v-if="false">
            <div class="block">
              <p><strong>一、寄送资料</strong></p>
              <p>1、审核通过的且有授权代理人签字并加盖红色公章的申请表；</p>
              <p>2、加盖公章的授权代理人身份证复印件以及授权委托书；</p>
              <p>3、营业执照内容有变更的，寄送加盖公章的营业执照复印件；</p>
              <p>4、若为公司账户的，寄送加盖公章的开户许可证或印鉴卡复印件或扫描件；</p>
              <p>5、若为法人账户的，寄送加盖公章的授权代理人手持银行卡文件。</p>
            </div>
            <div class="block">
              <p><strong>二、寄送说明</strong></p>
              <p>1、平台承诺所有寄送的资料只用于申请变更银行卡，绝不另作他用或外泄相关信息；</p>
              <p>2、为保证变更成功，请严格按要求寄送所有纸质档资料；</p>
              <p>3、寄送方式可快递，也可自送，已寄出的请及时填写物流信息。</p>
            </div>
            <div class="block">
              <p><strong>三、寄送地址</strong></p>
              <p>重庆市江北区建新西路2号北城艺术大厦22-1 重庆满集网络科技有限公司财务部</p>
              <p>联系电话：023-67997451</p>
              <p>邮编：400020</p>
            </div>
          </div>
        </div>
        <el-button size="medium" type="primary" @click="$router.push({name: 'SendInfo'})">已寄出资料</el-button>
      </div>
      <div v-else>
        <div class="result">
          <img src="../../img/wait.png" alt=""/>
          <div class="text text-warning"><strong>纸质档资料已寄出，等待接收</strong></div>
        </div>
      </div>
    </div>
<!--    弹出层-->
    <el-dialog
      title="重新申请"
      :visible.sync="dialogVisible"
      width="300px">
      <span>变更信息将被清空，确定重新申请吗？</span>
      <div slot="footer" style="text-align: center">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import changeStep from '@/components/views/capital/cash/bankChange/changeStep'

  export default {
    name: "reviewStatus",
    components: {
      changeStep,
    },
    data() {
      return {
        dialogVisible: false,
        step_active: 2,
        step_status: 3,
      }
    },
    created() {
      this.step_status = this.$route.query.status || 1;
      this.step_active = this.$route.query.active || 1;
    },
    methods: {

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
    padding: 20px;
    background-color: #fff;
    min-height: 400px;

    .result {
      margin-bottom: 30px;
      text-align: center;

      .text {
        margin-top: 10px;
      }
    }

    .result-nopass {
      width: 500px;
      margin: 0 auto 20px;
      padding: 20px;
      background-color: #f5f5f5;

      > div {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }

        img {
          vertical-align: middle;
          margin-right: 5px;
        }
      }
    }

    .desc-box {
      margin-bottom: 20px;
      padding: 20px;
      border-top: 1px solid #e1e1e1;
      border-bottom: 1px solid #e1e1e1;
      .block {
        line-height: 2;
        margin-bottom: 30px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .text-success {
      color: #58b220;
    }

    .text-warning {
      color: #ff6600;
    }

    .text-error {
      color: #e60012;
    }
  }
</style>
