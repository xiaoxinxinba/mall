<template>
  <div class="container" v-loading="page_loading">
    <el-row :gutter="24">
      <el-col :span="12">
        <div class="box">
          <div class="top">
            <h3>重要提醒</h3>
            <router-link to="/sysMessage">查看更多</router-link>
          </div>

          <div class="content">
            <ul v-if="shopData.significanceReminds.length > 0">
              <li v-for="(item,index) in shopData.significanceReminds" :key="index">
                <span>{{item.title}}：</span>
                <i>{{item.content }}</i>
                <router-link :to="item.url">查看详情 >> </router-link>
              </li>
            </ul>
            <span v-else>暂无提醒</span>
          </div>
        </div>

        <div class="box">
          <div class="top">
            <h3>商品管理</h3>
            <router-link to="/goods">管理商品</router-link>
          </div>

          <div class="div_flex" style="margin-top: 20px;">
            <div>
              <span>出售中的商品</span>
              <span>
                <router-link :to="{name: 'GoodsMain'}">{{ shopData.goodsManager.putaway }}</router-link>
              </span>
            </div>

            <div>
              <span>仓库中的商品</span>
              <span>
                <router-link :to="{name: 'GoodsMain', query: {type: 1}}">{{ shopData.goodsManager.soldout }}</router-link>
              </span>
            </div>

            <div>
              <span>强制下架商品</span>
              <span>
                <router-link :to="{name: 'GoodsMain', query: {type: 2}}">{{ shopData.goodsManager.sysSlodout }}</router-link>
              </span>
            </div>

            <div>
              <span>回收商品</span>
              <span>
                <router-link :to="{name: 'GoodsRecycleBin'}">{{ shopData.goodsManager.waitCheck }}</router-link>
              </span>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="top">
            <h3>资金管理</h3>
          </div>

          <div class="div_order">
            <div class="line">
              <div>
                <span>待结算</span>
                <span class="color_fcbe82">
                  <router-link :to="{name: 'SettlementManagement'}">{{shopData.financeManage.waitSettleMoney }}</router-link>
                </span>
              </div>

              <div>
                <span>可提现</span>
                <span class="color_67a2e5">
                  <router-link :to="{name: 'cashIndex'}">{{shopData.financeManage.withdrawMoney }}</router-link>
                </span>
                <span class="btn">
                  <el-button type="primary" @click="$router.push({name: 'Tixian'})">我要提现</el-button>
                </span>
              </div>
            </div>

            <div class="line borderTop">
              <div>
                <span>本月累计结算</span>
                <span class="color_86c9ca">
                  <router-link :to="{name: 'AccountFlow'}">{{shopData.financeManage.monthTotalSettleMoney }}</router-link>
                </span>
              </div>

              <div>
                <span>本月累计提现</span>
                <span class="color_f19393">
                  <router-link :to="{name: 'AccountFlow'}">{{shopData.financeManage.monthTotalWithdrawMoney }}</router-link>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="top">
            <h3>发布优惠</h3>
            <router-link to="/market/discount">查看更多</router-link>
          </div>

          <div class="div_box2">
            <ul v-if="shopData.marketing.shopActivityInfo.length > 0">
              <li>
                <div v-for="(acItem,Index) in shopData.marketing.shopActivityInfo" :key="Index">
                  <span
                    :class="acItem.activityName === '折扣' ? 'icon1':
                    acItem.activityName === '赠品' ? 'icon2' :
                    acItem.activityName === '优惠券'? 'icon3' :
                    acItem.activityName === '包邮'? 'icon4' :
                    acItem.activityName === '返券'?'icon5': 'icon6' ">
                    <i>{{acItem.activityName}}</i>
                    <b>{{acItem.activityNumber }}</b>
                    <router-link
                    :to="acItem.activityName === '折扣' ? {name: 'AddDiscount', query:{name: 0, type: 'add'}} :
                    acItem.activityName === '赠品' ? {name: 'AddGift', query: {type: 'add'}} :
                    acItem.activityName === '优惠券'? {name: 'AddGoodsDiscount', query: {type: 'add'}} :
                    acItem.activityName === '包邮'? {name: 'AddFreeShipping', query: {type: 'add'}} :
                    acItem.activityName === '返券'? {name: 'AddFullRefund', query: {type: 'add'}} : {name: 'AddSpecialPromotion', query: {type: 'add'}}">立即发布</router-link>
                  </span>
                </div>
              </li>
            </ul>
            <div style="padding: 10px 0" v-else>暂无数据</div>
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="box">
          <div class="top">
            <h3>
              订单管理
            </h3>
            <router-link style="float: right;margin-left: 10px;" :to="{name: 'CompanyInfo'}">编辑</router-link>
            <span>
              <label>电话：</label>
              {{ shopData.orderManger.companyInfo.managerPhone  }}
            </span>
            <span>
              <label>负责人：</label>
              {{ shopData.orderManger.companyInfo.manager }}
            </span>
            <span>
              <label>电话：</label>
              {{ shopData.orderManger.companyInfo.managerPhone  }}
            </span>
            <span>
              <label>经办人：</label>
              {{ shopData.orderManger.companyInfo.manager }}
            </span>
          </div>

          <div class="div_flex">
            <div>
              <span>今日订单数</span>
              <span class="color_94ca86">
                <router-link  :to="{name: 'OrderList'}">{{ shopData.orderManger.paidNum }}</router-link>
              </span>
            </div>

            <div>
              <span>今日待接单</span>
              <span class="color_fcbe82">
                <router-link :to="{name: 'OrderList', query: {status: 1}}">{{ shopData.orderManger.waitAcceptNum }}</router-link>
              </span>
            </div>

            <div>
              <span>今日待发货</span>
              <span class="color_f19393">
                <router-link :to="{name: 'OrderList', query: {status: 200}}">{{ shopData.orderManger.waitShipping }}</router-link>
              </span>
            </div>

            <div>
              <span>今日退单数</span>
              <span class="color_efa5e5">
                <router-link :to="{name: 'AfterSale'}">{{ shopData.orderManger.backNum }}</router-link>
              </span>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="top">
            <h3>价格管理</h3>
            <router-link to="/goods">管理价格</router-link>
          </div>

          <div class="div_flex no_border">
            <div>
              <span>调价待审核</span>
              <span>
                <router-link :to="{name: 'GoodsMain'}">{{shopData.shopArticlePriceAuditCount.awaitCount }}</router-link>
              </span>
            </div>

            <div>
              <span>调价未通过</span>
              <span>
                <router-link :to="{name: 'GoodsMain'}">{{shopData.shopArticlePriceAuditCount.unqualifiedCount }}</router-link>
              </span>
            </div>

            <div>
              <span>调价已通过</span>
              <span>
                <router-link :to="{name: 'GoodsMain'}">{{shopData.shopArticlePriceAuditCount.qualifiedCount }}</router-link>
              </span>
            </div>
          </div>

          <div class="div_p">
            <p>根据销售情况以及节假日情况进行适当的价格调整，可能会增加销量哦～
              <router-link to="/goods">去管理价格</router-link>
            </p>
          </div>
        </div>

        <div class="box">
          <div class="top">
            <h3>信用管理</h3>
          </div>

          <div class="div_tips">
            <p>保证金：
              <router-link :to="{name: 'Bond'}">{{shopData.shopCreditManager === null ? 0 :
                shopData.shopCreditManager.currentDeposit}}元</router-link>
            </p>
          </div>

          <div class="div_flex">
            <div>
              <div class="div_span">
                <h3>店铺评分：</h3>
                <p>
                  <label>
                    商品描述：
                    <router-link :to="{name: 'CommentManage'}">{{GetCredit("1")}}</router-link>
                  </label>
                  <label>
                    服务态度：
                    <router-link :to="{name: 'CommentManage'}">{{GetCredit("3")}}</router-link>
                  </label>
                </p>
                <p>
                  <label>
                    商品包装：
                    <router-link :to="{name: 'CommentManage'}">{{GetCredit("2")}}</router-link>
                  </label>
                  <label>
                    物流速度：
                    <router-link :to="{name: 'CommentManage'}">{{GetCredit("4")}}</router-link>
                  </label>
                </p>
              </div>
            </div>

            <div>
              <div class="div_span">
                <h3>店铺信誉：</h3>
                <p>
                  <label>
                    信誉等级：
                    <router-link :to="{name: 'ShopReputation'}">{{shopData.shopCreditManager.businessReputationtTotalScore.reputationGrade ? shopData.shopCreditManager.businessReputationtTotalScore.reputationGrade : 0 }}</router-link>
                  </label>
                </p>
                <p>
                  <label>
                    信誉评分：
                    <router-link :to="{name: 'ShopReputation'}">{{shopData.shopCreditManager.businessReputationtTotalScore.rtTotalScore ? shopData.shopCreditManager.businessReputationtTotalScore.rtTotalScore : 0}}</router-link>
                  </label>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="top">
            <h3>经营分析</h3>
            <router-link :to="{name: 'ManageAnalyze'}">查看更多</router-link>
          </div>

          <div class="div_box1">
            <ul>
              <li>
                <div>
                  <span class="icon12">
                    <i>成交订单</i>
                    <b><router-link :to="{name: 'OrderList'}">{{shopData.manageAnalyze.paidNum}}</router-link></b>
                  </span>
                </div>
                <div>
                  <span class="icon22">
                    <i>退单订单</i>
                    <b><router-link :to="{name: 'AfterSale'}">{{shopData.manageAnalyze.backNum}}</router-link></b>
                  </span>
                </div>
                <div>
                  <span class="icon32">
                    <i>纠纷订单</i>
                    <b><router-link :to="{name: 'TradeDispute'}">{{shopData.manageAnalyze.saleDisputeNum}}</router-link></b>
                  </span>
                </div>
              </li>

              <li>
                <div>
                  <span class="icon42">
                    <i>订单总额</i>
                    <b>{{shopData.manageAnalyze.paidMoney }}</b>
                  </span>
                </div>
                <div>
                  <span class="icon52">
                    <i>退单总额</i>
                    <b>{{shopData.manageAnalyze.backMoney  }}</b>
                  </span>
                </div>
                <div>
                  <span class="icon62">
                    <i>纠纷总额</i>
                    <b>{{shopData.manageAnalyze.saleDisputeMoney }}</b>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="footer">
      <p>满集网全国统一服务热线 400-6766-999</p>
      <div>
        <span>友情链接：</span>
        <a href="#">满惠云</a> |
        <a href="#">计划管理系统</a> |
        <a href="#">协同办公</a> |
        <a href="#">房地产管理系统</a> |
        <a href="#">营销客服系统</a> |
        <a href="#">财务管理系统</a> |
        <a href="#">成本管理系统</a> |
        <a href="#">工程管理系统</a>
      </div>
    </div>

    <SoldOut></SoldOut>
  </div>
