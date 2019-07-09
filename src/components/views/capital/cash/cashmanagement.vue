<template>
  <div class="cash">
    <el-row class="set_monney">
      <el-col :span="16">
        <div class="set_money_left">
          <div class="set_money_1">
            <span  class="set_money_total">账户总额<img title="可提现、待结算金额之和" src="../../../public/img/icon_wenhao.png"/></span>
            <span class="set_money_totalmoney">&yen;{{ totalprice.toFixed(2) }}</span>
          </div>
          <div class="set_money_2">
            <div class="set_money_2_top">
              <p  class="set_money_total">待结算金额<img title="可提现至银行卡的金额" src="../../../public/img/icon_wenhao.png"/></p>
              <p class="set_money_blance"><span class="balnce_span">&yen;{{ settlementprice.toFixed(2) }} </span><el-button v-for="(item,i) in btnlist" :key=i size="small" @click='changePage(item.name)'>{{ item.name}}</el-button></p>
<!--              <p><span>申请提现</span><a href="">请先绑定银行卡</a></p>-->
            </div>
            <div class="set_money_2_bottom">
              <p class="title" style="font-weight: 700;">为什么买家付款了，钱不能提现？</p>
              <p>买家付款后，金额计入待结算金额。确认收货后，7天内未申请退款售后，</p>
              <p>金额计入结算金额，商家可提现。"</p>
            </div>
          </div>
        </div>

      </el-col>
      <el-col :span="8" class="set_money_right">
        <ul>
          <li>
            <div><span class="square1"></span></div>
            <div>
              <p>
                <span>今日订单数</span>
              </p>
              <p style="text-decoration: underline;">{{orderInfo.todayOrderCount}}</p>
            </div>
          </li>
          <li>
            <div><span class="square2"></span></div>
            <div>
              <p>
                <span>今日订单金额(元)</span>
              </p>
              <p>{{orderInfo.todayOrderMoney}}</p>
            </div>
          </li>
        </ul>
        <ul>
          <li>
            <div><span class="square1"></span></div>
            <div>
              <p>
                <span>今日退单数</span>
              </p>
              <p style="text-decoration: underline;">{{orderInfo.todayBackOrderCount}}</p>
            </div>
          </li>
          <li>
            <div><span class="square2"></span></div>
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


    <!-- 最近流水 -->
    <div class="recentflow">
      <p><span class="title">最近流水</span></p>
      <p class="rec_right"><router-link :to="{name: 'AccountFlow'}">更多流水>></router-link></p>
      <el-table
        :data="accData"
        border
        v-loading="table_loading"
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="72">
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="流水号"
          width="420">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="old_value"
          label="初始值">
        </el-table-column>
        <el-table-column
          class-name="upDate1"
          prop="value"
          label="变动值 ">
          <template slot-scope="scope">
            <strong v-if="scope.row.value <= 0" style="color: rgb(0, 128, 0)">{{scope.row.value}}</strong>
            <strong v-else style="color: rgb(255, 0, 0)">{{scope.row.value}}</strong>
          </template>

        </el-table-column>
        <el-table-column
          prop="new_value"
          label="期末值">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="变动时间">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 10px;text-align: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="table_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import GetGeneralAmountInfo from '@/api/Finance/GetGeneralAmountInfo'
  import GetAmountLogList from '@/api/Finance/GetAmountLogList'
  export default {
    data(){
      return {
        table_total: 0,
        table_loading: false,
        pageSize: 10,
        currentPage: 1,
        totalprice:0,
        settlementprice:0,
        choice:'提现',
        accData:[],
        btnlist:[
          {name:'提现',path:'tixian'},
          {name:'转账',path:'zhuanzhang'},
          // {name:'续费',path:'xufei'},
          {name:'银行卡',path:'yinhangka'},
        ],
        orderInfo: {
          todayBackOrderCount: 0,
          todayOrderCount: 0,
          todayOrderMoney: 0,
          totalBackOrderCount: 0,
        },

      }
    },
    created() {
      this.getTableData();
      this.generalInit();
    },
    methods:{
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
      changePage(data){
        this.choice = data;
        switch (data) {
          case '提现':

            this.$router.push({name: "Tixian"});
            break;
          case '转账':
            this.$router.push({name: "Zhuanzhang"});
            break;
          case '续费':
            this.$router.push({name: "Xufei"});
            break;
          case '银行卡':
            this.$router.push({name: "bankLegal"});
            break;
        }
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
      getTableData() {
        this.table_loading = true;
        GetAmountLogList.call(this, `?input.pageSize=${this.pageSize}&input.pageIndex=${this.currentPage}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          this.table_loading = false;
          if (res.data.code === 1) {
            this.accData = res.data.data.data;
            this.table_total = res.data.data.recordCount;
          } else {
            this.$message.error(res.data.desc)
          }
        }).catch(e => {
          this.table_loading = false;
        })
      }
    }
  }
</script>

<style lang="less">
  .cash{
    .set_monney {
      background-color: #fff;
      .set_money_left{
        padding: 0 15px;
        img{
          width: 14px;
          height: 14px;padding-top: 2px;
          margin: 0 0 0 9px;
        }
        .set_money_total{
          font-size: 14px;
          color: #999999;
          display: flex;
          align-items: center;
          padding-left: 16px;
        }
        .set_money_1{
          display: flex;
          align-items: center;
          line-height: 103px;
          border-bottom:1px solid #cccccc;
          .set_money_totalmoney{
            font-size: 36px;
            color: #ff0000;
            margin-left: 25px;
          }
        }
        .set_money_2{
          display: flex;
          padding: 10px 0px;
          .set_money_2_top{
            width: 50%;
            height: 132px;
            border-right: 1px solid #ccc;
            p:last-child{
              margin-top: 20px;
            }
            .set_money_blance{
              font-size: 24px;
              line-height: 31px;
              letter-spacing: 0px;
              color: #666666;
              .balnce_span{
                margin-left: 16px;
                margin-right: 10%;
              }
            }
            .el-button{
              height: 22px;
              border: 1px solid #00a2ff;
              color: #00a2ff;
              line-height: 0px;
              text-align: center;
              padding: 10px;

            }
          }
          .set_money_2_bottom{
            padding: 10px 0 10px 5%;
            .title{
              color: #000;
            }
            p:not(first-child){
              color: #999;
              margin-bottom: 14px;;
            }
          }
          .set_money_total{
            font-size: 14px;
            color: #999999;
            display: flex;
            align-items: center;
            margin-bottom: 14px;
          }
          img{
            width: 14px;
            height: 14px;padding-top: 2px;
            margin: 0 0 0 9px;
          }
        }

      }

      .set_money_right{
        background-color: #fcfbf7;
        color: #00a2ff;
        padding: 63px 45px;
        ul{
          display:flex;
          flex-wrap: wrap;
          width: 100%;
          li{
            display: flex;
            align-items: flex-start;
            flex: 1;
            // width: 33%;
          }
          .square1{
            display: inline-block;
            width: 11px;
            height: 11px;
            background: #ff8400;
            margin-right: 10px;
            margin-top: 3px;
          }
          .square2{
            display: inline-block;
            width: 11px;
            height: 11px;
            background: #00a2ff;
            margin-right: 10px;
            margin-top: 3px;
          }
          p:last-child{
            font-size: 24px;
            line-height: 46px;
          }
        }
      }
    }
    .recentflow{
      margin-top: 20px;
      padding: 20px;
      height: 100%;
      background-color: #fff;
      .el-table{
        .cell{
          text-align: center;
        }

        .el-table__header-wrapper{
          background-color: #000!important;
        }
        .upDate1{
          .cell{
            color: #429c11!important;
          }
        }
        .is-leaf{
          background-color: #f1f1f3;
          .cell{
            color: #000!important;
          }
        }
      }
      .title{
        font-weight: 600;
      }
      .rec_right{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
