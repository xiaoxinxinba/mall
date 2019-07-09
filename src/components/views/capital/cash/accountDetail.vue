<template>
  <div>
    <div class="title">
      <p>查看银行卡</p>
    </div>
    <div class="main">
<!--      <div class="review-tag">审核中</div>-->
      <div class="tip-tag"><span style="color:#999;">若提现银行卡有变动，请点击</span><router-link :to="{name: 'bankChange'}">更换银行卡</router-link></div>
      <el-form label-width="200px" class="m10">
        <el-form-item label="公司名称：">
          {{company_name}}
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
        <el-form-item class="custom-require" label="开户许可证或印鉴卡照片：">
          <div>
            <div class="bank-pic">
              <img src="../img/bank.png" alt="" width="100%">
            </div>
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
  export default {
    name: 'accountDetail',
    data() {
      return {
        company_name: '满集网', //持卡人姓名
        bank_num: '123456789123456', //银行卡号
        bank_name: '中国农业银行', //银行
        bank_area: '重庆市',
        bank_branch: '江北区支行',
        bank_phone: '177777777',

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
    .review-tag {
      padding: 10px 50px;
      color: red;
    }
    .tip-tag {
      padding: 10px 40px;
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
