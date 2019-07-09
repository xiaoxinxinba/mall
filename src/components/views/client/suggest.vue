<template>
    <!--我要建议-->
    <div class="container">
        <!--筛选-->
        <div class="filtrate">
            <div class="filtrate-search"><span>建议类型：</span>
                <el-select style="width: 170px;" v-model="queryCondition.suggestType" placeholder="全部建议状态" clearable >
                    <el-option v-for="item in suggestOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="filtrate-search"><span>处理状态：</span>
                <el-select style="width: 170px;" v-model="queryCondition.suggestState" placeholder="全部处理状态" clearable >
                    <el-option v-for="item in disposeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="filtrate-search"><span>建议时间：</span>
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
        <div class="suggest-btn"><el-button @click="suggest">我要建议</el-button></div>
    <!--表格列表-->
    <div class="table-list">
        <el-table ref="Table" :data="tableData" style="width: 100%" border >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="建议时间">
          <template slot-scope="scope">
            <span>{{scope.row.submitTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="建议类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
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
        :page-sizes="[2, 10, 30, 50, 100]"
        :page-size="page.currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import SuggestList from '../../../api/client/suggestList';
export default {
    name: "suggest",
    data(){
        return{
            input:'',
            value:'',
            suggestOptions:[{
                value: '产品功能', label: '产品功能'
            },{
                value: '用户体验', label: '用户体验'
            },{
                value: '满集服务', label: '满集服务'
            },{
                value: '其他建议', label: '其他建议'
            }],
            disposeOptions:[{
                value: 'NOT_DISPOSE', label: '待处理'
            },{
                value: 'FINISHED', label: '已处理'
            }],
            tableData: [],
            queryCondition:{
                suggestType: '', //建议类型 - 直接传中文
                suggestState: '', //处理状态 FINISHED:已处理 NOT_DISPOSE:未处理
                beginTime: '', //开始时间 格式： yyyy-MM-dd HH:mm:ss
                endTime: '' //结束时间 格式： yyyy-MM-dd HH:mm:ss
            },
            page: {
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
            SuggestList.call(this,
                '?pageNum=' + this.page.currentPage +
                '&pageSize=' + this.page.currentPageSize +
                '&suggestType=' + (null == this.queryCondition.suggestType ? '' : this.queryCondition.suggestType) +
                '&suggestState=' + (null == this.queryCondition.suggestState ? '' : this.queryCondition.suggestState) +
                '&beginTime='+ (null == this.queryCondition.beginTime ? '' : this.queryCondition.beginTime) +
                '&endTime=' + (null == this.queryCondition.endTime ? '' : this.queryCondition.endTime) +
                '&clientVersion=1.0.0' +
                '&clientTimespan=' + this.$Tool.formatDate(new Date())
            ).then(res => {
              console.log('1111',res)
                if(res.data.code == 1){
                    this.page.total = res.data.data.suggestList.total;
                    this.tableData = res.data.data.suggestList.list;
                }
            })
        },
        queryConditionClear: function(){
            this.queryCondition = {
                suggestType: '', //建议类型 - 直接传中文
                suggestState: '', //处理状态 FINISHED:已处理 NOT_DISPOSE:未处理
                beginTime: '', //开始时间 格式： yyyy-MM-dd HH:mm:ss
                endTime: '' //结束时间 格式： yyyy-MM-dd HH:mm:ss
            }
            this.initTableData();
        },
        //我要建议
        suggest(){
            this.$router.push({name:'Submit', query: {pageType: 0}});
        },
        handleLook(index, row) {
            this.$router.push({name:'SuggestInformDetails', query: {sheetId: row.id, pageType: 0}});
        },
        handleSizeChange(val) {
            this.currentPageSize = val;
            this.initTableData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.initTableData();
        }
    }
}
</script>

<style lang="less" scoped>
  @import "less/suggest.less";
</style>
