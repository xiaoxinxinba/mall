<template>
  <div class="main">
    <h3 style="margin-bottom: 10px;color: #409EFF">变更银行卡说明</h3>
    <div class="content">
      <div class="block">
        <h4>一、变更流程</h4>
        <p>1、按要求填写变更申信息，下载打印变更申请表并签字盖章；</p>
        <p>2、上传已盖章申请表，等待审核；</p>
        <p>3、电子档审核通过的，按要求邮寄纸质档资料；</p>
        <p>4、满集网收到符合要求的纸质档资料，变更完成</p>
      </div>
      <div class="block">
        <h4>二、变更说明</h4>
        <p>1、银行卡变更期间可正常交易，若已绑定银行卡无法正常结算的，建议暂时下架商品，以免造成无法结算货款的情形；</p>
        <p>2、变更期间需提现的，仍旧提现到此前绑定的银行卡，请保证银行卡的有效性；</p>
        <p>3、变更银行卡审核未通过的，默认沿用此前绑定的银行卡；</p>
        <p>4、若涉及变更营业执照，如涉及到名称变更，需要提供变更后的资质证明材料复印件加盖公章；</p>
        <p>5、变更银行账号时，法人账户需提交法人手持变更银行卡正反面照片；公司账户的需提交开户许可证或印鉴卡复印件或扫描件加盖公章；</p>
        <p>6、所有均需提交法定代表人或授权代理人身份证复印件加盖公章，授权代理人办理需提交授权委托书</p>
      </div>
    </div>
    <div style="text-align: center">
      <el-button size="medium" type="info" @click="$router.go(-1)">取消</el-button>
      <el-button size="medium" type="primary" @click="dialogVisible = true">下一步</el-button>
    </div>
<!--    弹出层-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="450px"
    >
      <div>
        <div style="margin-bottom: 20px">
          <el-radio v-model="type" :label="1" name="type">我是法定代理人</el-radio>
        </div>
        <div style="margin-bottom: 20px;">
          <el-radio v-model="type" :label="2" name="type">我是授权代理人</el-radio>
        </div>
        <div>
          注：法定代表人可直接进行银行卡变更操作；<br/>
          授权代理人必须提交授权委托书才可进行变更操作
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button @click="dialogVisible = false" size="small" >取 消</el-button>
        <el-button type="primary" size="small" @click="jump">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "changeDesc",
    data() {
      return {
        dialogVisible: false,
        type: 1,

      }
    },
    methods: {
      jump() {
        this.dialogVisible = false;
        if (this.type === 1) {
          this.$router.push({name: 'ChangeCompanyInfo'});
        } else {
          this.$router.push({name: 'AgentInfo'});
        }
      }
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
