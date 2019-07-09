<template>
  <div class="main">
    <div style="margin-bottom: 10px">
      <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'PermissionDetail'})">添加角色</el-button>
    </div>
    <div>
      <el-table
        :header-cell-style="{backgroundColor: '#f1f1f3', color: '#000', textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}"
        v-loading="table_loading"
        :data="table_data"
        border
        style="width: 100%">
        <el-table-column
          label="编号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === '0'">启用</div>
            <div v-if="scope.row.status === '1'">禁用</div>
            <div v-if="scope.row.status === '2'">已删除</div>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.status !== '2'">
              <el-button type="text" v-if="scope.row.status === '1'" @click="statusChange(scope.row, '0')">启用</el-button>
              <el-button type="text" v-if="scope.row.status === '0'" @click="statusChange(scope.row, '1')">禁用</el-button>
              <el-button type="text" @click="permissionEdit(scope.row)">编辑</el-button>
              <el-button type="text" v-if="scope.row.status === '1'" @click="statusChange(scope.row, '2')">删除</el-button>
            </div>
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
</template>

<script>
  import SelectRolePage from '@/api/PermissionManage/SelectRolePage'
  import UpdateRoleOperating from '@/api/PermissionManage/UpdateRoleOperating'

  export default {
    name: "PermissionManage",
    data() {
      return {
        pageTotal: 0,
        table_loading: false,
        currentPage: 1,
        pageSize: 10,

        table_data: [],
      }
    },
    created() {
      this.getTableData();
    },
    methods: {
      //状态修改
      statusChange(item, status) {
        UpdateRoleOperating.call(this, {
          roleId: item.id,
          status: status,
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success('操作成功');
            this.getTableData();
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      permissionEdit(item) {
        this.$router.push({
          name: 'PermissionDetail',
          query: {
            roleCode: item.roleCode,
          }
        })
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
        SelectRolePage.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}&input.pageSize=${this.pageSize}&input.pageIndex=${this.currentPage}`).then(res => {
          this.table_loading = false;
          if (res.data.code === 1) {
            this.pageTotal = res.data.data.total;
            this.table_data = res.data.data.records;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.table_loading = false;
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .main {
    overflow: auto;
    background-color: #fff;
    padding: 20px;
  }
</style>
