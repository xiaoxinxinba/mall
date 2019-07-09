<template>
  <div class="main_container">
    <div class="main_p">
      <p>优惠活动可以促进买家下单或回购哦，赶快试一试吧！</p>
    </div>

    <div class="main_span">
      <span @click="dialogVisible = true">活动规则</span>
    </div>

    <div class="main_list">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="main_div">
            <div class="main_div_box">
              <div class="row icon_zhe">
                <h3>折扣促销</h3>
                <p>支持按全店/分类/单品设置折扣，支持按订单金额设置折扣。</p>
              </div>
              <div class="btn">
                <el-button type="primary" size="small" @click="goGoodsDiscount">发布活动</el-button>
              </div>
            </div>
            <span class="doing_icon" v-if="activityType[0].isStart===true"></span><!--进行中的样式-->
          </div>
        </el-col>
        <el-col :span="12">
          <div class="main_div">
            <div class="main_div_box">
              <div class="row icon_zeng">
                <h3>赠品促销</h3>
                <p>支持按订单金额赠送礼品，支持购买特定商品后赠送礼品，支持特定商品买几送几。</p>
              </div>
              <div class="btn">
                <el-button type="primary" size="small" @click="goGiftPromotion">发布活动</el-button>
              </div>
            </div>
            <span class="doing_icon" v-if="activityType[1].isStart===true"></span><!--进行中的样式-->
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <div class="main_div">
            <div class="main_div_box">
              <div class="row icon_quan">
                <h3>优惠券/折扣券</h3>
                <p>订单满一定金额，可减免特定金额，支持阶梯满减，以优惠券的形式供买家领取和使用。</p>
              </div>
              <div class="btn">
                <el-button type="primary" size="small" @click="discountList">发布活动</el-button>
              </div>
            </div>
            <!--<span class="doing_icon" v-if="activityType[2].isStart===true"></span>&lt;!&ndash;进行中的样式&ndash;&gt;-->
            <span class="doing_icon" v-if="activityType[2].isStart===true"></span><!--进行中的样式-->

          </div>
        </el-col>
        <el-col :span="12">
          <div class="main_div">
            <div class="main_div_box">
              <div class="row icon_you">
                <h3>满额包邮</h3>
                <p>订单满一定金额，即可包邮优惠。可设置全国部分地区包邮。</p>
              </div>
              <div class="btn">
                <el-button type="primary" size="small" @click="freeShippingList">发布活动</el-button>
              </div>
            </div>
            <span class="doing_icon" v-if="activityType[3].isStart===true"></span><!--进行中的样式-->
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <div class="main_div">
            <div class="main_div_box">
              <div class="row icon_fan">
                <h3>满额返券</h3>
                <p>订单满一定金额，支付成功后赠送给买家一定额度的优惠券，下次在本店购买时可使用。</p>
              </div>
              <div class="btn">
                <el-button type="primary" size="small" @click="fullRefundList">发布活动</el-button>
              </div>
            </div>
            <span class="doing_icon" v-if="activityType[4].isStart===true"></span><!--进行中的样式-->
          </div>
        </el-col>
        <el-col :span="12">
          <div class="main_div">
            <div class="main_div_box">
              <div class="row icon_cu">
                <h3>特价促销</h3>
                <p>可选择要促销的商品，直接设置活动价格，可用于促销一些缺码、规格属性不全的商品。</p>
              </div>
              <div class="btn">
                <el-button type="primary" size="small" @click="specialPromotionList">发布活动</el-button>
              </div>
            </div>
            <!--<span class="doing_icon" ></span>&lt;!&ndash;进行中的样式&ndash;&gt;-->
            <span class="doing_icon" v-if="activityType[6].isStart===true"></span><!--进行中的样式-->
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="优惠活动说明"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div class="dialog_box">
        <h3>一、通用规则</h3>
        <p>1、同一时间只能创建一个同类活动</p>
        <p>2、生效活动不可修改或终止</p>
        <p>3、活动持续时间为7-30天</p>
        <p>4、活动从开始日00:00:00生效，结束日23:59:59失效</p>
        <p>5、可对全店商品或指定商品进行设置</p>
        <p>6、同一时间多个活动优先级为：折扣促销 > 特价促销 > 优惠券 > 满折促销 > 满赠促销 > 指定赠 > 买几送几 > 满额返券 > 满额包邮</p>

        <h3 style="margin-top: 20px;">二、具体活动规则</h3>
        <h4>1. 折扣促销（指对商品设置折扣优惠）</h4>
        <p>（1）折扣不得高于原价的99%（9.9折）</p>
        <p>（2）同一商品不可同时设置“折扣促销”与“特价促销”</p>
        <p>（3）每人限购数量不低于1</p>

        <h4>2. 满折促销（指购买到一定金额后对商品打折）</h4>
        <p>（1）满折金额原则上不得高于1000元</p>
        <p>（2）折扣不得高于原价的99%（9.9折）</p>

        <h4>3. 优惠券/折扣券（指领取优惠券后，购买商品达到指定金额后可享受抵扣/打折优惠）</h4>
        <p>（1）使用券起计金额原则上不得高于100元</p>
        <p>（2）折扣不得高于原价的99%（9.9折）</p>
        <p>（3）优惠券额度为10元及以上5的整倍数。</p>
        <p>（4）优惠券使用时限为30-60天</p>

        <h4>4. 满赠促销（指购买达到指定金额后可获得指定赠品）</h4>
        <p>（1）满赠额度原则上不得高于100元</p>
        <p>（2）赠品与购买商品享有同等的质量保障与售后服务</p>

        <h4>5. 指定赠（指购买指定商品可获得指定赠品）</h4>
        <p>（1）同一商品不可同时设置“指定赠”与“买几赠几”</p>
        <p>（2）赠品与购买商品享有同等的质量保障与售后服务</p>

        <h4>6. 买几赠几（指购买指定商品满几件可赠送该商品几件）</h4>
        <p>（1）同一商品不可同时设置“买几赠几”与“指定赠”</p>
        <p>（2）赠品与主商品原则上一致</p>
        <p>（3）赠品与购买商品享有同等的质量保障与售后服务</p>

        <h4>7. 满额返券（指购买达到指定金额可获得指定金额的优惠券，用于下回购买使用）</h4>
        <p>（1）送券满额原则上不得高于100元</p>
        <p>（2）优惠券额度为10元以上5的整倍数</p>
        <p>（3）优惠券使用时限为30-60天</p>

        <h4>8. 满额包邮（指购买达到指定金额可免除邮费）</h4>
        <p>（1）送券包邮原则上不得高于100元</p>
        <p>（2）包邮区域优先设置为全国包邮</p>

        <h4>9. 特价促销（可选择具体商品直接设置活动价格）</h4>
        <p>（1）同一商品不可同时设置“折扣促销”与“特价促销”</p>
        <p>（2）特价商品有质量瑕疵的须充分展示</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GetOngoingShopActivityList from '../../../../api/ShopActivity/GetOngoingShopActivityList' // 买几个送几个de 详情
  export default {
    mounted() {

    },
    created() {
      this.getOngoingShopActivityList();
    },
    data() {
      return {
        dialogVisible: false,
        clientTimespan: new Date().toLocaleString(),
        clientVersion: '1',
        activityType: [
          {activityType: 1, isStart: false},
          {activityType: 2, isStart: false},
          {activityType: 3, isStart: false},
          {activityType: 4, isStart: false},
          {activityType: 5, isStart: false},
          {activityType: 6, isStart: false},
          {activityType: 7, isStart: false}
        ],
      }
    },
    methods: {
      getOngoingShopActivityList() {
        GetOngoingShopActivityList.call(this, `?clientTimespan=${this.clientTimespan}&clientVersion=${this.clientVersion}`)
          .then(res => {
              console.log(res);
              if (res.data.code === 1) {
                // console.log(('商家活动状态'));
                this.activityType = res.data.data;
                /*this.activityType.forEach(a=>{
                  console.log(a.activityType, a.isStart);
                })*/
              } else {
                this.$message.error('活动状态查询失败');
              }
            }
          )
      },
      /**
       * 跳转到商品折扣页面
       */
      goGoodsDiscount() {
        this.$router.push({name: 'GoodsDiscount'});
      },

      /**
       * 跳转到赠品促销页面
       */
      goGiftPromotion() {
        this.$router.push({name: 'GiftPromotion'});
      },

      /**
       * 跳转到优惠券/折扣券页面
       */
      discountList() {
        this.$router.push({name: 'DiscountList'});
      },

      /**
       * 跳转到包邮促销页面
       */
      freeShippingList() {
        this.$router.push({name: 'FreeShippingList'});
      },

      /**
       * 跳转到满额返券页面
       */
      fullRefundList() {
        this.$router.push({name: 'FullRefundList'});
      },

      /**
       * 跳转到特价促销页面
       */
      specialPromotionList() {
        this.$router.push({name: 'SpecialPromotionList'});
      },

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
