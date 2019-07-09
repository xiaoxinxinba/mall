<template>
  <div class="tab">
    <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
      <el-tab-pane label="常用语" name="first">
        <ul class="tab_chatlanguage" v-loading="!chatlanguageData.length">
          <li v-for="item in chatlanguageData" :class="currChatlanguage === item.content ? 'on' : ''" @click="selectChatlanguage(item.content)">{{item.content}}</li>
        </ul>

        <template v-if="!chatlanguageData.length">
          <p class="no_data">暂无数据</p>
        </template>
      </el-tab-pane>

      <el-tab-pane label="核对订单" name="second">
        <div v-loading="!orderData.length">
          <!--一条订单数据(循环体) start-->
          <div v-for="item in orderData" class="tab_order_box">
            <div class="tab_order_top">
              <i>订单号：</i>
              <span>{{item.orderNo}}</span>
            </div>

            <div class="tab_order_center">
              <p>{{item.statusText}}</p>
              <div class="center_shopInfo">
                <span class="left">
                  <img :src="item.goods[0].image" alt="" />
                </span>
                <div class="right">
                  <p>{{item.goods[0].title}}</p>
                  <i>共1件商品</i>
                </div>
              </div>
              <div class="center_orderInfo">
                <span>订单金额：<i>￥ {{item.payment.realMoney}}</i></span>
                <span>{{item.createAt}}</span>
              </div>
            </div>

            <div class="tab_order_footer">
              <span><i v-clipboard="item.recipient.address" @success="copySuccess" @error="copyError">复制地址</i></span>
              <span><i v-clipboard="item.orderNo" @success="copySuccess" @error="copyError">复制订单号</i></span>
              <span><i @click="sendOrder(item)">发送订单</i></span>
            </div>
            <div class="tab_bg"></div> <!--只是用于占位区分-->
          </div>
          <!--一条订单数据 end-->

          <div class="loading_more" v-if="Math.ceil( orderData.length / 10 ) < orderPage">
            <span @click="loadingMore">加载更多...</span>
          </div>
        </div>

        <template v-if="!orderData.length">
          <p class="no_data">暂无数据</p>
        </template>
      </el-tab-pane>

      <el-tab-pane label="推荐商品" name="third">
        <div class="consult_list_map">
          <div class="user_search">
            <el-input placeholder="请输入关键字搜索" suffix-icon="el-icon-search" v-model="articleName"></el-input>
          </div>

          <div v-loading="!goodsBriefInfoByPageData.length">
            <!--一条订单数据(循环体) start-->
            <div class="tab_order_box" v-for="item in goodsBriefInfoByPageData" style="margin-top: 20px;">
              <div class="tab_order_center">
                <div class="center_shopInfo">
                <span class="left">
                  <img :src="item.imgUrl" alt="">
                </span>
                  <div class="right">
                    <p>{{item.title}}</p>
                    <i>共{{item.orderTimes}}件商品</i>
                  </div>
                </div>
              </div>

              <div class="tab_order_tips">
                <span>￥ {{item.sellPrice}}</span>
                <i>库存：{{item.stockQuantity}}</i>
                <em @click="setgoodsBriefInfo(item)">发送</em>
              </div>
              <div class="tab_bg"></div> <!--只是用于占位区分-->
            </div>
            <!--一条订单数据 end-->
          </div>

          <template v-if="!goodsBriefInfoByPageData.length">
            <p class="no_data">暂无数据</p>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import GetGoodsBriefInfoByPage from '@/api/ShopActivity/GetGoodsBriefInfoByPage';
  import GetOrderList from '@/api/Order/GetOrderList';
  import GetChatlanguagePage from "@/api/Txy/GetChatlanguagePage";

  export default {
    data() {
      return {
        clientTimespan: this.$Tool.formatDate(new Date()),
        buyerUserId: this.$route.query.buyerUserId || 0,
        activeName: 'first',
        goodsBriefInfoByPageData: [], // 推荐商品数据
        orderData: [], // 核对订单数据
        orderPage: 0, // 核对订单总页数
        pageIndex: 1, // 核对订单当前页
        articleName: "", // 推荐商品搜索字段
        chatlanguageData: [], // 常用语数据
        currChatlanguage: '', // 当前选中的常用语
      };
    },
    methods: {
      /**
       * 复制到剪切板事件
       */
      copySuccess(e) {
        console.log(e);
        this.$message.success("复制成功");
      },
      copyError(e) {
        console.log(e);
        this.$message.error("复制失败");
      },

      /**
       * 获取常用语数据
       */
      getChatlanguagePage() {
        GetChatlanguagePage.call(this, `?clientTimespan=${this.clientTimespan}&status=1&type=1&pageIndex=1&pageSize=10`).then(res => {
          console.log(res, "获取常用语数据");
          if (res.data.code === 1) {
            this.chatlanguageData = res.data.data.languagelist;
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 选择常用语
       */
      selectChatlanguage( content ) {
        console.log(content);
        this.currChatlanguage = content;
        this.$emit('setTabData', content);
      },

      /**
       * 获取推荐商品的数据
       */
      getGoodsBriefInfoByPage() {
        GetGoodsBriefInfoByPage.call(this, `?clientTimespan=${this.clientTimespan}&articleName=${this.articleName}&categroyId=-1&pageIndex=1&pageSize=10`).then(res => {
          console.log(res, "获取到的推荐商品的数据");
          if (res.data.code === 1) {
            this.goodsBriefInfoByPageData = res.data.data.list;
          } else {
            this.$message.error(res.data.desc);
          }
        });
      },

      /**
       * 获取核对订单的数据
       */
      getOrderList() {
        GetOrderList.call(this, `?clientTimespan=${this.clientTimespan}&orderStatus=0&buyerUserId=${this.buyerUserId}&pageIndex=${this.pageIndex}&pageSize=10`).then(res => {
          console.log(res, "获取到的核对订单的数据");
          if (res.data.code === 1) {
            res.data.data.orderList.map(item => {
              this.orderData.push(item);
            });
            this.orderPage = Math.ceil( res.data.data.totalCount / 10 ); // 核对订单页数
          } else {
            this.$message.error(res.data.desc);
          }
        });
      },

      /**
       * tabs切换操作
       */
      tabClick(tab) {
        if ( tab.name === "first" ) { // 常用语
          this.getChatlanguagePage();
        } else if ( tab.name === "second" ) { // 核对订单
          this.getOrderList();
        } else { // 推荐商品
          this.getGoodsBriefInfoByPage();
        }
      },

      /**
       * 发送订单
       */
      sendOrder( item ) {
        console.log(item, "发送订单");
      },

      /**
       * 核对订单的加载更多
       */
      loadingMore() {
        this.pageIndex++;
        this.getOrderList();
      },

      /**
       * 发送推荐商品
       */
      setgoodsBriefInfo( item ) {
        console.log(item, "发送推荐商品");
      },
    },
    watch: {
      articleName( val ) {
        console.log(val);
        this.getGoodsBriefInfoByPage();
      }
    },
    created () {
      this.getChatlanguagePage();
    },
  };
</script>

<style lang="less" scoped>
  @import './less/tab.less';
  /deep/ .tab {
    .el-tabs--border-card {
      background: #fff;
      border: 0px solid #fff;
      -webkit-box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12),
        0 0 0px 0 rgba(0, 0, 0, 0.04);
      box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12), 0 0 0px 0 rgba(0, 0, 0, 0.04);
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      color: #ff406c;
      border-top-color: #ff406c;
      border-right-color: #fff;
      border-left-color: #fff;
      border-bottom-color: #fff;
    }
    .el-tabs--border-card
      > .el-tabs__header
      .el-tabs__item:not(.is-disabled):hover {
      color: #ff406c;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item {
      border: 2px solid transparent;
      margin-top: 2px;
    }
    .el-input__inner {
      height: 24px;
      line-height: 24px;
      padding: 0 3px;
      color: #757575;
    }
    .input__icon {
        line-height: 24px;
    }
  }
</style>
