<template>
  <div class="main">
    <div class="set_price">
      <div class="set_timeselect">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="时 间：">
            <el-date-picker
              v-model="timestart"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label=" - ">
            <el-date-picker
              v-model="timeend"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="转账账户：">
            <el-input v-model="formInline.user" placeholder="请输入转账账户"></el-input>
          </el-form-item>
          <el-form-item label="交易流水号：">
            <el-input v-model="formInline.number" placeholder="请输入交易流水号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="$router.push({name: 'Zhuanzhang'})">转账</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格 -->
      <div class="set_table">
        <el-table
          :header-cell-style="{backgroundColor: '#f1f1f3', color: '#000', textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}"
          v-loading="table_loading"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号"
            width="72">
          </el-table-column>
          <el-table-column
            prop="touser_role_value"
            label="转账账户"
            width="255">
          </el-table-column>
          <el-table-column
            prop="transaction_no"
            label="交易流水">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="转账金额">
          </el-table-column>
          <el-table-column
            prop="complete_time"
            label="转账时间">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="toDetail(scope.row)">查看详情</el-button>
            </template>
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
  import GetUserTransionList from '@/api/ShopPay/GetUserTransionList'
  export default {
    name: "transferList",
    data() {
      return {
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,
        formInline: {
          user: '',//账户
          number: '',//流水号
        },
        timestart: '',
        timeend: '',
        table_loading: false,
        tableData: [],
      }
    },
    created() {
      this.getTableData();
    },
    methods: {
      toDetail(item) {
        this.$router.push({
          name: 'TransferDetail',
          query: {
            transionNo: item.transaction_no,
          }
        })
      },
      getTableData() {
        this.table_loading = true;
        GetUserTransionList.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}&input.pageSize=${this.pageSize}&input.pageIndex=${this.currentPage}`).then(res => {
          this.table_loading = false;
          if (res.data.code === 1) {
            this.pageTotal = res.data.data.record_count;
            this.tableData = res.data.data.item_list;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.table_loading = false;
        })
      },
      onSubmit() {
        this.getTableData()
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
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;
    padding: 18px;
    // 待结算
    .set_price {
      height: 100%;
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
