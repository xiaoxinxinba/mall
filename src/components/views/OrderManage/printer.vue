<template>
  <!--打印机-->
  <div class="container">
    <div class="print-btn">
      <el-button type="primary" v-show="ui.visitPrintBtn"  @click="print">打印</el-button>
    </div>
    <div class="main">
      <div class="title">
        <div><img src="./img/mjlogo.png" alt=""></div>
        <div>购物清单</div>
        <div>（客户留存）</div>
      </div>
      <ul class="goods-infor">
        <li><span>订单号：{{dataSource.orderNo }}</span></li>
        <li><span>订购时间：{{dataSource.createAt }}</span></li>
        <li><span>客户姓名  {{dataSource.recipient.name}} </span></li>
        <li><span>商品总数：{{goodsQuantity}}</span></li>
      </ul>

      <div class="table">
        <el-table
          :data="dataSource.goods"
          style="width: 100%" :border="true">
          <el-table-column
            label="商品编号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.articleId  }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.title  }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="数量" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.quantity  }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="价格" align="center">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.realPrice).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="小计"  align="center">
            <template slot-scope="scope">
              <span>{{(scope.row.quantity*scope.row.realPrice).toFixed(2) }}</span>
            </template>
          </el-table-column>

        </el-table>

      </div>

      <div  class="code">
        <div class="two-code">
          <img src="./img/code.png" alt="">
          <p>满集天下 品质生活</p>
        </div>
      </div>
    </div>

    <div v-show="isPrint">
      <div class="carousel" v-if="commendGoods.length" v-show="ui.visitPrintBtn">
        <div class="carousel-left"><img @click="move('left')" src="./img/arrows.png" alt=""></div>
        <div class="carousel-show">
          <div class="carousel-main">
            <div class="middle">
              <transition-group tag="li"  :name="position" class="aaa">
                <li class="move-li"  v-for="(item,index) in commendGoods" :key="item.id" :class="'move-li'+index">
                  <img :src="item.img_url" alt="">
                  <p>{{item.goodsName}}</p>
                  <a href="item.goods_href"> 点击购买</a>
                </li>
              </transition-group>
            </div>
          </div>
        </div>
        <div class="carousel-right"><img @click="move('right')" src="./img/arrows.png" alt=""></div>
        <div class="recommend">为您推荐满集网上优质打印机，建议购买推荐打印机，方便管理，快捷且不易出错</div>
      </div>
    </div>



  </div>
</template>

<script>
  import GetOrderDetial from '../../../api/Order/GetOrderDetial';
  import GetGoodsCommend from '../../../api/Order/GetGoodsCommend';
  import _ from 'underscore';
  import moment from 'moment';
  export default {
    name: "printer",
    data(){
      return{
        dataSource: {
          buyer:{},//购买人信息
          recipient:{},//收件人信息
          goods: [],//购买的商品
          packages:{expressNo :'',expressName :''},//包裹
          payment:{},//付款人信息
        },//活动数据
        commendGoods: { id:0,img_url:'',goodsName:''},
        ui: {
          visitPrintBtn: true
        },
        query: {
          orderNo: this.$route.query.orderNo,
          type: this.$route.query.type
        },
        show:false,
        position:'left',
        start:0,
        isPrint:true,
      }
    },
    computed:{
      goodsQuantity() {
        return this.dataSource.goods && _.chain(this.dataSource.goods).map(item => item.quantity).reduce((memo, val) => val + memo).value() || 0;
      }
    },
    methods:{
      move(val){
        if(val==='left'){
          this.position='left';
          this.start+=4;
          if(this.start>=this.list.length){
            this.start=0;
          }
        }else if(val==='right'){
          this.position='right';
          this.start-=4;
          if(this.start<0){
            let result=this.list.length%4;
            if(result===0){
              this.start=this.list.length-4;
            }else{
              this.start=this.list.length-result;
            }
          }
        }
      },
      initData() {
        let date = new Date().toString();
        this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
        //订单详情
        GetOrderDetial.call(this,`?input.orderNo=${ this.query.orderNo}&input.orderType=${ this.query.type}&input.clientTimespan=${this.time}`).then(res=>
        {
          if(res.data.code === 1 && res.status === 200 )
          {
            this.dataSource= res.data.data;
          }else {
            this.$message({showClose: true, message: res.data.desc, type: 'error'});
          }
        });
      },
      print() {
        this.isPrint=false;

        this.ui.visitPrintBtn = false;
        this.$nextTick(() => {
          window.print();
          this.ui.visitPrintBtn = true;
        });




      },
      //加载推荐商品
      getCommendGoods() {
        let date = new Date().toString();
        this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
        GetGoodsCommend.call(this,`?input.clientTimespan=${this.time}`).then(response => {
          if (response.status === 200 && response.data.code === 1 ) {
             this.commendGoods = response.data.data;
          }
        });
      },
    },
    created(){
      this.initData();
      this.getCommendGoods();
    }
  }
</script>

<style lang="less" scoped>
  @import "less/printer.less";
</style>
