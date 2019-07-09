<template>
  <div v-loading="page_loading">
    <div class="title">
      <p>查看银行卡</p>
    </div>
    <div class="main">
      <div style="padding: 10px 30px;">
        <div class="tip-tag" v-if="status === 2"><span class="remind">审核未通过！</span>原因：{{remark}}<el-button type="primary" class="btn" size="mini" @click="$router.push({name: 'UpdataCompany'})">修改</el-button></div>
        <div class="tip-tag"><span>已申请银行卡变更</span><el-button type="primary" class="btn" size="mini">查看变更进度</el-button></div>
        <div class="tip-tag"><span>若提现银行卡有变动，请变更银行卡</span><el-button type="primary" class="btn" size="mini" @click="$router.push({path: 'bankChange'})">变更银行卡</el-button></div>
        <div class="tip-tag" v-if="status === 0"><span class="remind">审核中</span></div>
      </div>
      <el-form label-width="150px" class="m10">
        <el-form-item label="持卡人姓名：" v-if="account_type === 1">
          {{bank_account}}
        </el-form-item>
        <el-form-item label="公司名称：" v-else>
          {{company_account}}
        </el-form-item>
        <el-form-item label="银行账号：">
          {{bank_num}}
        </el-form-item>
        <el-form-item label="开户银行：">
          {{bank_name}}
        </el-form-item>
        <el-form-item label="开户银行省市：">
          {{bank_area}}
        </el-form-item>
        <el-form-item label="所属支行：">
          {{bank_branch}}
        </el-form-item>
        <el-form-item label="银行预留手机号：">
          {{bank_phone}}
        </el-form-item>
        <el-form-item class="custom-require" label="银行卡照片：" v-if="account_type === 1">
          <div>
            <div class="bank-pic">
              <span>银行卡正面</span>
              <img src="../img/bank.png" alt="" width="100%"/>
            </div>
            <div class="bank-pic">
              <span>银行卡反面</span>
              <img src="../img/bank.png" alt="" width="100%"/>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="custom-require" v-else label="开户许可证或印鉴卡照片：">
          <div class="bank-pic">
            <img src="../img/bank.png" alt="" width="100%"/>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="$router.push({name: 'Tixian'})">申请提现</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import GetBankInfo from '@/api/BankInfo/GetBankInfo'
  import GetSupplementInformation from '@/api/ShopInfo/GetSupplementInformation'
  import GetRegisterBankInfo from '@/api/Finance/GetRegisterBankInfo'
  export default {
    name: 'bankLegal',
    data() {
      return {
        page_loading: false,
        account_type: 1, //银行卡类型
        bank_account: '', //持卡人姓名
        company_account: '', //公司名称
        bank_num: '', //银行卡号
        bank_name: '', //银行
        bank_area: '',
        bank_branch: '',
        bank_phone: '',

        status: 0, //
        remark: '',//原因
      }
    },
    created() {
      this.bankInit();
      this.GetSupplementInformation();
    },
    methods: {
      bankInit() {
        this.page_loading = true;
        GetBankInfo.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          this.page_loading = false;
          if (res.data.code === 1) {
            this.account_type = res.data.data.type;
            if (res.data.data.type === 1) {
              this.bank_account = res.data.data.companyOrLegalBankInfo.bankUser;
            } else {
              this.company_account = res.data.data.companyOrLegalBankInfo.bankUser;
            }
            this.bank_num = res.data.data.bankBasicInfo.displayBankNo;
            this.bank_name = res.data.data.bankBasicInfo.bankName;
            this.bank_branch = res.data.data.bankBasicInfo.bankAddress;
            this.bank_phone = res.data.data.bankEntrustInfo.displayEntrustMobile;

          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.page_loading = false;
        })
      },
      //获取审核状态
      GetSupplementInformation() {
        GetSupplementInformation.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.status = res.data.data.bank.status;
            this.remark = res.data.data.bank.remark;
          } else {
            this.$message.error(res.data.desc)
          }
        })
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
    overflow: auto;
    background-color: #fff;
    .tip-tag {
      position: relative;
      height: 45px;
      line-height: 45px;
      background-color: #fff7e6;
      padding: 0 40px;
      margin-bottom: 5px;
      color: #666;
      .remind {
        font-weight: 700;
        font-size: 1.2em;
        color: #ff6600;
      }
      .btn {
        position: absolute;
        right: 10px;
        top: 10px;
      }
    }
    .bank-pic {
      display: inline-block;
      width: 250px;
      margin-right: 20px;
      color: #606266;
      text-align: center;
      vertical-align: middle;
    }
  }
  .m10 .el-form-item {
    margin-bottom: 10px;
    .el-form-item__label {
      position: relative;
    }
  }
</style>
<style lang="less">
  .custom-require label.el-form-item__label {
    position: relative;
    &:before {
      content: "*";
      position: relative;
      color: red;
      font-size: 1.5em;
      right: 5px;
      top: 7px;
    }
  }
</style>
