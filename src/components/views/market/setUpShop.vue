<template>
  <div class="discount_box">
    <div class="btn">
      <ul>
        <li class="active">我的推荐</li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <!--条件筛选 start-->
    <div class="screen">
      <el-form :inline="true" class="demo-form-inline" label-width="100px">

        <el-form-item label="姓名/手机号：">
          <el-input placeholder="请输入姓名或手机号" v-model="title"></el-input>
        </el-form-item>

        <el-form-item label="开店状态：">
          <el-select v-model="discountValue" clearable placeholder="请选择">
            <el-option
              v-for="(item, i) in discountOptions"
              :key="i"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">重置</el-button>
        </el-form-item>

        <el-form-item class="lineStyle">
          <span><i class="el-icon-info" @click="rulesVisible = true"></i> 推荐奖励规则</span>
        </el-form-item>

      </el-form>
    </div>
    <!--条件筛选 end-->
    <div>
      <el-table
        :data="discountData"
        border
        style="width: 100%">
        <el-table-column
          prop="user"
          label="推荐用户"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          align="center">
        </el-table-column>
        <el-table-column
          prop="time"
          label="推荐时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="state"
          label="开店状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop="openTime"
          label="开店时间"
          align="center">
        </el-table-column>
        <el-table-column
          label="奖励结算状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.rewardState === 0">未结算 <i @click="stateTips(0)" style="font-size: 16px; cursor:pointer;" class="el-icon-question"></i></span>
            <span v-if="scope.row.rewardState === 1">已结算 <i @click="stateTips(1)" style="font-size: 16px; cursor:pointer;" class="el-icon-question"></i></span>
          </template>
        </el-table-column>
      </el-table>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>

    <el-dialog
      title="推荐奖励规则"
      :visible.sync="rulesVisible"
      width="600px">
      <div class="rulesBox">
        <p>1、被推荐商家在被推荐后的2个月内，成功发布10个商品的，视为推荐开店成功；</p>
        <p>2、推荐开店成功后，推荐人可获得100元抵扣券和1000个满意豆；</p>
        <p>3、推荐奖励将在推荐成功后的30日内发放到推荐商家满集网账户；</p>
        <p>4、被推荐商家持续经营次年续约时即可享受平台使用年费20%的优惠；</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rulesVisible = false">知道了</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="tipsVisible"
      width="500px">
      <div class="tipsBox">
        <p v-if="state === 0">{{noSettled}}</p>
        <p v-if="state === 1">{{settled}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tipsVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        title : '',
        time: [], // 折扣时间值
        discountOptions: [{  // 折扣活动状态选项
          value: 0,
          label: '全部状态'
        }, {
          value: 1,
          label: '已开店'
        }, {
          value: 2,
          label: '未开店'
        }],
        discountValue: 0, // 开店状态
        discountData: [{
          id: 0,
          user: '张三',
          phone: '136****1235',
          time: '2019-12-04 12:12:12',
          state: '未开店',
          openTime: '-',
          rewardState: 0, // 0是为结算，1是已结算
        }, {
          id: 0,
          user: '张三',
          phone: '136****1235',
          time: '2019-12-04 12:12:12',
          state: '未开店',
          openTime: '2016-12-04 12:12:12',
          rewardState: 1, // 0是未结算，1是已结算
        }],
        pageIndex: 1,
        pageSize: 5,
        rulesVisible: false,
        tipsVisible: false,
        noSettled: '被推荐用户未在您推荐后的2个月内开店成功本次推荐视为无效，无法结算奖励', // 未结算提示信息
        settled: '推荐奖励已结算到手机号为136****1564的账户，可在满集网APP中购物时享受优惠', // 已结算提示信息
        state: 0,
      }
    },
    methods: {
      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        this.pageSize = val;
        this.pageIndex = 1;
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
      },

      /**
       * 点击显示不同结算状态的提示信息
       * @param state
       */
      stateTips( state ) {
        this.tipsVisible = true;
        this.state = state;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/setUpShop.less";
</style>
