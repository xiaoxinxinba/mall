<template>
  <div class="container">
    <div class="state" v-if="fatherSource.shipped">
      <div class="state-title">当前订单状态： <span>已发货</span>
        <span v-if="pageType===1"><i class="el-icon-time"></i>买家已于2017-08-09 16:15:10操作延迟收货，延迟时间为7天</span></div>
      <ul v-if="validTime(dataSource.latestTaskDate)">
        <li>● 买家还有<span>{{countDown}}</span>来完成本次交易的"确认到货"。</li>
      </ul>
      <p>如有疑问，请致电满集全国统一服务热线：400-6766-999</p>
    </div>

<!--    <div class="order" v-if="pageType===2">-->
<!--      <div class="order-title">-->
<!--        <span>包裹 1</span><span><i class="el-icon-time"></i>包裹9天2小时25分26秒后自动确定收货</span>-->
<!--      </div>-->
<!--      <div class="order-main">-->
<!--        <ul class="order-infor">-->
<!--          <li>发货时间：2017-11-03  14：01:23 </li>-->
<!--          <li>物流公司：圆通快递 </li>-->
<!--          <li>运单号码：700124548884</li>-->
<!--        </ul>-->
<!--        <ul class="order-show">-->
<!--          <li>-->
<!--            <img :src="orderImgSrc" alt="">-->
<!--            <div>品牌特价折扣中老年羽绒服女连帽中...</div>-->
<!--            <span>2件</span>-->
<!--          </li>-->
<!--          <li>-->
<!--            <img :src="orderImgSrc" alt="">-->
<!--            <div>品牌特价折扣中老年羽绒服女连帽中绒服女连帽中绒服女连帽中绒服女连帽中</div>-->
<!--            <span>2件</span>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->


  </div>
</template>

<script>
  export default {
    name: "alreadyDeliverGoods",
    props: ['fatherSource'],
    components:{
    },
    data(){
      return{
        countDown:'',
        dataSource:{},
        pageType:0,     //页面类型    0已发货  1已发货延迟收货  2已发货分批收货
        orderImgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
      }
    },
    watch:{
      dataSource:function () {
        //处理任务时间
        if (this.dataSource.latestTaskDate !== "1900-01-01 00:00:00") {
          setInterval(() => {
            this.countDown = this.countTime(this.dataSource.latestTaskDate);
          }, 1000);
        }
      }
    },
    methods:{
      /**
       * 当前状态到下一状态倒计时
       * @param day
       * @returns {string}
       */
      countTime: function (day) {
        let str='';
        //获取当前时间
        let date = new Date();
        let now = date.getTime();
        //设置截止时间
        let endDate = new Date(day);
        let end = endDate.getTime();
        //时间差
        let leftTime = end - now;
        //定义变量 d,h,m,s保存倒计时的时间
        if (leftTime >= 0) {
          let d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          let h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
          let m = Math.floor(leftTime / 1000 / 60 % 60);
          let s = Math.floor(leftTime / 1000 % 60);
          if (h>0){ str += d+"天"}
          str += h+"时"+m+"分"+s+"秒";
        }
        return str;
      },
      //时间有效验证
      validTime(date) {
        return date && date !== "1900-01-01 00:00:00";
      },
    },
    created(){
      this.dataSource = this.fatherSource;
    },
  }
</script>

<style lang="less" scoped>
  @import "less/alreadyDeliverGoods.less";
</style>
