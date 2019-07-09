<template>
  <div class="settlementmanagement">
    <el-row class="set_monney">
      <el-col :span="16">
        <el-row class="set_money_left">
          <el-col :span="12" class="set_money_1">
            <div class="set_money_total">账户总额
              <span style="position: relative;">
                <img src="../../public/img/icon_wenhao.png"/>
                <div class="set_money_tip">
                  <p>可提现、待结算金额之和</p>
                </div>
              </span>
            </div>
            <div class="set_money_totalmoney">&yen;{{ totalprice.toFixed(2) }}</div>
          </el-col>
          <el-col :span="12" class="set_money_2">
            <div class="set_money_total">待结算金额
              <span style="position: relative;">
                <img src="../../public/img/icon_wenhao.png"/>
                <div class="set_money_tip">
                  <p>1、此金额不可提现</p>
                  <p>2、此金额为买家付款后但未结算的订单金额总和</p>
                  <p>3、7天内未申请退款售后且订单结算后才可提现</p>
                </div>
              </span>
            </div>
            <p class="set_money_blance">&yen;{{ settlementprice.toFixed(2) }}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="set_money_right">
        <ul>
          <li>
            <div><span class="square"></span></div>
            <div>
              <p>
                <span>今日订单数</span>
              </p>
              <p>{{orderInfo.todayOrderCount}}</p>
            </div>
          </li>
          <li>
            <div><span class="square"></span></div>
            <div>
              <p>
                <span>今日订单金额(元)</span>
              </p>
              <p>&yen;{{orderInfo.todayOrderMoney}}</p>
            </div>
          </li>
        </ul>
        <ul>
          <li>
            <div><span class="square"></span></div>
            <div>
              <p>
                <span>今日退单数</span>
              </p>
              <p>{{orderInfo.todayBackOrderCount}}</p>
            </div>
          </li>
          <li>
            <div><span class="square"></span></div>
            <div>
              <p>
                <span>累计退单数</span>
              </p>
              <p>{{orderInfo.totalBackOrderCount}}</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>


    <div class="title">
      <span>待结算金额流水</span>
    </div>
    <!-- 资金管理流水 -->
    <div class="set_price">
      <div class="set_timeselect">
        <div class="block">
          <span class="demonstration">时&emsp;间：</span>
          <el-date-picker
            v-model="timestart"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration"> - </span>
          <el-date-picker
            v-model="timeend"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="订单号：">
            <el-input v-model="formInline.number" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格 -->
      <div class="set_table">
        <el-table
          v-loading="table_loading"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            label="编号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="orderDate"
            label="交易时间"
            width="255">
          </el-table-column>
          <el-table-column
            prop="orderNo"
            label="订单号">
          </el-table-column>
          <el-table-column
            prop="orderMoney"
            label="订单金额">
          </el-table-column>
          <el-table-column
            prop="backOrderMoney"
            label="退款金额">
          </el-table-column>
          <el-table-column
            prop="waitSettleMoney"
            label="待结算金额">
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        style="margin-top: 10px;text-align: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import GetShopOrderSettleLog from '@/api/Finance/GetShopOrderSettleLog'
  import GetGeneralAmountInfo from '@/api/Finance/GetGeneralAmountInfo'
  import moment from 'moment';

  export default {
    data() {
      return {
        pageTotal: 0,
        table_loading: false,
        currentPage: 1,
        pageSize: 10,
        motaiflag: false,
        totalprice: 0,
        settlementprice: 0,
        formInline: {
          user: '',
          number: '',
        },
        orderInfo: {
          todayBackOrderCount: 0,
          todayOrderCount: 0,
          todayOrderMoney: 0,
          totalBackOrderCount: 0,
        },
        timestart: '',
        timeend: '',
        tableData: [],
      }
    },
    created() {
      this.generalInit();
      this.getTableData();
    },
    methods: {
      //通用信息
      generalInit() {
        GetGeneralAmountInfo.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.orderInfo = res.data.data.orderInfo;
            this.totalprice = res.data.data.amountInfo.totalMoney;
            this.settlementprice = res.data.data.amountInfo.waitSettleMoney;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      onSubmit() {
        this.getTableData();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getTableData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getTableData();
      },
      //获取表格数据
      getTableData() {
        this.table_loading = true;
        GetShopOrderSettleLog.call(this, `?input.orderNo=${this.formInline.number}&input.startTime=${this.timestart || ''}&input.endTime=${this.timeend || ''}&input.pageSize=${this.pageSize}&input.pageIndex=${this.currentPage}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          this.table_loading = false;
          if (res.data.code === 1) {
            this.tableData = res.data.data.pageList;
            this.pageTotal = res.data.data.recordCount;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.table_loading = false;
        })
      },
    },
    computed: {}
  };
</script>

<style lang="less">
  //顶部样式
  .settlementmanagement {
    .set_monney {
      background-color: #fff;

      .set_money_left {
        padding: 33px 10px;

        img {
          width: 14px;
          height: 14px;
          padding-top: 2px;
          margin: 0 0 0 9px;
        }

        .set_money_total {
          position: relative;
          font-size: 14px;
          color: #999999;

          .set_money_tip {
            position: absolute;
            top: 15px;
            left: 20px;
            width: 200px;
            border: 1px solid #666666;
            padding: 15px;
            display: none;
            background-color: #fcfbf7;

            p {
              line-height: 26px;
            }
          }
        }

        .set_money_total span:hover .set_money_tip {
          display: block;
        }

        .set_money_1 {
          border-right: 1px solid #e1e1e1;
          padding: 18px;
          text-align: center;

          .set_money_totalmoney {
            font-size: 36px;
            color: #ff0000;
          }
        }

        .set_money_2 {
          padding: 18px;
          text-align: center;

          .set_money_blance {
            font-size: 24px;
            color: #666666;
            margin-top: 10px;
          }

        }
      }

      .set_money_right {
        background-color: #fcfbf7;
        color: #00a2ff;
        height: 100%;
        padding: 17px 20px;

        ul {
          display: flex;
          width: 100%;

          li {
            display: flex;
            align-items: flex-start;
            flex: 1;
          }

          .square {
            display: inline-block;
            width: 11px;
            height: 11px;
            background: #00a2ff;
            margin-right: 10px;
            margin-top: 3px;
          }

          p:last-child {
            font-size: 24px;
            line-height: 46px;
          }
        }
      }
    }

    //标题
    .title {
      margin-top: 20px;
      border-bottom: 2px solid #00a2ff;

      span {
        font-weight: 900;
        width: 120px;
        height: 36px;
        background-color: #00a2ff;
        border-radius: 3px 3px 0px 0px;
        font-size: 14px;
        line-height: 31px;
        letter-spacing: 0px;
        color: #ffffff;
        display: flex;
        justify-content: center;
      }

      // display: inline-block;


    }

    // 待结算
    .set_price {
      height: 100%;
      padding: 18px;
      background-color: #fff;

    }

    //查询样式
    .set_timeselect {
      display: flex;
      // align-items: center;
      background-color: #ecf4fa;
      padding: 16px;
      padding-top: 26px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 162, 255, 0.49);

      .el-input__inner {
        height: 36px;
      }

      .demonstration {
        margin: 0 8px;
      }

      .el-form {
        //  padding-top:10px;
        margin-left: 28px;
      }
    }

    //表格样式

    .set_table {
      margin-top: 20px;

      .el-table {
        .cell {
          text-align: center;
        }

        .el-table__header-wrapper {
          background-color: #000 !important;
        }

        .upDate1 {
          .cell {
            color: #429c11 !important;
          }
        }

        .is-leaf {
          background-color: #f1f1f3;

          .cell {
            color: #000 !important;
          }
        }
      }
    }
  }

</style>
