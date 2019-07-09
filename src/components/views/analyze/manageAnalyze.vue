<template>
  <!--经营分析-->
  <div class="container">
    <div class="left">
      <!--订单统计-->
      <div>
        <div class="title">
          <span>订单统计</span><span @click="add">更多>></span>
        </div>
        <ul class="order">
          <li>
            <div class="grid">
              <div class="grid-left order_1"></div>
              <div class="grid-right"><p>成交订单</p><p>{{paidNum}}</p></div></div>
          </li>
          <li>
            <div class="grid">
              <div class="grid-left order_2"></div>
              <div class="grid-right"><p>退单订单</p><p>{{backNum}}</p></div></div>
          </li>
          <li>
            <div class="grid none">
              <div class="grid-left order_3"></div>
              <div class="grid-right"><p>纠纷次数</p><p>{{saleDisputeNum}}</p></div></div>
          </li>
          <div class="across-line"></div>
          <li>
            <div class="grid">
              <div class="grid-left order_4"></div>
              <div class="grid-right"><p>订单总额</p><p>{{paidMoney}}</p></div></div>
          </li>
          <li>
            <div class="grid">
              <div class="grid-left order_5"></div>
              <div class="grid-right"><p>退单总额</p><p>{{backMoney}}</p></div></div>
          </li>
          <li>
            <div class="grid none">
              <div class="grid-left order_6"></div>
              <div class="grid-right"><p>纠纷总额</p><p>{{saleDisputeMoney}}</p></div></div>
          </li>
        </ul>
      </div>

      <!--以下为退单商品-->
      <div>
        <div class="title">
          <span>以下为退单商品</span>
        </div>
        <ul class="table">
          <li class="table-title"><div v-for="item in name" :key="item">{{item}}</div></li>
          <li v-for="(item,index) in tableData" :key="index"><div><span>{{index+1}}</span></div><div v-for="(items,indexs) in item" :key="indexs"><span>{{items}}</span></div></li>
          <li class="more"><span @click="more">更多>></span></li>
        </ul>
      </div>

    </div>


    <div class="right">
      <div class="activity-statistic">
          <div class="title">
            <span>活动统计</span><span @click="ccc">更多>></span>
          </div>
          <ul class="order">
            <li v-for='(item,index) in activityData' :key='index'>
              <div class="grid">
                <div class="grid-left turnover" :class="`activity_${index+1}`"></div>
                <div class="grid-right"><p>{{item.activityName}}</p><p>{{item.activityNumber}}</p><p @click="fabu(index)">立即发布</p></div></div>
            </li>
          </ul>

        </div>

      <div class="advertise-statistic">
        <div class="title">
          <span>广告统计</span><span>更多>></span>
        </div>
        <ul class="order">
          <li>
            <div class="grid">
              <div class="grid-left advertisement"></div>
              <div class="grid-right"><p>首页轮播图广告</p><p>150</p><p>购买广告</p></div>
            </div>
          </li>
          <li>
            <div class="grid">
              <div class="grid-left advertisement"></div>
              <div class="grid-right"><p>首页专题广告</p><p>88</p><p>购买广告</p></div>
            </div>
          </li>
          <li>
            <div class="grid none">
              <div class="grid-left advertisement"></div>
              <div class="grid-right"><p>首页品类广告</p><p>150</p><p>购买广告</p></div>
            </div>
          </li>
          <div class="across-line"></div>
          <li>
            <div class="grid">
              <div class="grid-left advertisement"></div>
              <div class="grid-right"><p>首页区域广告</p><p>1200</p><p>购买广告</p></div>
            </div>
          </li>
          <li>
            <div class="grid">
              <div class="grid-left advertisement"></div>
              <div class="grid-right"><p>二级轮播图广告</p><p>155</p><p>购买广告</p></div>
            </div>
          </li>
          <li>
            <div class="grid none">
              <div class="grid-left advertisement"></div>
              <div class="grid-right"><p>二级推荐位广告</p><p>288</p><p>购买广告</p></div>
            </div>
          </li>
        </ul>

      </div>

      <div class="goods-statistic">
        <div class="title">
          <span>商品统计</span><span @click="prodouct">更多>></span>
        </div>
          <ul class="order">
            <li>
              <div class="grid">
                <div class="grid-left goods_1"></div>
                <div class="grid-right"><p>商品总数</p><p>{{commodityData.allCount}}</p><p @click="newproduct">发布新品</p></div>
              </div>
            </li>
            <li>
              <div class="grid">
                <div class="grid-left goods_2"></div>
                <div class="grid-right"><p>上新商品(30天)</p><p>{{commodityData.newCount}}</p><p @click="newproduct">发布新品</p></div>
              </div>
            </li>
            <li>
              <div class="grid none">
                <div class="grid-left goods_3"></div>
                <div class="grid-right"><p>出售中的商品</p><p>{{commodityData.saleCount}}</p><p @click="newproduct">发布新品</p></div>
              </div>
            </li>
          </ul>
      </div>
    </div>

  </div>
