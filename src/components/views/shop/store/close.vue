<template>
  <div class="container">
    <div class="main">
      <div class="img-show"><img :src="imgSrc" alt=""></div>
      <div class="state">店铺状态：{{statusList[pageType]}}</div>
      <ul class="infor">
        <div class="infor-title">申请激活店铺说明：</div>
        <li>1、重新签订入驻协议；</li>
        <li>2、按规定缴纳平台使用年费、技术服务费；</li>
        <li>3、按规定缴纳保证金；</li>
        <li>4、补交上次关店时所欠的费用；</li>
        <li>5、属于商家诚信、违规原因关店者须另交纳信誉调整服务费100元/次；</li>
        <li>6、如公司法人等发生变更需重新填写入驻信息；</li>
        <li>7、如公司经营范围发生变化的，需重新申请入驻并修改新的经营范围，审核通过后平台使用费、保证金将按照修改后经营范围缴纳；</li>
        <div class="query"><i class="el-icon-phone"></i>如有疑问请致电全国统一服务热线：400-6766-999</div>
      </ul>
      <div class="btn" v-if="pageType===0||pageType===2">
        <el-button type="primary" @click="activateShop">申请激活店铺</el-button>
      </div>

      <div class="wait-btn" v-if="pageType===1">
        <el-button type="primary" icon="el-icon-loading">激活店铺审核中，请耐心等待平台审核...</el-button>
      </div>

      <div class="message" v-if="pageType===2">
        <div class="message-state"><i class="el-icon-info"></i><span>审核未通过！</span></div>
        <div class="message-reason">原因：{{reason}}</div>
        <div class="message-btn"><span>2017-08-09</span>
          <el-button type="primary">知道了</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CloseShop from '../../../../../src/api/base/CloseShop'
  import OpenShop from '../../../../../src/api/base/OpenShop'
  import ActivateShop from '../../../../api/ShopInfo/ActivateShop'
  export default {
    name: "close",
    data() {
      return {
        imgSrc: require('./img/store.png'),
        pageType: 0,   //0关闭  1等待审核  2审核未通过
        reason:'**********************************************',
        type:2,
        clientTimespan: new Date().toLocaleString(),
        clientVersion: '1',
        statusList: [ '关闭', '等待审核', '审核未通过'],
      }
    },
    methods:{
      //获取店铺当前状态
      closeShop(){
        CloseShop.call(this, '?type=' + this.type + '&clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan)
          .then(
            res => {
              if (res.data.code === 1) {
                 this.pageType = res.data.data.status;
              }
            }
          )
      },
      //激活店铺操作
      activateShop(){
        ActivateShop.call(this).then(
          res=>{
            if (res.data.code===1){
              window.open(res.data.data);
              /*console.log(res.data.data);*/
              /*if (res.data.data){
                alert('申请成功，等待审核');
              }else {
                alert('申请失败');
              }
              //重新获取状态
              this.closeShop();*/
            }
          }
        )
      }
    },
    created() {
      this.closeShop();
    },
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
    display: inline-block;
    text-align: left;
    li {
      font-size: 14px;
      color: #666666;
      margin-bottom: 10px;
    }
  }

  .infor-title {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .query {
    text-align: left;
    color: #333333;
    font-size: 14px;
    font-weight: 600;
    i {
      color: #e60012;
      margin-right: 10px;
    }
  }

  .btn {
    text-align: center;
    margin-top: 30px;
    /deep/ button {
      padding: 0px;
      width: 310px;
      height: 44px;

    }
  }

  .wait-btn {
    margin-top: 30px;
    /deep/ button {
      padding: 0px;
      width: 310px;
      height: 44px;
    }
  }

  .message {

    width: 800px;
    display: inline-block;
    background: #fff7e6;
    border: solid 1px #ffc89c;
    height: 40px;
    text-align: left;
    line-height: 40px;
    padding: 0px 10px;
    > div {
      display: inline-block;
      vertical-align: middle;
    }
    .message-state {
      font-size: 16px;
      color: #ff6600;
      i {
        margin-right: 5px;
      }
    }
    .message-reason {
      font-size: 12px;
      color: #666666;
    }

    .message-btn {
      font-size: 12px;
      color: #999999;
      float: right;
      height: 40px;
      /deep/ button {
        padding: 0px;
        width: 68px;
        height: 27px;
      }
      span {
        margin-right: 10px;
      }
    }

  }


</style>
