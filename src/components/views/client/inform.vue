<template>
  <!--我要举报-->
  <div class="container">
    <!--筛选-->
    <div class="filtrate">
        <div class="filtrate-search">
            <span>订 单 号：</span>
            <el-input style="width: 170px;" v-model="queryCondition.orderNo" placeholder="请输入订单号"></el-input>
        </div>
        <div class="filtrate-search">
            <span>举报类型：</span>
            <el-select style="width: 170px;" v-model="queryCondition.reportType" placeholder="全部举报类型" clearable >
                <el-option v-for="item in reportOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="filtrate-search">
            <span>处理状态：</span>
            <el-select style="width: 170px;" v-model="queryCondition.reportState" placeholder="全部处理状态" clearable >
                <el-option v-for="item in disposeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="filtrate-search">
            <span>举报时间：</span>
            <el-date-picker v-model="queryCondition.beginTime" type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            至
            <el-date-picker v-model="queryCondition.endTime" type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </div>
        <div class="filtrate-search filtrate-search-btn">
            <el-button type="primary" @click="initTableData()">查询</el-button>
        </div>

        <div class="filtrate-search filtrate-search-btn">
          <el-button type="info" @click="queryConditionClear()">重置</el-button>
        </div>

    </div>

    <div class="suggest-btn"><el-button @click="inform">我要举报</el-button></div>
    <!--表格列表-->
    <div class="table-list">
      <el-table :data="tableData" style="width: 100%" :border="true">
        <el-table-column label="序号" type="index" width="50">

        </el-table-column>
        <el-table-column label="举报时间">
          <template slot-scope="scope">
            <span>{{scope.row.submitTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="举报类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号">
          <template slot-scope="scope">
            <span>{{scope.row.orderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理状态">
          <template slot-scope="scope">
            <span>{{scope.row.sheetStatusStr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="operation" @click="handleLook(scope.$index, scope.row)">查看详情</span>
          </template>
        </el-table-column>

        <!--<el-table-column label="信誉分">
          <template slot-scope="scope">
            <span>{{scope.row.credit}}</span>
          </template>
        </el-table-column>-->
      </el-table>
    </div>

    <!--分页-->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="page.currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import ReportList from '../../../api/client/reportList';
export default {
    name: "Inform",
    data(){
      return{
        reportOptions:[{
            value: '反复退款', label: '反复退款'
        },{
            value: '滥发信息', label: '滥发信息'
        },{
            value: '人身攻击', label: '人身攻击'
        },{
            value: '恶意抄袭', label: '恶意抄袭'
        },{
            value: '评论违规', label: '评论违规'
        },{
            value: '其他举报', label: '其他举报'
        }],
        disposeOptions:[{
            value: '待处理', label: '待处理'
        },{
            value: '已处理', label: '已处理'
        }],
        tableData: [], // 表格数据列表
        queryCondition: {
            reportType: '', //建议类型 - 直接传中文
            reportState: '', //处理状态 FINISHED:已处理 NOT_DISPOSE:未处理
            beginTime: '', //开始时间 格式： yyyy-MM-dd HH:mm:ss
            endTime: '', //结束时间 格式： yyyy-MM-dd HH:mm:ss
            orderNo: ''
        },
        page: { // 分页参数
            currentPage: 1,
            currentPageSize: 10,
            total: 0
        }
      }
    },
    mounted: function(){
        this.initTableData();
    },
    methods: {
        initTableData: function(){
            ReportList.call(this,
                '?pageNum=' + this.page.currentPage +
                '&pageSize=' + this.page.currentPageSize +
                '&reportType=' + (null == this.queryCondition.reportType ? '' : this.queryCondition.reportType) +
                '&reportState=' + (null == this.queryCondition.reportState ? '' : this.queryCondition.reportState) +
                '&orderNo=' + this.queryCondition.orderNo +
                '&beginTime='+ (null == this.queryCondition.beginTime ? '' : this.queryCondition.beginTime) +
                '&endTime=' + (null == this.queryCondition.endTime ? '' : this.queryCondition.endTime) +
                '&clientVersion=1.0.0' +
                '&clientTimespan=' + this.$Tool.formatDate(new Date())
            ).then(res => {
                this.page.total = res.data.data.reportList.total;
                this.tableData = res.data.data.reportList.list;
            })
        },
        queryConditionClear: function(){
            this.queryCondition = {
                suggestType: '', //建议类型 - 直接传中文
                suggestState: '', //处理状态 FINISHED:已处理 NOT_DISPOSE:未处理
                beginTime: '', //开始时间 格式： yyyy-MM-dd HH:mm:ss
                endTime: '', //结束时间 格式： yyyy-MM-dd HH:mm:ss
                orderNo: ''
            }
            this.initTableData();
        },
        inform(){
            this.$router.push({name:'Submit', query: {pageType: 1}})
        },
        handleLook(index, row) {
            this.$router.push({name:'SuggestInformDetails', query: {sheetId: row.id, pageType: 1}});
        },
        handleSizeChange(val) {
            this.page.currentPageSize = val;
            this.initTableData();
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.initTableData();
        }
    }
}
</script>

<style lang="less" scoped>
  @import "less/inform.less";
</style>