</template>

<script>
import GetBusinessAnalysisInfo from '../../../api/Member/GetBusinessAnalysisInfo.js'//  获取经营分析数据
  export default {
    name: "manageAnalyze",
    data(){
      return{
        tableData: [],
        name:['序号','退单号','商品名称','退款金额','退单类型','退单原因'],
        clientTimespan:new Date().toLocaleString(),
        paidNum:'',//成交订单
        backNum:'',//退单订单
        saleDisputeNum:'',//纠纷次数
        paidMoney:'',//订单总额
        backMoney:'',//退单总额
        saleDisputeMoney:'',//纠纷总额
        activityData:[],//活动统计
        commodityData:{},//商品统计
        textData:[]
      }
    },
    methods: {
      add(){
        this.$router.push("/OrderManage/OrderList")
      },
      ccc(){
        this.$router.push("/market/discount")
      },

      fabu(index){
         if(index===0){
           this.$router.push({path:'/market/discount/addDiscount',query:{name:0,type:'add'}});
         }else if(index===1){
          this.$router.push({path:'/market/discount/addGift',query:{type:'add'}});
         }else if(index===2){
          this.$router.push({path:'/market/discount/addGoodsCoupon',query:{type:'add'}});
         }else if(index===3){
          this.$router.push({path:'/market/discount/addFreeShipping',query:{type:'add'}});
         }else if(index===4){
          this.$router.push({path:'/market/discount/addFullRefund',query:{type:'add'}});
         }else if(index===5){
          this.$router.push({path:'/market/discount/addSpecialPromotion',query:{type:'add'}});
         }
        // /market/discount/addGift?type=add 赠品 /market/discount/addGoodsCoupon?type=add 优惠 
        // /market/discount/addFreeShipping?type=add 包邮 /market/discount/addFullRefund?type=add 翻卷
        // /market/discount/addSpecialPromotion?type=add 特价
        
      },

      more(){
        this.$router.push("/OrderManage/afterSale")
      },
      prodouct(){
        this.$router.push("/goods")
      },
      newproduct(){
        this.$router.push("/goods/releaseClass")
      }
    },
    created() {
      GetBusinessAnalysisInfo.call(this,`?input.clientTimespan=${this.clientTimespan}`)
      .then(res=>{
    console.log(res)
    if(res.data.code===1){
      this.tableData = res.data.data.basicBackOrders
      this.paidNum = res.data.data.manageAnalyze.paidNum
      this.backNum = res.data.data.manageAnalyze.backNum
      this.saleDisputeNum = res.data.data.manageAnalyze.saleDisputeNum
      this.paidMoney = res.data.data.manageAnalyze.paidMoney
      this.backMoney = res.data.data.manageAnalyze.backMoney
      this.saleDisputeMoney = res.data.data.manageAnalyze.saleDisputeMoney
      this.activityData = res.data.data.marketing.shopActivityInfo
      this.commodityData = res.data.data.shopArticleOperationCount
    }
      })
      .catch(err=>{

      })
    },
  }
</script>

<style lang="less" scoped>
  @import "less/manageAnalyze.less";
</style>
