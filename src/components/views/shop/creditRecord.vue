<template>
  <div class="warp_bg">
    <!--条件筛选开始-->
    <div class="screen">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="时间:">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="加分/扣分:">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="default" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--条件筛选结束-->

    <!--表格内容开始-->
    <div class="table_list">
      <template>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="num"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="rsAddTime"
            label="时间"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="reType"
            label="来源分类"
            align="center"
            width="170">
          </el-table-column>
          <el-table-column
            prop="reEvent"
            label="事件"
            align="center"
            width="110">
          </el-table-column>
          <el-table-column
            prop="reEventStandard"
            align="center"
            label="事件描述">
          </el-table-column>
          <el-table-column
            label="分值"
            width="120">
            <template slot-scope="scope">
              <div>{{scope.row.rsMark}} {{scope.row.rsScore}}</div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--表格内容结束-->

    <!--页码开始-->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--页码结束-->

  </div>
</template>

<script>

  import GetBusinessReputationRecord from '../../../api/ShopInfo/GetBusinessReputationRecord'

  export default {
    data(){
      return{
        options: [{
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '加分'
        }, {
          value: '3',
          label: '扣分'
        }],
        value: '',
        time: '',
        currentTime: '',

        currentPage: 1,
        tableData: [
        ],
        crMark:'',
        startTime:'',//开始时间
        endTime:'',//结束时间
        pageSize:5,//分页数
        pageIndex:1,//页码
        total:0,
      }
    },
    methods: {

      searchBtn() {
        console.log(this.startTime)
        if(this.time !== null && this.time !== undefined){
          if(this.time[0] !== null && this.time[0] !== undefined && this.time[1] !== null && this.time[1] !== undefined){
            this.startTime = this.dateFtt('yyyy-MM-dd',this.time[0])
            this.endTime = this.dateFtt('yyyy-MM-dd',this.time[1])
          }
        }else {
          this.startTime = ''
          this.endTime = ''
        }

        if(this.value !== ''){
          if(this.value === '2'){
            this.crMark = '+'
          }else if(this.value === '3'){
            this.crMark = '-'
          }
        }
        console.log(this.crMark)
        this.getBusinessReputationRecord()
        console.log('submit!');
      },
      dateFtt (fmt,date)
      { //author: meizz
        var o = {
          "M+" : date.getMonth()+1,                 //月份
          "d+" : date.getDate(),                    //日
          "h+" : date.getHours(),                   //小时
          "m+" : date.getMinutes(),                 //分
          "s+" : date.getSeconds(),                 //秒
          "q+" : Math.floor((date.getMonth()+3)/3), //季度
          "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
      },
      /**
       * 返回
       */
      goBack () {
        this.$router.push({name: 'ShopReputation'});
      },

      /**
       * 页码
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.pageIndex = 1
        this.getBusinessReputationRecord()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageIndex = val
        this.getBusinessReputationRecord()
      },
      getBusinessReputationRecord(){
        this.currentTime = new Date().toLocaleString();
        let crMark = ''
        crMark = encodeURIComponent(this.crMark)
        GetBusinessReputationRecord.call(this,`?input.crMark=${crMark}&input.startTime=${this.startTime}&input.endTime=${this.endTime}&input.pageSize=${this.pageSize}&input.pageIndex=${this.pageIndex}&input.clientTimespan=${this.currentTime}`).then(res=>{
          if(res.data.code === 1){
            var data = res.data.data
            this.tableData = data.pageInfo.list
            this.total = data.pageInfo.total
            console.log(this.tableData)
          }else{
            this.$message.error(res.data.desc)
          }
        })
      }
    },
    created:async function(){
      this.getBusinessReputationRecord()
    }
  }
</script>

<style lang="less" scoped >

  .warp_bg{
    width: 100%;
    height: auto;
    padding-bottom: 20px;
    background: #fff;
    .top_title{
      padding: 20px 5px;
    }
    .table_box{
      border-top: 2px #21fbee solid;
      ul{
        width: 100%;
        height: 45px;
        padding: 0 20px;
        box-sizing: border-box;
        border-bottom: 1px #e4ebf1 solid;
        li{
          width: auto;
          height: 100%;
          line-height: 45px;
          font-size: 14px;
          padding: 0 10px;
          float: left;
          cursor: pointer;
          color: #666666;
          position: relative;
          i{
            width: 80%;
            height: 2px;
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 10%;
          }
          &:hover{
            i{
              width: 80%;
              height: 2px;
              background: #00a2ff;
              position: absolute;
              bottom: 0;
              left: 10%;
            }
          }
        }
        .cur{
          i{
            width: 80%;
            height: 2px;
            background: #00a2ff;
            position: absolute;
            bottom: 0;
            left: 10%;
          }
        }
      }
    }
    .screen{
      width: auto;
      height: auto;
      margin: 20px;
      padding: 20px 20px 0 20px;
      background: #ecf4fa;
      border-bottom: 1px #78ccfc solid;
    }
    .table_list{
      padding: 20px;
    }
    .page{
      padding: 20px;
      text-align: right;
    }
  }

</style>
