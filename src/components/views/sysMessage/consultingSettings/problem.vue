<template>
  <!-- 常见问题表单页面 -->
  <div class="zhiXunSheZhi-problem">
    <!-- 筛选区域 -->
    <div class="search_box clearfix">
      <div class="item">
        <el-button @click="dialogVisible = true">添加</el-button>
      </div>
      <div class="item">
        <span>状态：</span>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="filterStatus">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="2"></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-input placeholder="可输入标题查询" v-model="searchForm.key">
          <el-button slot="append" icon="el-icon-search" @click="TitleSearch"></el-button>
        </el-input>
      </div>
    </div>
    <!-- 筛选区域 -->
    <!-- 表格区域 -->
    <div class="table_box">
      <el-table :data="tableData" border style="width: 100%;height:100%;">
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+(pageIndex - 1) * pageSize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="知识点标题" align="center"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.state ==2 ? '停用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="editStatus(scope.$index, scope.row)" type="text" size="small">{{scope.row.state ==2 ? '启用' : '停用'}}</el-button>
            <el-button @click="openEditDialog(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          background
          @current-change="handleCurrentChange"
           @size-change="handleSizeChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[10, 20]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total_count"
        ></el-pagination>
      </div>
    </div>
    <!-- 表格区域 -->
    <!-- 添加及修改弹框 -->
    <div class="addDlaog">
      <el-dialog title="请确认操作" :visible.sync="dialogVisible" width="30%">
        <div class="main">
          <el-form ref="form" :model="addForm" label-width="80px">
            <el-form-item label="标题：">
              <el-input v-model="addForm.title" placeholder="请输入标题（最多50字）"></el-input>
            </el-form-item>
            <el-form-item label="内容：">
              <el-input
                type="textarea"
                v-model="addForm.content"
                placeholder="请输入相关问题内容"
                maxlength="500"
                show-word-limit
                rows="14"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态：">
              <el-radio-group v-model="addForm.state">
                <el-radio :label="2">停用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 添加及修改弹框 -->
  </div>
</template>

<script>
import GetChatproblemPage from "../../../../api/Txy/GetChatproblemPage";
import InsertChatproblem from "../../../../api/Txy/InsertChatproblem";
import UpdateStateArray from "../../../../api/Txy/UpdateStateArray";
import UpdateChatproblem from "../../../../api/Txy/UpdateChatproblem";
import UpdateDelChatArray from "../../../../api/Txy/UpdateDelChatArray";
export default {
  name: "",
  data() {
    return {
      searchForm: {},
      pageIndex: 1, //当前页
      pageSize: 10, //页码数
      addForm: {
        state:1
      }, //新增的表单
      editForm: {}, //修改的表单
      tableData: [],
      dialogVisible: false,
      // currentPage:1,
      total_count: 1
    };
  },
  created() {
    this.initTableList();
  },
  methods: {
    //前往第几页的事件
    handleCurrentChange(val) {
      this.pageIndex = val;
      this._getTableList();
    },
    //每页显示条数变动时
    handleSizeChange(val){
      this.pageSize = val
      this.pageIndex = 1
      this._getTableList();
    },
    //删除当前行
    deleteRow(index, row) {
      UpdateDelChatArray.call(
        this,
        `?ids=${row.id}
        &clientTimespan=${this.$Tool.formatDate(new Date())}`
      ).then(res => {
        if (res.data.code == 1) {
          this.tableData.splice(index, 1);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    //根据状态的筛选
    filterStatus() {
      this.pageIndex = 1;
      this._getTableList();
    },
    //根据title查找等接口 接口有问题
    TitleSearch() {
      this.pageIndex = 1;
      this._getTableList();
    },
    //进入页面获取的数据
    initTableList() {
      this._getTableList();
    },
    //获取列表
    _getTableList() {
      GetChatproblemPage.call(
        this,
        `?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&status=${this
          .searchForm.status || 0}&key=${this.searchForm.key ||
          ""}&clientTimespan=${this.$Tool.formatDate(new Date())}`
      ).then(res => {
        let data = res.data.data;
        this.tableData = data.chatlist || [];
        this.total_count = data.total_count;
        // this.currentPage = data.page_index后面 
        
      });
    },
    //打开修改的弹框
    openEditDialog(index, row) {
      this.dialogVisible = true;
      this.addForm = row;
    },
    //添加或修改常见问题
    addEdit() {
      if (!this.addForm.id) {
        this._addProblem();
      } else {
        this._editWenTi();
        this.dialogVisible = false;
      }
    },
    //修改常见问题状态
    editStatus(index, row) {
      UpdateStateArray.call(
        this,
        `?ids=${row.id}
        &state=${row.state == 1 ? 2 : 1 }
        &clientTimespan=${this.$Tool.formatDate(new Date())}`
      ).then(res => {
        if (res.data.code == 1) {
          this.initTableList();
          this.$message({
            message: "修改状态成功",
            type: "success"
          });
        }
      });
    },
    //新增常见问题
    _addProblem() {
      this.dialogVisible = false;
      InsertChatproblem.call(this, {
        title: this.addForm.title,
        content: this.addForm.content,
        state: this.addForm.state || 1,
        clientTimespan: this.$Tool.formatDate(new Date())
      }).then(res => {
        if (res.data.code == 1) {
          this.initTableList();
          this.addForm = {state:1};
          this.$message({
            message: "新增成功",
            type: "success"
          });
        }
      });
    },
    //修改常见问题
    _editWenTi() {
      UpdateChatproblem.call(this, {
        id: this.addForm.id,
        title: this.addForm.title,
        content: this.addForm.content,
        state: this.addForm.state,
        clientTimespan: this.$Tool.formatDate(new Date())
      }).then(res => {
        if (res.data.code == 1) {
          this.initTableList();
          this.addForm = {state:1};
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style lang=less>
.zhiXunSheZhi-problem {
  width: 100%;
  height: 100%;
  .clearfix:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .search_box {
    .item {
      float: left;
      padding-left: 20px;
    }
  }
  .el-tabs--border-card > .el-tabs__content {
    height: 1000px;
  }
  .table_box {
    margin-top: 20px;
    .el-table th {
      background-color: #d5ecff;
    }
    .page {
      padding-top: 10px;
    }
  }
}
</style>
