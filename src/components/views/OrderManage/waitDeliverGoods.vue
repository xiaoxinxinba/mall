<template>
  <!--待发货-->
  <div class="container">
    <div class="state">
      <div class="state-left">
        <!--待发货-->
        <div class="state-wait" v-if="fatherSource.state === 250">
          <div class="wait-title">当前订单状态： <span>待发货</span><span>{{countDown}} 内未发货，系统将自动取消订单</span></div>
          <ul class="state-suggest">
            <li>● 请尽快发货，超过3天未发货系统将自动取消订单。</li>
            <li>● 如果特殊原因需延迟发货，请及时与买家联系说明情况，并操作<span>延迟发货</span>。</li>
            <li v-show="fatherSource.remindAt != null">● 每个订单仅可操作延迟发货一次，延迟订单超过7天未发货系统将自动取消订单。</li>
            <li v-show="fatherSource.delayShippedAt != null"><p style="color: red"><i class="el-icon-bell"></i>已于{{
              fatherSource.delayShippedAt}} 操作延迟发货</p></li>
            <li v-show="fatherSource.remindAt != null"><p style="color: red"><i class="el-icon-bell"></i>买家已于{{
              fatherSource.remindAt}} 提醒发货</p></li>
          </ul>
          <div class="wait-btn state-btn">
            <el-button @click="sendGoods()">发 货</el-button>
            <span>如有疑问，请致电满集全国统一服务热线：400-6766-999</span>
          </div>
        </div>


        <!--已提醒发货-->
        <!--<div class="state-remind" v-if="fatherSource.state === 250 && fatherSource.remindAt != ''">-->
        <!--<div class="state-title">当前订单状态： <span>待发货</span>-->
        <!--<div><p>{{fatherSource.latestTaskTip}}</p>-->
        <!--<p><i class="el-icon-bell"></i>买家已于{{ fatherSource.remindAt}} 提醒发货</p></div>-->
        <!--</div>-->
        <!--<ul class="state-suggest">-->
        <!--<li>● 请尽快发货，超过3天未发货系统将自动取消订单。</li>-->
        <!--<li>● 如果特殊原因需延迟发货，请及时与买家联系说明情况，并操作<span>延迟发货</span>。</li>-->
        <!--</ul>-->
        <!--<div class="wait-btn state-btn">-->
        <!--<el-button @click="sendGoods()">发 货</el-button>-->
        <!--<span>如有疑问，请致电满集全国统一服务热线：400-6766-999</span>-->
        <!--</div>-->
        <!--</div>-->

        <!--商家已操作延迟发货-->
        <div class="state-dealy" v-if="fatherSource.state === 251">
          <div class="state-title">当前订单状态： <span>待发货</span>
            <div><p>{{fatherSource.latestTaskTip}}</p>
              <p><i class="el-icon-bell"></i>已于{{ fatherSource.delayShippedAt}} 操作延迟发货</p></div>
          </div>
          <ul class="state-suggest">
            <li>● 每个订单仅可操作延迟发货一次，延迟订单超过7天未发货系统将自动取消订单。</li>
          </ul>
          <div class="wait-btn state-btn">
            <!--<el-button @click="sendGoods()">发 货</el-button>-->
            <span>如有疑问，请致电满集全国统一服务热线：400-6766-999</span>
          </div>
        </div>

        <!--待发货-分批发货-->
        <div class="state-split" v-if="fatherSource.state === 350">

          <div class="split-title state-title">当前订单状态：
            <div><p>商家分批发货中,请查看页面下方订单区域了解详情。</p>
              <p>剩余商品<span>{{gettime(fatherSource.latestTaskTip)}}</span>内未发货，系统将退款。</p>
              <p v-if="fatherSource.delayShippedAt != null">
                <i class="el-icon-bell"></i>已于{{ fatherSource.delayShippedAt}} 操作延迟发货
              </p>
            </div>
          </div>
          <ul class="state-suggest">
            <li>● 未发货商品请尽快发货，超过3天未发货系统将自动退款。</li>
            <li>● 如果特殊原因需延迟发货，请及时与买家联系说明情况，并操作<span>延迟发货</span>。</li>
          </ul>
          <div class="wait-btn state-btn">
            <el-button @click="sendGoods()">发 货</el-button>
            <span>如有疑问，请致电满集全国统一服务热线：400-6766-999</span>
          </div>
        </div>

        <ul class="suggest">
          <h2>重要提醒</h2>
          <li>请尽快发货，超过规定时间，系统自动退款至买家账户</li>
          <li>买家投诉收到的订单商品存在少配件、少赠品，少商品，将影响店铺信誉</li>
          <li>易碎易变形的商品包装多用泡沫塑料或者泡绵，进行防护处理，以抵抗运输过程中的撞击</li>
          <li>建议包装美观，会让顾客有更好的购物体验，促进店铺销售</li>
        </ul>
      </div>

      <div class="state-right">
        <div class="right-box">
          <img :src="goodsCommend.img_url" alt="">
          <div class="right-infor">{{goodsCommend.goodsName}}</div>
          <el-button type="danger" @click="goBuy()">点击购买</el-button>
        </div>
      </div>
    </div>

    <div class="order" v-if="fatherSource.state === 350" v-for="(item,index) in fatherSource.packages" :key="index">
      <div class="order-title">
        <span>包裹 {{index+1}}</span>
      </div>
      <div class="order-main">
        <ul class="order-infor">
          <li>发货时间：{{item.shipAt}}</li>
          <li>物流公司：{{item.expressName}}</li>
          <li>运单号码：{{item.expressNo}}</li>
          <ul class="order-show">
            <li v-for="(exItem,i) in getExpressGoods(item.id)" :key="i">
              <img :src="exItem.image" alt="">
              <div>{{exItem.title}}</div>
              <span>{{exItem.quantity}}件</span>
            </li>
          </ul>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import GetGoodsCommend from '../../../api/Order/GetGoodsCommend';//获取推荐商品
  import moment from 'moment'

  export default {
    name: "waitDeliverGoods",
    props: ['fatherSource'],
    components: {},
    data() {
      return {
        countDown: '',
        dataSource: {},
        rightImgSrc: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
        expressGoods: [],   // 物流包裹包含的商品。
        goodsCommend: {}
      }
    },
    watch: {
      dataSource: function () {
        //处理任务时间
        if (this.dataSource.latestTaskDate !== "1900-01-01 00:00:00") {
          setInterval(() => {
            this.countDown = this.countTime(this.dataSource.latestTaskDate);
          }, 1000);
        }
      }
    },
    methods: {
      /**
       * 当前状态到下一状态倒计时
       * @param day
       * @returns {string}
       */
      countTime: function (day) {
        let str = '';
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
          if (h > 0) {
            str += d + "天"
          }
          str += h + "时" + m + "分" + s + "秒";
        }
        return str;
      },
      getExpressGoods(expressId) {
        return this.fatherSource.goods.filter(function (item) {
          return item.packageId === expressId
        });
      },
      gettime(time) {
        return time.substring(0, time.indexOf("分") + 1);
      },
      sendGoods() {
        this.$router.push({
          path: '/OrderManage/ship',
          query: {orderNo: this.fatherSource.orderNo}
        })
      },
      goBuy() {
        window.location.href = "http://" + this.goodsCommend.goods_href
      }
    },
    mounted() {
      let date = new Date().toString();
      this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
      GetGoodsCommend.call(this, `?clientTimespan=${this.time}`).then(res => {
        if (res.data.code === 1) {
          this.goodsCommend = res.data.data[0];
        }
      })
    },
    created() {
      this.dataSource = this.fatherSource;
      console.log(this.getExpressGoods(3530), 111111)
    },

  }
</script>

<style lang="less" scoped>
  @import "less/waitDeliverGoods.less";
</style>
