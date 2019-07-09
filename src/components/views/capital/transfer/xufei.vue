<template>
  <div class="xufei">
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="num"
        label="编号"
        width="72">
      </el-table-column>
      <el-table-column
        prop="number"
        label="交易流水">
      </el-table-column>
      <el-table-column
        prop="price"
        label="续费金额">
      </el-table-column>
      <el-table-column
        prop="period"
        label="续费合约期">
      </el-table-column>
      <el-table-column
        width="100"
        prop="status"
        label="续费合约期">
      </el-table-column>
      <el-table-column
        prop="time"
        label="续费时间">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <router-link v-if="scope.row.status === '已续费'" :to="{name: 'ContractIndex'}">查看详情</router-link>
          <router-link v-else :to="{name: 'ContractIndex'}">续费</router-link>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 10px;text-align: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'xufei',
    data() {
      return {
        currentPage: 1,
        tableData: [
          {
            num: 1,
            number: '12321',
            price: 5000,
            period: '2019-01-01 至 2020-01-01',
            status: '未续费',
            time: '2019-01-01 12:46:11',
          },
          {
            num: 1,
            number: '12321',
            price: 5000,
            period: '2019-01-01 至 2020-01-01',
            status: '已续费',
            time: '2019-01-01 12:46:11',
          },
        ]
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    }
  }
</script>

<style lang="less" scoped>
  .xufei {
    padding: 20px;
    background-color: #fff;
    overflow: hidden;
  }
</style>
