<template>
  <div class="container">
    <div class="main">
      <div class="img-show"><img :src="imgSrc" alt=""></div>
      <div class="state">店铺状态：{{statusList[status]}}</div>
      <div class="infor">您已提交关闭店铺申请，平台已下架店铺内所有商品，店铺已被{{statusList[status]}}，请耐心等待平台审核。</div>
      <div class="query"><i class="el-icon-phone"></i>如有疑问请致电全国统一服务热线：400-6766-999</div>
      <div class="look-explain"><i class="el-icon-warning-outline"></i><span @click="dialogFlag=true">查看店铺关闭说明</span>
      </div>
    </div>

    <el-dialog title="关闭店铺说明" :visible.sync="dialogFlag" width="800px" center>
      <div class="explain">
        <h2>申请关闭店铺步骤如下：</h2>
        <ul>
          <div>第一步：店铺关闭前必须完成事项：</div>
          <li>1、所有订单必须结算完成；</li>
          <li>2、所有退单必须处理完成；</li>
          <li>3、所有交易纠纷必须处理完成；</li>
          <li>4、所有投诉必须处理完成；</li>
          <li>5、保证金余额不能为负数。</li>
          <div>第二步：提交关闭店铺申请：</div>
          <li>
            商家完成第一步骤中“店铺关闭前必须完成事项”后，即可提交关闭店铺申请，系统将下架该店铺内所有商品并将店铺冻结，关店申请提交至平台审核。用户端（PC端、APP端）不显示该店铺和商品信息。系统将以短信方式自动发送至店铺经办人、负责人手机上，客服中心电话与商家核实。
          </li>
          <div>审核结果：</div>
          <li>经平台审核，如未通过，店铺不得关闭：</li>
          <li>商家可联系满集网客服中心咨询店铺关闭未成功原因。</li>
          <li>经平台审核，如通过的，平台将关闭店铺，店铺关闭后：</li>
          <li>1、入驻平台未满6个月商家如强行关闭，平台将收取保证金金额的50%；</li>
          <li>2、缴纳的平台使用年费不予退还；</li>
          <li>3、平台对商家所有的奖励、积分、信誉等全部清零；</li>
        </ul>


      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFlag = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ApplyColseShop from '../../../../../src/api/base/ApplyColseShop'

  export default {
    name: "freeze",
    data() {
      return {
        imgSrc: require('./img/store.png'),
        dialogFlag: false,
        clientVersion: '1',
        clientTimespan: new Date().toLocaleString(),
        status: 2,
        statusDesc: '',
        statusList: ['', '正常', '冻结', '关闭'],
      }
    },
    methods: {},
   /* mounted() {
      ApplyColseShop.call(this, '?input.clientVersion=' + clientVersion + '&input.clientTimespan=' + clientTimespan)
        .then(
          res => {
            if (res.data.code === 1) {
              this.status = res.data.data.status;
              this.statusDesc = res.data.statusDesc;
            }
          }
        )
    },*/
  }
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  .container {
    text-align: center;
  }

  .main {
    display: inline-block;
    width: 1200px;
    margin-top: 100px;
    padding: 30px 0px 20px;
    background: #ffffff;
    > div {
      margin-bottom: 20px;
    }
  }

  .state {
    color: #ff6600;
    font-size: 18px;
  }

  .infor {
    color: #666666;
    font-size: 16px;
  }

  .query {
    color: #333333;
    font-size: 14px;
    font-weight: 600;
    i {
      color: #e60012;
      margin-right: 10px;
    }
  }

  .look-explain {
    margin-top: 260px;
    padding-left: 30px;
    color: #00a2ff;
    text-align: left;
    i {
      margin-right: 10px;
    }
    span {
      cursor: pointer;
    }
  }

  .explain {
    h2 {
      font-size: 14px;
      color: #333333;
      margin-bottom: 20px;
    }
    ul {
      > div {
        font-size: 12px;
        color: #333333;
        font-weight: 600;
        margin-bottom: 20px;
      }
      li {
        color: #666666;
        font-size: 12px;
        margin-bottom: 10px;
      }
    }

  }

</style>
