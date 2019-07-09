<template>
<div class="shopmember">
     <div class="title">
        <el-form ref="form" :model="form" style="width:100%;" class="From">
        <div class="left">
      <el-form-item label="会员等级:" style="width:300px;">
        <el-select v-model="form.region" placeholder="请选择" style="width:200px;">
             <el-option label="0" value="0"></el-option>
             <el-option label="1" value="1"></el-option>
             <el-option label="2" value="2"></el-option>
             <el-option label="3" value="3"></el-option>
             <el-option label="4" value="4"></el-option>
             <el-option label="5" value="5"></el-option>
        </el-select>
        </el-form-item>
        </div>

        <div class="middle">
        <el-form-item label="上次交易时间:">
      <el-date-picker
      v-model="value1"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    至
    <el-date-picker
      v-model="value2"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
        </el-form-item>
        </div>

        <div class="right">
        <el-form-item label="交易总额：">
        <el-input v-model="name" style="width:100px;"></el-input>-
        <el-input v-model="nameone" style="width:100px;"></el-input>
        </el-form-item>

        <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="fanhui">返回</el-button>
        </el-form-item>
        </div> 
        </el-form>
     </div>


  <div class="table">
     <el-table
    :data="tableData"
    border
    style="width: 100%">
     <el-table-column
      fixed
      prop="date"
      label="会员信息"
    >
    </el-table-column>
    <el-table-column
      fixed
      prop="date1"
      label="会员等级"
    >
    </el-table-column>
    <el-table-column
      prop="sex"
      label="性别"
    >
    </el-table-column>
    <el-table-column
      prop="phone"
      label="电话号码"
    >
    </el-table-column>
    <el-table-column
      prop="birthday"
      label="生日"
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="默认收货地址"
    >
    </el-table-column>
    <el-table-column
      prop="zip"
      label="交易笔数（笔）"
    >
    </el-table-column>
     <el-table-column
      prop="zip1"
      label="交易总额（元）"
    >
    </el-table-column>
     <el-table-column
      prop="zip2"
      label="上次交易时间"
    >
    </el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
    >
      <template slot-scope="scope">
       <el-button type='text' @click="chakan(scope.row.id)">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
     </div>



  <div class="block">

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10,15]"
      :page-size="15"
      layout="total, sizes, prev, pager, next, jumper"
      :total="100">
    </el-pagination>
  </div>
</div>
   
</template>

<script>
import Getshpovipcardlist from '../../../api/Member/Getshpovipcardlist.js'
export default {
     data() {
      return {
        clientTimespan:new Date().toLocaleString(),
         value1: '',
         value2:'',
          name: '',
          nameone:'',
        form: {
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
         tableData: [
           {id:500,date:'张三',date1:'一级会员',sex:'男',phone:'电话号码',birthday:'1997-04-14',address:'重庆',zip:200,zip1:50000,zip2:'2019-05-10'}
          
         ],
        currentPage4: 1,//当前页
        pageSize:15,//每页多少条
        total:0//总条数
       
      }
    },
    methods: {
        handleClick() {
       this.$router.push({name:'numberdetails'})
      },
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val
        this.getTabledata();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4=val;
        this.getTabledata();
      },
      fanhui(){
        this.$router.push({name:'memberindex'})
      },
      onSubmit(){
        if(this.form.region!==''&&this.value1!==''&&this.value2!==''&&this.name!==''&&this.nameone!==''){
           this.getTabledata()
        }else{
          this.$message.error('请输入条件');
        }
      
      // console.log(this.clientTimespan,this.form.region,this.name,this.nameone,this.value1,this.value2)
      },
      getTabledata(){
      Getshpovipcardlist.call(this,`?input.clientTimespan=${this.clientTimespan}&input.level=${this.form.region}&input.delAmountMin=${this.name}&input.delAmountMax=${this.nameone}&input.startTime=${this.value1}&input.endTime=${this.value2}&input.pageSize=${this.pageSize}&input.pageIndex=${this.currentPage4}`)
      .then(res=>{
        console.log(res)
     if(res.data.code===1){
      this.tableData=res.data.data.data
     }else{
       this.$message.error(res.data.desc);
     }
      })
      .catch(err=>{
       this.$message.error(res.data.desc);
      })
      },
      // 查看详情
      chakan(id){
        this.$router.push({
           name:'numberdetails',
           query: {
            Id: id
          }
        })
      }
      
     
    },
    created() {
      // this.getTabledata()
       
    },
    mounted() {

    },

}
</script>

<style lang="less">
.shopmember{
    background: #fff;
    .title{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        background: #ecf4fa;
        .From{
            display: flex;
            justify-content: center;
            align-items: center;
            justify-content: space-around;
            .left{
                display: flex;
            }
            .middle{
                display: flex;
                width: 600px;
                .el-form-item{
                    width: 600px;
                }
            }
            .right{
                width: 650px;
                display: flex;
                justify-content: space-around;
                .el-form-item{
                    width: 650px;
                    margin-right: 20px;
                }
            }
        }
    }
    .table{
        margin-top: 20px;
        .cell{
            text-align: center;
        }
    }
    .block{
        text-align: right;
        margin-top: 15px;
        padding-bottom: 15px;
    }
}
</style>
