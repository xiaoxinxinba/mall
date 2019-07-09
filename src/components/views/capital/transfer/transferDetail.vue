<template>
  <div class="detail">
    <div class="title"><span>转账给用户</span></div>
    <div><p class="tips">温馨提示：仅限于对满集网用户进行转账，不能对商家进行转账</p></div>
    <el-form label-width="120px" class="custom">
      <el-form-item label="用户信息：">
        <div>
          <img :src="detailData.userImg" alt="" style="vertical-align: middle;" width="50">
          <span style="vertical-align: middle;">{{detailData.userName}}</span>
        </div>
      </el-form-item>
      <el-form-item label="用户账号：" class="custom-require">
        <div>{{detailData.userAccount}}</div>
      </el-form-item>
      <el-form-item label="转账金额：" class="custom-require">
        <strong>￥{{detailData.price}}</strong>
      </el-form-item>
      <el-form-item label="转账通知：">
        <div>{{detailData.remark || '无'}}</div>
      </el-form-item>
      <el-form-item label="转账时间：" class="custom-require">
        <div>{{detailData.date}}</div>
      </el-form-item>
      <el-form-item label="">
        <el-button size="medium" @click="$router.go(-1)">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import GetUserTransionDetail from '@/api/ShopPay/GetUserTransionDetail'
  export default {
    name: "transferDetail",
    data() {
      return {
        transionNo: '',
        detailData: {
          userImg: '',
          userName: '',
          userAccount: '',
          price: '',
          remark: '',
          date: '',
        }
      }
    },
    created() {
      this.transionNo = this.$route.query.transionNo;
      this.dataInit();
    },
    methods: {
      dataInit() {
        GetUserTransionDetail.call(this, `?input.transionNo=${this.transionNo}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.detailData.userImg = res.data.data.userPic;
            this.detailData.userName = res.data.data.nickName;
            this.detailData.userAccount = res.data.data.userName;
            this.detailData.price = res.data.data.amount;
            this.detailData.remark = res.data.data.remark;
            this.detailData.date = res.data.data.date;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .detail {
    overflow: hidden;
    background-color: #fff;
    .title {
      padding: 0.8rem;
      background-color: #f9f9fb;
      span {
        font-weight: 800;
      }
    }
    .tips {
      padding: 15px;
      color: #999;
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
