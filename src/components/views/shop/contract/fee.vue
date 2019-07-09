<template>
  <div class="warp_bg">

    <!--头部开始-->
    <div class="fee_top">
      <div class="left">
        <p>保证金可用余额 <span>{{currentPlatformFee}}元</span></p>
      </div>
    </div>
    <!--头部结束-->

    <!--表格开始-->
    <div class="fee_table">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="price"
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
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordCount">
      </el-pagination>
    </div>
    <!--页码结束-->

  </div>
</template>

<script>

  import GetPlatformFeeInfo from '../../../../api/ShopInfo/GetPlatformFeeInfo'

  export default {

    data(){
      return{
        currentPage4: 1, //当前页码
        tableData: [],
        pageSize:5,
        currentPlatformFee:0,
        recordCount:0,
      }
    },

    methods:{

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.currentPage4 = 1
        this.GetPlatformFeeInfo()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4 = val
        this.GetPlatformFeeInfo()
      },
      GetPlatformFeeInfo(){
        this.time = new Date().toLocaleString();
        GetPlatformFeeInfo.call(this,`?input.pageSize=${this.pageSize}&input.pageIndex=${this.currentPage4}&input.clientTimespan=${this.time}`).then(res=>{
          if(res.data.code === 1){
            var data = res.data.data
            this.currentPlatformFee = data.currentPlatformFee
            this.tableData = data.data
            this.recordCount = data.recordCount
          }
        })
      }
    },
    created:async function(){
      this.GetPlatformFeeInfo()
    }
  }
</script>

<style lang="less" scoped>

  .warp_bg{
    .fee_top{
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      background: #fff;
      display: table;
      .left{
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        font-size: 14px;
        color: #666666;
        border-right: 1px #e1e1e1 solid;
        p{
          font-size: 14px;
          color: #666;
          span{
            color: #ff0101;
            font-size: 16px;
            margin-left: 20px;
          }
        }
      }
    }
  }

  .fee_table{
    margin-top: 10px;
  }

  .Page_number{
    background: #fff;
    padding: 20px;
    text-align: right;
  }

</style>
