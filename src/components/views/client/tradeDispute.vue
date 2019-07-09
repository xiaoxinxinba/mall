<template>
  <!--交易纠纷-->
  <div class="container">
    <div class="title-btn">交易纠纷 (8)</div>
    <div class="line"></div>
    <div class="main">

      <ul class="change-btn">
        <li @click="current=1" :class="current===1?'choose':''"><span>处理中</span></li>
        <li @click="current=2" :class="current===2?'choose':''"><span>已完成<i>（5）</i></span></li>
      </ul>

      <!--筛选-->
      <div class="filtrate">
        <div class="filtrate-search"><span>单    号：</span><el-input style="width: 170px;" v-model="orNumber" placeholder="请输入单号"></el-input></div>
        <div class="filtrate-search"><span>纠纷类型：</span><el-select style="width: 170px;" v-model="orTitle" placeholder="请选择纠纷类型"><el-option v-for="item in disputeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><span>平台处理状态：</span><el-select style="width: 170px;" v-model="orPlate" placeholder="请选择处理状态"><el-option v-for="item in disposeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><span>是否举证：</span><el-select style="width: 170px;" v-model="isProof" placeholder="全部"><el-option v-for="item in proofOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><span>提问时间：</span>
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="filtrate-search">
          <el-button type="primary" @click="onsubmit">查询</el-button>
          <el-button type="info">重置</el-button></div>
      </div>
      <!--表格列表-->
      <div class="table-list">
        <el-table :data="tableData" style="width: 100%" :border="true">
          <el-table-column label="序号" type="index" prop="num"  align="center" width="50"></el-table-column>
          <el-table-column prop="id" align="center" label="id" width="100%"  v-if="isshow">
          </el-table-column>

          <el-table-column label="工单id" v-if="false">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="单号">
            <template slot-scope="scope">
              <span>{{scope.row.orNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发起时间">
            <template slot-scope="scope">
              <span>{{scope.row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发起用户">
            <template slot-scope="scope">
              <span>{{scope.row.cusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="纠纷类型">
            <template slot-scope="scope">
              <span>{{scope.row.dispute}}</span>
            </template>
          </el-table-column>
          <el-table-column label="平台处理状态">
            <template slot-scope="scope">
              <span>{{scope.row.disputeEnums}}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否举证">
            <template slot-scope="scope">
              <span>{{scope.row.isPutProof}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operation" @click="handleProof(scope.row.id, scope.row.orNumber)" v-if="scope.row.isPutProof==1">去举证</span>
              <span class="operation" @click="checkDetails(scope.row.id,scope.row.orderBackNum)" v-if="scope.row.isPutProof==0">纠纷详情</span>
            </template>
          </el-table-column>

          <el-table-column label="信誉分">
            <template slot-scope="scope">
              <span>{{scope.row.credit}}</span>
            </template>
          </el-table-column>


        </el-table>
      </div>

      <!--分页-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="currentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataTotal">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
  import tradeDispute from '../../../api/client/tradeDispute';
  export default {
    name: "tradeDispute",
    data(){
      return {
        isshow:false,
        current:1,
        value:'',
        orNumber: '',
        orTitle:'',
        orType:'',
        orPlate:'',
        isProof:'',
        time:'',
        disputeOptions:[
          {value: '全部纠纷类型', label: '全部纠纷类型'},
          {value: '换货', label: '换货'},
          {value: '补发货', label: '补发货'},
          {value: '仅退款', label: '仅退款'},
          {value: '退款退货', label: '退款退货'},
          {value: '维修', label: '维修'}],
        disposeOptions:[
          {value: '全部处理状态', label: '全部处理状态'},
          {value: '处理中', label: '处理中'},
          {value: '已完成', label: '已完成'}],
        proofOptions:[
          {value: '全部', label: '全部'},
          {value: '未举证', label: '未举证'},
          {value: '已举证', label: '已举证'}],
        tableData: [],
        currentPage: 1,
        currentPageSize: 5,
        dataTotal: 4
      }
    },
    mounted: function(){
    },
    methods:{
      //定义日期转换函数
      dateToMs (date) {
        if(date!=null && date!=''){
          let d = new Date(date);
          let result=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
          return result;
        }else{
          return '';
        }
      },
      //查询列表函数
      searchBtn(){
        tradeDispute.call(this,
          '?orNumber=' +this.orNumber+
          '&orType='+this.orType+
          '&orTitle='+this.orTitle+
          '&orPlate='+this.orPlate+
          '&isProof='+this.isProof+
          '&pageSize=' + this.currentPageSize +
          '&pageNum='+this.currentPage+
          '&system=MJCustomer' +
          '&clientVersion=1.0.0' +
          '&startTime='+this.dateToMs(this.time[0])+
          '&endTime='+this.dateToMs(this.time[1])+
          '&clientTimespan='+this.dateToMs(new Date())
        ).then(res => {
          console.log(res,'纠纷数据');
          this.tableData = res.data.data.list;
        })
      },
      onsubmit(){
        this.searchBtn();
      },

      //查看详情
      checkDetails(sheetId,orderBackNum){
        alert(orderBackNum);
        this.$router.push({path:'/client/TradeDisputeDispose',query:{ sheetId:sheetId,orderBackNum:orderBackNum}})
      },
      //去举证
      handleProof(sheetId,orNumber){
        this.$router.push({path:'/client/TradeDisputeDispose',query:{ sheetId:sheetId,orNumber:orNumber}})
      },
      handleLook: function(index, row){
        console.log(index);
        console.log(row);
      },
      handleSizeChange(val) {
        this.currentPageSize = val;
        this.initTableData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.initTableData();
      },
    },
    created(){
      this.searchBtn();
    }
  }
</script>

<style lang="less" scoped>
  @import "less/tradeDispute.less";
</style>
