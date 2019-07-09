<template>
  <div class="warp_bg">

    <!--头部开始-->
    <div class="bond_top">
      <div class="left">
        <p>保证金可用余额 <span>{{currentDeposit}}元</span></p>
        <router-link v-show="arrearageDeposit > 0" to="javascript:void(0);">补缴</router-link>
      </div>
      <div class="right">
        <p>当前合约期应交保证金：<span>{{shouldDeposit}} 元</span></p>
        <p>欠费金额：<span>{{arrearageDeposit}} 元</span></p>
      </div>
    </div>
    <!--头部结束-->

    <!--表格开始-->
    <div class="bond_table">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="remark"
            label="原因">
          </el-table-column>
          <el-table-column
            prop="money"
            label="金额">
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间">
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--表格结束-->

    <!--页码开始-->
    <div class="Page_number">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[ 5, 10, 20, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordCount">
      </el-pagination>
    </div>
    <!--页码结束-->

  </div>
</template>

<script>

  import GetDepositInfo from '../../../../api/ShopInfo/GetDepositInfo'

  export default {

    data(){
      return{

        currentPage4: 1, //当前页码
        tableData: [],//列表
        pageIndex:1,
        pageSize:20,
        currentDeposit:0,//可用保证金
        arrearageDeposit:0,//当前合约期应交保证金
        shouldDeposit:0,//欠费金额
        recordCount:0,
      }
    },

    methods:{

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    },
    created:async function(){
      this.time = new Date().toLocaleString();
      GetDepositInfo.call(this,`?input.pageSize=${this.pageSize}&input.pageIndex=${this.pageIndex}&input.clientTimespan=${this.time}`).then(res=>{
        if(res.data.code === 1){
            var data = res.data.data
            this.currentDeposit = data.currentDeposit
            this.arrearageDeposit = data.arrearageDeposit
            this.shouldDeposit = data.shouldDeposit
            this.tableData = data.data
            this.recordCount = data.recordCount
            console.log(data)
        }
      })
    }

  }
</script>

<style lang="less" scoped>

  .warp_bg{
    .bond_top{
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      background: #fff;
      display: table;
      .left{
        width: 56%;
        display: table-cell;
        vertical-align: middle;
        font-size: 14px;
        color: #666666;
        border-right: 1px #e1e1e1 solid;
        p{
          float: left;
          margin-bottom: 10px;
          span{
            color: #ff0101;
            font-size: 16px;
            margin-left: 20px;
          }
        }
        a{
          width: 104px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 5px;
          display: inline-block;
          font-size: 16px;
          background: #00a2ff;
          color: #fff;
          float: left;
          margin-left: 20%;
        }
      }
      .left:after{
        clear: both;
        content: '';
        display: block;
      }
      .right{
        padding: 0 20px;
        display: table-cell;
        vertical-align: middle;
        p{
          font-size: 14px;
          color: #343434;
          span{
            color: #fe0000;
          }
        }
      }
    }
  }

  .bond_table{
    margin-top: 10px;
  }

  .Page_number{
    background: #fff;
    padding: 20px;
    text-align: right;
  }
  /deep/ .el-table thead th {
    color: #333;
    background: #efefef;
    text-align: center;
  }
</style>
