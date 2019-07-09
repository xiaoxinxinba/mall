<template>
    <div class="details">
        <div class="content">
                 <el-upload
  class="avatar-uploader"
  action="https://jsonplaceholder.typicode.com/posts/"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
<div style="borderRight:1px dashed #ccc;">
    <div class="left">
    <p>用户账号<span>{{userName}}</span></p>
    <p>默认地址<span>{{defaultAddress}}</span></p>
    <p>账号<span>{{userNo}}</span></p>
</div>
</div>

<div class="middle">
    <p>会员等级<span>{{levelAlias}}</span></p>
    <p>会员生日（已设置生日专属优惠）<span>{{birthday}}</span></p>
    <p>会员性别<span>{{sex}}</span></p>
</div>
<div class="right">
    <div style="textAlign:center;">
    <p>总交易额（元）</p>
    <p style="fontSize:20px;color:#00a2ff;">{{Number(dealAmountSt).toFixed(2)}}</p>
    </div>
   <div style="marginLeft:100px;textAlign:center;">
       <p>总交易笔数</p>
       <p style="fontSize:20px;color:#00a2ff;">{{dealCount}}</p>
   </div>
</div>
        </div>
   
<div class="record">
<h3>交易记录</h3>
<div class="table">
<el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="orderNo"
      label="订单号"
      >
    </el-table-column>
    <el-table-column
      prop="userName"
      label="用户账号"
      >
    </el-table-column>
    <el-table-column
      prop="orderTime"
      label="下单时间">
    </el-table-column>
     <el-table-column
      prop="paymentTime"
      label="支付时间">
    </el-table-column>
     <el-table-column
      prop="userNo"
      label="账号">
    </el-table-column>
     <el-table-column
      prop="orderAmount"
      label="订单金额">
    </el-table-column>
     <el-table-column
      prop="actualPaymentAmount"
      label="实付金额">
    </el-table-column>
     <el-table-column
      prop="discount"
      label="会员优惠">
    </el-table-column>
  </el-table>
</div>
 
</div>
    </div>
</template>

<script>
import GetShopVipCardInfo from '../../../api/Member/GetShopVipCardInfo.js'
  export default {
    data() {
      return {
        selectID:this.$route.query.Id,
        clientTimespan:new Date().toLocaleString(),
        imageUrl: '',
        tableData: [],
        userName:'',//用户名称
        userNo:'',//账号
        userImg:'',//图片
        level:'',//等级
        levelAlias:'',//等级别名
        sex:'',//性别
        telPhone:'',//号码
        birthday:'',//生日
        defaultAddress:'',//默认收货地址
        dealCount:'',//交易次数
        dealAmountSt:'',//交易总额
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 请求数据
      GetShopVipCardInfo(){
        GetShopVipCardInfo.call(this,`?input.vipUser=${this.selectID}&input.clientTimespan=${this.clientTimespan}`)
        .then(res=>{
          console.log(res)
          if(res.data.code===1){
          this.tableData = res.data.data.transactionRecords

          this.userName = res.data.data.userName//用户账号
          this.defaultAddress = res.data.data.defaultAddress//默认收货地址
          this.userNo = res.data.data.userNo//账号
          this.levelAlias = res.data.data.levelAlias//会员别称
          this.birthday = res.data.data.birthday//生日
          this.sex = res.data.data.sex//性别
          // this.telPhone = res.data.data.telPhone//电话号码
          this.dealCount = res.data.data.dealCount//交易次数
          this.dealAmountSt = res.data.data.dealAmountSt//交易总额
          
          }
        })
      }
    },
    created() {
    this.GetShopVipCardInfo()
    },
  }
</script>

<style lang="less">
.details{
    .content{
        display: flex;
        justify-content: space-around;
        .left{
        width: 450px;
        line-height: 60px;
        background: #fff;
        margin-left: 20px;
        padding-left: 30px;
        span{
            margin-left: 40px;
            color: black;
            font-weight: bold;
        }
    }
    .middle{
        width: 450px;
        line-height: 60px;
        background: #fff;
        margin-left: 20px;
        padding-left: 30px;
        span{
            margin-left: 40px;
            color: black;
            font-weight: bold;
        }
    }
    .right{
        width: 450px;
        line-height: 60px;
        background: #fff;  
        margin-left: 20px;   
        padding-left: 30px;  
        display: flex;
    }
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    background: #fff;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.record{
    margin-top: 20px;
    background: #fff;
    height: 500px;
    h3{
        color: #00a2ff;
        padding-top: 20px;
        padding-left: 15px;
    }
    .table{
        margin-top: 20px;
        padding-left: 15px;
    }
}
   
}

</style>
