<template>
    <div class="discount">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="活动名称" prop="name">
    <el-input v-model="ruleForm.name" style="width:250px;" placeholder="输入你要搜索的活动名称"></el-input>
  </el-form-item>
  
  <el-form-item label="活动时间:" style="width:500px;">
    <el-col :span="11">
      <el-date-picker
      v-model="value1"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择发送时间">
    </el-date-picker>
    </el-col>
  </el-form-item>
  
  <el-form-item label="发送状态:" style="width:300px;">
        <el-select v-model="ruleForm.region" placeholder="全部等级" style="width:200px;">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="已发送" value="已发送"></el-option>
            <el-option label="未发送" value="未发送"></el-option>
           
        </el-select>
        </el-form-item>
 <el-button type="primary" style="height:40px;marginLeft:20px;" @click="chaxun">查询</el-button>
 <el-button style="height:40px;marginLeft:20px;">返回</el-button>
</el-form>
  
<el-button type="primary" style="height:40px;marginLeft:20px;">新增</el-button>

 <el-table
    :data="tableData"
    border
    style="width: 100%;marginTop:20px;">
    <el-table-column
      prop="date"
      label="活动名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="活动起止时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="发送时间">
    </el-table-column>
      <el-table-column
      prop="address"
      label="发送内容">
    </el-table-column>
      <el-table-column
      prop="address"
      label="通知方式">
    </el-table-column>
      <el-table-column
      prop="address"
      label="发送状态">
    </el-table-column>
      <el-table-column
      prop="address"
      label="操作">
    </el-table-column>
  </el-table>
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[15]"
      :page-size="15"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage4: 1,//当前页
        pageSize:15,//当前条数
        ruleForm: {
          name: '',
          region: '全部',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        value1:'',

         tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //查询
      chaxun(){
        console.log(this.ruleForm.name)
         console.log(this.value1)
        console.log(this.ruleForm.region)
      },
        handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val
        console.log(this.pageSize)
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage4 = val
        console.log(this.currentPage4)
      }
    }
  }
</script>

<style lang="less">
.discount{
    background: #fff;
    padding-top: 10px;
    .el-form{
        display:flex;
        align-items: center;
        margin-bottom: 10px;
        .el-form-item{
          margin: 0;
        }
    }
    .el-table{
      .cell{
        text-align: center;
      }
    }
    .el-pagination{
      text-align: right;
      margin-top: 15px;
      padding-bottom: 15px;
    }
}

</style>
