<template>
<div class="upgrade">
     <div class="title">
        <el-form ref="form" :model="form" style="width:100%;" class="From">
        <div class="left">
                <el-form-item label="会员等级:" style="width:300px;">
        <el-select v-model="form.region" placeholder="全部等级" style="width:200px;">
            <el-option label="全部等级" value="全部等级"></el-option>
            <el-option label="一星会员" value="一星会员"></el-option>
            <el-option label="二星会员" value="二星会员"></el-option>
            <el-option label="三星会员" value="三星会员"></el-option>
            <el-option label="四星会员" value="四星会员"></el-option>
            <el-option label="五星会员" value="五星会员"></el-option>
        </el-select>
        </el-form-item>
        </div>

        <div class="middle">
        <el-form-item label="用户账号:">
        <el-input v-model="form.name" style="width:200px;"></el-input>
        </el-form-item>
        </div>

        <div class="right">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="fanhui">返回</el-button>
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
      prop="name"
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
      prop="mingzi"
      label="赠送商品名称"
    >
    </el-table-column>
     <el-table-column
      prop="state"
      label="赠送状态"
    >
    </el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
      prop='btn'
    >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" v-if="scope.row.id == 0?false:true" type="text" size="small">编辑</el-button>
        <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
        <el-button @click="handleClick(scope.row)" type="text" size="small">增加</el-button>
      </template>
    </el-table-column>
  </el-table>
     </div>



  <div class="block">

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="100">
    </el-pagination>
  </div>
  
</div>
   
</template>

<script>

export default {
     data() {
      return {
        form: {
          name: '',
          region: '全部等级',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          
        },
        state2:1,
        isdis:false,
        isshow:false,
      tableData: [
        {
          id:0,
          date: '张三',
          name: '一级',
          sex: '男',
          phone: '11111111111',
          birthday: '2018-08-08',
          address: '上海',
          mingzi:'电脑',
          state:'已赠送',
        }, {
          id:1,
         date: '张三',
          name: '一级',
          sex: '男',
          phone: '11111111111',
          birthday: '2018-08-08',
          address: '上海',
          mingzi:'电脑',
          state:'已赠送',
        }, 
         {
          id:2,
         date: '张三',
          name: '一级',
          sex: '男',
          phone: '11111111111',
          birthday: '2018-08-08',
          address: '上海',
          mingzi:'电脑',
          state:'已赠送',
        }
        ],
        currentPage4: 1,//当前页
        pageSize:15,//美页多少条
        total:0,//总条数
        clientTimespan:new Date().toLocaleString(),
      }
    },
    methods: {
      // 查询
      onSubmit() {
        console.log(this.form.region);
        console.log(this.form.name);
      },
        handleClick(row) {
        console.log(row);
      },
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4 = val
      },
      fanhui(){
        this.$router.push({name:'memberindex'})
      },
      
    },
    created() {
      this.pd()
    },

}
</script>

<style lang="less" scope>
.upgrade{
    background:#fff;
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
                .el-form-item{
                    margin: 0;
                }
            }
            .middle{
                display: flex;
                width: 300px;
                .el-form-item__content{
                    width: 300px;
                }
                .el-form-item{
                    margin: 0;
                }
            }
            .right{
                width: 650px;
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