</template>

<script>
  import GetShopData from '../../../src/api/Index/GetShopData'
  import SoldOut from '@/components/public/soldOut'

  export default {
    components: {},
    created() {
      this.getShopData();
    },
    data() {
      return {
        shopActivityInfo_init: [
          {
            activityName: "折扣",
            activityNumber: 0,
          },
          {
            activityName: "赠品",
            activityNumber: 0,
          },
          {
            activityName: "优惠券",
            activityNumber: 0,
          },
          {
            activityName: "包邮",
            activityNumber: 0,
          },
          {
            activityName: "返券",
            activityNumber: 0,
          },
          {
            activityName: "特价",
            activityNumber: 0,
          },
        ], //商家活动

        page_loading: false,
        shopData: {
          significanceReminds: [], //重要提醒
          orderManger: {
            backNum: 0,
            paidNum: 0,
            waitAcceptNum: 0,
            waitShipping: 0,
            companyInfo: {
              applier: "经办人",
              applierPhone: "xxxxxxxxx",
              manager: "负责人",
              managerPhone: "xxxxxxxxx",
            }  //相关负责人
          },  //订单管理
          goodsManager: {
            putaway: 0,
            soldout: 0,
            sysSlodout: 0,
            waitCheck: 0,
          }, //商品管理
          shopArticlePriceAuditCount: {
            awaitCount: 0,
            qualifiedCount: 0,
            unqualifiedCount: 0,
          },//价格管理
          financeManage: {
            waitSettleMoney: 0,
            withdrawMoney: 0,
            monthTotalSettleMoney: 0,
            monthTotalWithdrawMoney: 0,
          },//资金管理
          shopCreditManager: {
            businessReputationtOvera: [],
            businessReputationtTotalScore: {}
          },//信用管理
          marketing: {
            shopActivityInfo: [
              {
                activityName: "折扣",
                activityNumber: 0,
              },
              {
                activityName: "赠品",
                activityNumber: 0,
              },
              {
                activityName: "优惠券",
                activityNumber: 0,
              },
              {
                activityName: "包邮",
                activityNumber: 0,
              },
              {
                activityName: "返券",
                activityNumber: 0,
              },
              {
                activityName: "特价",
                activityNumber: 0,
              },
            ] //商家活动
          },//发布优惠
          manageAnalyze: {
            backMoney: 0,
            backNum: 0,
            paidMoney: 0,
            paidNum: 0,
            saleDisputeMoney: 0,
            saleDisputeNum: 0
          }, //经营分析
        },  //店铺数据
        clientVersion: "1",
      }
    },
    methods: {
      getShopData() {
        this.page_loading = true;
        GetShopData.call(this, `?clientTimespan=${this.$Tool.formatDate(new Date())}&clientVersion=${this.clientVersion}`).then(res => {
          this.page_loading = false;
          if (res.data.code === 1) {
            this.shopData = res.data.data;
            if (this.shopData.marketing.shopActivityInfo.length === 0) {
              this.shopData.marketing.shopActivityInfo = this.shopActivityInfo_init;
            }
          } else {
            this.$message.error(res.data.desc);
          }
        });
      },
      GetCredit(obj) {
        if (this.shopData.shopCreditManager === null) {
          return 0;
        }
        let model = this.shopData.shopCreditManager.businessReputationtOvera.filter(function (item) {
          return item.bosSsScoringItems === obj
        });
        return model ? 0 : model.average;
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/index.less";
</style>
