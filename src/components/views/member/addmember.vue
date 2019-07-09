<template>
    <div class="addmember">
<el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">

  <el-form-item label="活动名称" prop="name" required style="width:440px;">
    <el-input v-model="ruleForm.name" placeholder="请输入活动名称"></el-input>
  </el-form-item>


  <el-form-item label="活动时间" required>
   <el-date-picker
      v-model="value3"
      type="datetimerange"
      :picker-options="pickerOptions1"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right">
    </el-date-picker>
  </el-form-item>

   <el-form-item label="通知方式" prop="type">
    <el-checkbox-group v-model="ruleForm.type">
     <el-checkbox label="短信提醒" name="type"></el-checkbox>
      <el-checkbox label="APP/PC站内推送" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
 
  

  <el-form-item label="活动优惠" prop="desc" required>
    <el-button type="primary" class="btn" @click="newadd">+新增优惠劵</el-button>
  </el-form-item>

<div class="youhui">
<div class="list">
  <div class="box">
    <div class="list1">
    <div class="left">满200减50</div>
    <div class="right">
      <p>店铺满减优惠券</p>
      <p>到期时间：2019-12-10</p>
      <p>全店商品</p>
    </div>
    <div class="bottom">
      <span>总计：100张</span>
      <span>已领：50张</span>
      <span>已核销：50张</span>
    </div>
  </div>
  <div class="xiugai">
  <p>编辑</p>
  <p>删除</p>
  </div>
  </div>
</div>
</div>

 <el-form-item label="活动优惠" prop="desc" required style="width:450px;marginTop:20px;">
    <el-button class="btn" style="marginBottom:15px;marginRight:15px;">全部会员</el-button>
    <el-button class="btn" style="marginBottom:15px;">部分会员</el-button>
    <el-button class="btn">+添加会员</el-button>
  </el-form-item>
   <el-table
    ref="multipleTable"
    :data="tableData3"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="日期"
      width="120">
      <template slot-scope="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      show-overflow-tooltip>
    </el-table-column>
  </el-table> 
  <el-form-item label="活动内容" prop="desc" required style="marginTop:20px;">
    <el-input type="textarea" v-model="ruleForm.desc" style="width:700px;" placeholder="请输入活动详细内容"></el-input>
  </el-form-item>
  <div style="margin-top: 20px">
    <el-button @click="sure()">确定</el-button>
    <el-button @click="toggleSelection()">取消</el-button>
  </div>
  
</el-form>
<!-- 模态框 -->
<el-dialog :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <!-- 活动名称 -->
    <el-form-item label="活动名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off" style="width:250px;" placeholder="用于商家自己查看"></el-input>（限20字）
    </el-form-item>
    <!-- 满减金额 -->
     <el-form-item label="满减金额" :label-width="formLabelWidth" required>
       购物满
      <el-input v-model="form.name" auto-complete="off" style="width:150px;"></el-input>
      减
       <el-input v-model="form.name" auto-complete="off" style="width:150px;"></el-input>
       发放数量
        <el-input v-model="form.name" auto-complete="off" style="width:150px;"></el-input>
    </el-form-item>
    <!-- 领劵时间 -->
     <el-form-item label="领劵时间" :label-width="formLabelWidth" required>
      <div class="block">
    <el-date-picker
      v-model="value4"
      type="datetimerange"
      :picker-options="pickerOptions2"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right">
    </el-date-picker>
  </div>
    </el-form-item>
  <!-- 有效时间 -->
     <el-form-item label="有效时间" :label-width="formLabelWidth" required>
       领劵时间起
      <el-input v-model="form.name" auto-complete="off" placeholder="请输入天数" style="width:200px;"></el-input>
      天内有效
    </el-form-item>
    <!-- 活动范围 -->
     <el-form-item label="活动范围" :label-width="formLabelWidth" required>
        <el-button type="primary">全部商品</el-button>
        <el-button>部分商品</el-button>
    </el-form-item>
    <!-- 商品列表 -->
    <div style="display:flex;marginLeft:15px;marginBottom:15px;">
      <img src="./img/jinggao1.png" alt="">
    <p style="color:#ff6600;">选择全店商品时，活动结束前发布的新商品，将会默认加入优惠活动。</p>
    </div>
    
 <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="date"
      label="序号"
      width="100px"
     >
    </el-table-column>
     <el-table-column
      prop="photo"
      label="图片"
      width="100px"
     >
     <template slot-scope="scope">
     <img :src="scope.row.photo" alt="" style="width:80px;height:80px;">
     </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="商品名称"
     >
    </el-table-column>
    <el-table-column
      prop="address"
      label="商品价格"
      width="120px"
      >
    </el-table-column>
  </el-table>
    <!-- 分页 -->
      <div class="block">
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
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
<!-- 添加商品模态框 -->
<el-dialog title="收货地址" :visible.sync="dialogFormVisible1">
  <el-form :model="form">
    <el-form-item label="活动名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="活动区域" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>

  export default {
    data() {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        pickerOptions1: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value4: '',
        value3:'',
        radio:'1',
        dialogFormVisible:false,
        dialogFormVisible1:false,
        currentPage4: 1,
        pageSize:5,
        form: {
          name: '',
          region: '',
        },
        formLabelWidth: '120px',
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
       
          tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        tableData: [{
          date: '1',
          photo:require('./img/xiatian.jpg'),
          name: '堆堆领麻花毛衣 很美 很厚实呢 米色/咖色',
          address: '200.00'
        }, {
          date: '2',
          photo:require('./img/xiatian.jpg'),
          name: '内搭一套 精致小波浪设计纯色毛衣&毛球球腰带直筒裤 版型真心赞',
          address: '150.00~300.00'
        }, {
          date: '3',
          photo:require('./img/xiatian.jpg'),
          name: '堆堆领麻花毛衣 很美 很厚实呢 米色/咖色',
          address: '900.00'
        }, {
          date: '4',
          photo:require('./img/shangsheng.png'),
          name: '内搭一套 精致小波浪设计纯色毛衣&毛球球腰带直筒裤 版型真心赞',
          address: '800.00'
        }],
        multipleSelection: []
      };
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      sure(){
        this.$router.push({name:'shopmember'})
      },
      newadd(){
        this.dialogFormVisible=true;
      },
       handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4 = val
      }
    }
  }
</script>

<style lang="less">
.addmember{
  .btn{
    width:120px;
    height:36px;
    background:#fff;
    border:none;color:skyblue;
    border-radius: 5px;
  }
  .el-table{
    .cell{
      text-align: center;
    }
  }
  .youhui{
    background: #dbebf8;
    height: 220px;
    .list{
      height: 220px;
      display: flex;
      justify-content: center;
      align-items: center;
      justify-content: space-around;
      .box{
        width: 309px;
        height: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap; 
        justify-content: flex-end;
  	    align-items: flex-end;
        .xiugai{
          display: flex;
          margin-bottom: 10px;
          p{
            margin-right: 15px;
            color: #00a2ff;
          }
        }
        .list1{
        width: 309px;
        height: 153px;
        background: #fff;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .left{
          height: 50px;
          color: #00a2ff;
          font-size: 18px;
          line-height: 50px;
          border-right: #00a2ff dashed 1px;
          padding:0 15px;
          margin-right: 20px;
        }
        .right{
          color:#00a2ff;
          font-size: 14px;
        }
        .bottom{
          text-align: center;
          width: 100%;
          span{
            color: #00a2ff;
            font-size: 14px;
            margin-right: 10px;;
          }
        }
      }
      }

      
    }
 }
}
</style>
