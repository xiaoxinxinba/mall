<template>
  <div class="accflow">
    <div class="set_timeselect">
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="变动类型：">
            <el-select v-model="formInline.region">
              <el-option label="全部" value="0"></el-option>
              <el-option label="收入" value="1"></el-option>
              <el-option label="支出" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="block">
          <span class="demonstration">时&emsp;间：</span>
          <el-date-picker
            v-model="timestart"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <div class="block block-line">—</div>
        <div class="block">
          <el-date-picker
            v-model="timeend"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
    <div class="acc_table">
      <ul class="acc_table_title">
        <li><span class="square1"></span><span> 收入 :{{ shouru.toFixed(2) }}</span></li>
        <li><span class="square2"></span><span> 支出 :{{ zhichu.toFixed(2) }}</span></li>
      </ul>
      <el-table
        v-loading="table_loading"
        :data="accData"
        @filter-change="filterHandler"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="72">
        </el-table-column>
        <el-table-column
          prop="order_no"
          label="流水号"
          width="370">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          :filters="filters_list"
          :filter-multiple="false">
        </el-table-column>
        <el-table-column
          prop="old_value"
          label="初始值">
        </el-table-column>
        <el-table-column
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
      <div class="page">
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
  </div>
</template>

<script>
  import GetAmountLogList from '@/api/Finance/GetAmountLogList'
  export default {
    data() {
      return {
        table_loading: false,
        pageTotal: 0,
        currentPage: 1,//当前页码
        pageSize: 10,//页面大小
        shouru: 6000,
        zhichu: 1000,
        formInline: {
          user: '',
          region: '0',
        },
        timestart: '',
        timeend: '',
        filters_list: [
          {
            text: '充值',
            value: '1',
          },
          {
            text: '自动提现',
            value: '7',
          },
          {
            text: '用户提现',
            value: '6',
          },
          {
            text: '提现退回',
            value: '8',
          },
          {
            text: '订单结算',
            value: '14',
          },
        ],
        accData: [],
        amountType: 17,
      }
    },
    created() {
      this.getTableData();
    },
    methods: {
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
      onSubmit() {
        this.getTableData();
      },
      //表格筛选
      filterHandler(obj) {
        console.log('obj:', obj);
        Object.keys(obj).forEach(key => {
          if (obj[key].length > 0) {
            this.amountType = obj[key][0]
          } else {
            this.amountType = 17;
          }
        });
        this.getTableData();
      },
      //
      getTableData() {
        this.table_loading = true;
        GetAmountLogList.call(this, `?input.type=${this.formInline.region}&input.amountType=${this.amountType}&input.startTime=${this.timestart}&input.endTime=${this.timeend}&input.pageSize=${this.pageSize}&input.pageIndex=${this.currentPage}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          this.table_loading = false;
          if (res.data.code === 1) {
            this.accData = res.data.data.data;
            this.pageTotal = res.data.data.recordCount;
            this.shouru = res.data.data.meonryUseInfo.income;
            this.zhichu = res.data.data.meonryUseInfo.expenditure;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.table_loading = false;
        })
      }
    },
  }
</script>

<style lang="less">
  .accflow {
    height: 100%;
    padding: 20px;
    padding-bottom: 0px;
    background-color: #fff;

    .set_timeselect {
      background-color: #ecf4fa;
      padding: 21px 0 23px 20px;
      border-bottom: 1px solid rgba(0, 162, 255, 0.49);
      >div{
        vertical-align: middle;
        display: inline-block;
        margin-right: 30px;
        .block{
          display: inline-block;
          /deep/ .el-input{
            width: 170px;
          }

        }
        .block-line{
          color: #606266;
        }

        /deep/ button{
          padding: 0px;
          width: 100px;
          height: 36px;
        }
      }
      .demonstration{
        color: #333333;
      }
      /deep/ .el-form-item{
        margin: 0px;
      }
      /deep/ .el-form-item__label{
        line-height: 40px;
        color: #333333;
        padding: 0px;
      }
      /deep/ .el-select{
        line-height: 36px;
      }

      .el-input__inner {
        height: 36px;
        width: 170px;
        border-radius: 0;
      }



    }




    .acc_table_title {
      display: flex;

      li {
        margin-right: 14px;
        padding: 20px 10px 10px 20px;

        .square1 {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #429c11;
          margin-right: 10px;
          margin-top: 3px;
        }

        .square2 {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #ff0000;
          margin-right: 10px;
          margin-top: 3px;
        }
      }

      li:first-child {
        color: #429c11
      }

      li:last-child {
        color: #ff0000
      }
    }

    //表格样式
    .acc_table {

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

    .page {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
