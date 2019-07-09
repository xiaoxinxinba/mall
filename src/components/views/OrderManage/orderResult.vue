<template>
  <!--已收货，已取消，已结算,已冻结-->
  <div class="container">
    <div class="state" v-if="fatherSource.cancel ==true || fatherSource.settle ==true || fatherSource.receive==true">
      <div class="state-title">
         当前订单状态：<span>{{fatherSource.stateName}}</span>
        <div class="state-title-right" v-if="fatherSource.cancel">
          <span  v-if="fatherSource.state === 403">逾期未发货，系统自动取消订单</span>
          <span  v-else-if="fatherSource.state === 404">逾期未接单，系统自动取消订单</span>
          <span  v-else>用户取消订单</span>
        </div>
      </div>
      <ul class="suggest" v-if="fatherSource.receive">
        <li>● 如果买家提出售后要求或给予中差评，请积极与买家协商，做好售后服务。</li>
        <li>● 买家确认收货后，无退款/售后，7天后将自动完成结算。</li>
      </ul>
      <div class="change-address" v-if="fatherSource.sellerTag">
        <i class="sign"></i><span>标记│ {{fatherSource.sellerTag }}</span>
      </div>
      <p>如有疑问，请致电满集全国统一服务热线：400-6766-999</p>
    </div>
    <div class="order"  v-if="fatherSource.isSomeShipped" v-for="(item,index) in fatherSource.packages">
      <div class="order-title">
        <span>包裹 {{index + 1}}</span><span><i class="el-icon-time"></i></span>
      </div>
      <div class="order-main">
        <ul class="order-infor">
          <li>发货时间：{{item.shipAt}} </li>
          <li>物流公司：{{item.expressName}} </li>
          <li>运单号码：{{item.expressNo}}</li>
        </ul>
        <ul class="order-show">
          <li v-for="goods in packageGoods(item.id)">
            <img :src="goods.image"/>
            <div>{{goods.title}}</div>
            <span class="blue">{{goods.quantity}}件</span>
          </li>
        </ul>
      </div>
    </div>

  </div>

</template>

<script>
  import _ from 'underscore';
  export default {
    name: "orderResult",
    props: ['fatherSource'],
    components:{
    },
    data(){
    },
    methods:{
      //获取当前包裹的商品信息
      packageGoods(packageId) {
        return _.select(this.fatherSource.goods, item => item.packageId === packageId);
      },
    },
    created(){
    }
  }
</script>

<style lang="less" scoped>
  @import "less/orderResult.less";
</style>
