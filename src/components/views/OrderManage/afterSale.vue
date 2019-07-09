<template>
  <div class="warp_bg">

    <div class="top_title">
      <el-button type="info" @click="allOrderbtn">全部订单</el-button>
      <el-button type="primary">退款售后</el-button>
    </div>

    <div class="table_box">
      <ul>
        <li v-for="(item,index) in titleList"  @click="curClick(index)" :class="curIndex === index?'cur':''"  :key="">{{item.name}} <span class="total_num">({{totalNum[item.value]}})</span><i></i></li>
      </ul>
    </div>

    <!--条件筛选开始-->
    <div class="screen">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="单号:">
          <el-input style="width: 170px;" v-model="formInline.backNo" placeholder="请输入退单号"></el-input>
        </el-form-item>
        <el-form-item label="售后类型:">
          <el-select style="width: 170px;"  v-model="formInline.backType" placeholder="请输入选择售后类型"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>

        </el-form-item>

        <el-form-item label="发起时间:">
          <div class="time">
            <div><el-date-picker style="width: 170px;"  v-model="formInline.minTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker></div>
            <div>—</div>
            <div><el-date-picker style="width: 170px;"  v-model="formInline.maxTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker></div>
          </div>

        </el-form-item>

        <!--后期加这个功能-->
        <!--<el-form-item label="买家:">-->
          <!--<el-input style="width: 170px;"  v-model="formInline.buy" placeholder="买家"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="商品名称:">
          <el-input style="width: 170px;"  v-model="formInline.goodsTitle" placeholder="商品名称"></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-checkbox v-model="formInline.checked">商家发起退款</el-checkbox>
        </el-form-item>

        <el-form-item>
          <div class="search_btn">
            <el-button type="primary" @click="searchBtn">搜索</el-button>
            <el-button @click="resetBtn">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--条件筛选结束-->

    <!--表格内容开始-->
    <div class="table_list">
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" align="center" width="50" type="index" :index="indexMethod"></el-table-column>
          <el-table-column prop="backNo" label="退单号" align="center" width="130"></el-table-column>
          <el-table-column prop="createAt" label="发起时间" align="center" width="170"></el-table-column>
          <el-table-column prop="backMoney" label="金额" align="center" width="110"></el-table-column>
          <el-table-column prop="goods[0].title" align="center" label="售后商品"></el-table-column>
          <el-table-column prop="buyer.name" align="center" label="买家"></el-table-column>
          <el-table-column prop="type" label="售后类型" align="center"><template slot-scope="scope"><span>{{scope.row.typeDesc}}</span></template></el-table-column>
          <el-table-column prop="state" label="处理状态" align="center"><template slot-scope="scope"><span>{{scope.row.processStatusText}}</span></template></el-table-column>
          <el-table-column prop="operation" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <span class="operation" v-if="scope.row.processStatusText === '待处理'" @click="handleDispose(scope.row)">处理</span>
              <span class="operation" v-if="scope.row.processStatusText !== '待处理'" @click="handleLook(scope.row)">查看</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="信用分"
            align="center"
            width="100">
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
        :current-page="pageIndex"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordCount">
      </el-pagination>
    </div>
    <!--页码结束-->
  </div>
</template>

<script>
  import GetOrderBackList from '@/api/AfterSale/GetOrderBackList.js'    //获取退单列表
  import GetBackOrderProcessingStateCount from '@/api/AfterSale/GetBackOrderProcessingStateCount.js'    //获取统计退单各处理状态数量


  export default {
    data(){
      return{
        curIndex:0,   //选项的下标
        titleList:[{name:'全部',value:'whole'},{name:'待处理',value:'waiting'},{name:'处理中',value:'processing'},{name:'已完成',value:'finish'}],
        totalNum:{},
        formInline: {
          backNo: '',   //退单号
          backType: '',   //售后类型
          minTime:'',
          maxTime:'',
          buy: '',
          goodsTitle: '',
          checked:false,
        },//商品名称、订单号、买家
        value1: '',
        options: [{value: '0', label: '全部售后类型 '}, {value: '1', label: '仅退款'}, {value: '2', label: '退货退款'}, {value: '3', label: '换货'}, {value: '4', label: '补发货'}, ],  //{value: '5', label: '维修'},
        tableData: [],
        recordCount:0,    //总数据量
        currentPage: 1,

        pageIndex:1,    //页码
        pageSize:5,    //每页条数
        processingState:1,   //处理状态


      }
    },
    computed:{

    },
    methods: {

      //全部
        curClick(index) {
        this.curIndex=index;
        this.processingState=index+1;
        this.pageIndex=1;
        this.getData();
      },
      //搜索
      searchBtn() {
        this.getData();
      },
      //重置
      resetBtn() {
        this.formInline=Object.assign(this.formInline,{backNo: '', backType: '', minTime:'', maxTime:'', buy: '', goodsTitle: '', checked:false,});
        this.pageIndex = 1;
        this.pageSize = 5;
        this.getData();
      },

      /**
       * 页码
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val;
        this.getData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageIndex=val;
        this.getData();
      },
      //序号
      indexMethod(index) {
        return  (this.pageIndex-1)*this.pageSize+index+1;
      },

      /**
       * 点击切换全部订单
       */
      allOrderbtn(){
        this.$router.push({ name: 'OrderList' })
      },
      //处理
      handleDispose(row) {
        this.$router.push({name:'SaleAfter',query:{orderType:row.orderType,backNo:row.backNo}});
      },
      //点击查看详情
      handleLook(row){
        console.log(row);
        this.$router.push({name:'SaleAfter',query:{orderType:row.orderType,backNo:row.backNo}});
      },
      //获取列表信息
      getData() {
        let clientTimespan=this.$Tool.formatDate(new Date());
        let createRole=this.formInline.checked?2:0;
        this.formInline.minTime = this.formInline.minTime === null?'':this.formInline.minTime;
        this.formInline.maxTime = this.formInline.maxTime === null?'':this.formInline.maxTime;
        GetOrderBackList.call(this,`?clientTimespan=${clientTimespan}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&processingState=${this.processingState}
        &backNo=${this.formInline.backNo}&backType=${this.formInline.backType === ''?0:Number(this.formInline.backType)}&minTime=${this.formInline.minTime}&maxTime=${this.formInline.maxTime}
        &goodsTitle=${this.formInline.goodsTitle}&createRole=${createRole}`).then(res=>{
          console.log('111',res)
          if(res.data.code === 1){
            this.tableData=res.data.data.pageList;
            this.recordCount=res.data.data.recordCount;
          }
        })
      },
      //获取统计退单各处理状态数量
      getTotalNum() {
        GetBackOrderProcessingStateCount.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          console.log('数据',res);
          if(res.data.code === 1) {
            this.totalNum=res.data.data;
          }
        })
      },
    },
    created() {
      this.getData();
      this.getTotalNum();



    },
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
          .total_num{
            color: #ff0000;
          }
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
    .operation{
      cursor: pointer;
      text-decoration: underline;
      color: #00a2ff;
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


  .time{
    font-size: 0px;
    width: 360px;
    >div:nth-of-type(1){
      width: 170px;
      display: inline-block;
    }
    >div:nth-of-type(2){
      width: 20px;
      display: inline-block;
      font-size: 14px;
      text-align: center;
    }
    >div:nth-of-type(3){
      width: 170px;
      display: inline-block;
    }
  }
  .search_btn{
    padding-left: 50px;
    /deep/ button{
      padding: 0px;
      width: 100px;
      height: 36px;
    }
  }

</style>
