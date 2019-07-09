<template>
    <div class="exchange">
        <h4>创建会员福利，增加会员粘度</h4>
     <div class="box">
<div class="youhui"  v-for="(item,index) in youhui" :key="index">
            <div class="top">
                  <p style="fontSize:20px;color:#fff;fontWeight:bold;">{{item.point}}积分</p>
                  <p style="fontSzie:14px;color:#fff;">满<span>{{item.useMeetprice}}</span>减<span>{{item.derateAmount}}</span></p>
            </div>
         <div class="bottom">
        <p>有效期：<span>{{item.validDays}}</span> 天</p>
        <p>已兑换：<span>{{item.receiveCount}}</span> 张</p>
        <p>已使用：<span>{{item.userCount}}</span> 张</p>
            
            
</div>
           <div class="btn">
         <el-button type="text" @click="bianji(item.couponId)">编辑</el-button>
         <el-button type="text" @click="open2(item.couponId)">删除</el-button>
        </div>
</div>
      
     </div>
     <div class="add" @click="establish">
        +创建兑换优惠券
      </div>
        <!-- 增加模态框 -->
<el-dialog :visible.sync="dialogFormVisible">
  <!-- 表单 -->
  <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <div class="title">
            <h3>新增积分换券</h3>   
      </div>
      <div class="top">
    <el-form-item label="满减金额:" prop="jine" required>
      购买满
    <el-input  v-model.number="ruleForm2.jine" auto-complete="off" style="width:150px;" placeholder="请选择金额"></el-input>
    减
  </el-form-item>

   <el-form-item prop="jine1">
    <el-input  v-model="ruleForm2.jine1" auto-complete="off" style="width:150px;" placeholder="请选择金额"></el-input>
  </el-form-item>
      </div>
  

  <el-form-item label="所需积分:" prop="jifen" required>
    <el-input  v-model="ruleForm2.jifen" auto-complete="off" style="width:150px;"></el-input>
  </el-form-item>
  <el-form-item label="有效期:" prop="time" required>
    <el-input v-model.number="ruleForm2.time" style="width:150px;"></el-input>
  </el-form-item>

  <el-form-item label="活动范围:" prop="time" required>
    <el-button type="primary">全部商品</el-button>
  </el-form-item>

 

</el-form>
<!-- 修改 -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="lsy">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑模态框 -->
<el-dialog :visible.sync="dialogFormVisible1">
  <!-- 表单 -->
  <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <div class="title">
            <h3>编辑积分换券</h3>   
      </div>
      <div class="top">
    <el-form-item label="满减金额:" prop="jine2">
      购买满
    <el-input  v-model.number="ruleForm2.jine2" auto-complete="off" style="width:150px;" placeholder="请选择金额"></el-input>
    减
  </el-form-item>

   <el-form-item prop="jine3">
    <el-input  v-model="ruleForm2.jine3" auto-complete="off" style="width:150px;" placeholder="请选择金额"></el-input>
  </el-form-item>
      </div>
  

  <el-form-item label="所需积分:" prop="jifen1">
    <el-input  v-model="ruleForm2.jifen1" auto-complete="off" style="width:150px;"></el-input>
  </el-form-item>
  <el-form-item label="有效期:" prop="time1">
    <el-input v-model.number="ruleForm2.time1" style="width:150px;"></el-input>
  </el-form-item>

  <el-form-item label="活动范围:" prop="time1">
    <el-button type="primary">全部商品</el-button>
  </el-form-item>
</el-form>
<!-- 修改 -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="edit">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
import GetTicket from '../../../../api/Member/GetTicket.js'
import DeleTicket from '../../../../api/Member/DeleTicket.js'
  export default {
    data(){
       var validatejine = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入金额'));
        } else if(value>999999999){
          callback(new Error('最多为九位整数'));
        }else{
          callback()
        }
      };
      var validatejineone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入金额'));
        } else {
          callback();
        }
      };
      var validatejifen = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入积分'));
        }else if(value.length>5){
          callback(new Error('最多五位整数'));
        } 
        else {
          callback();
        }
      };
      var validatetime = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入天数'));
        }else if(value>30){
          callback(new Error('请输入正确的天数'));
        }else {
          callback();
        }
      };
          return {
            youhui:[
              // {num:'500',number:'100',numm:'10',qx:'30',dh:'50',sy:'15'},
              // {num:'500',number:'100',numm:'10',qx:'30',dh:'50',sy:'15'}
            ],
            selectId:'',//删除选中的id
            selectId1:'',//编辑选中的id
            listarr:{},//增加的数据
        dialogFormVisible:false,
        dialogFormVisible1:false,
        formLabelWidth: '120px',
        ruleForm2: {
          jine: '',
          jine1:'',
          jifen: '',
          time: '',
          jine3:'',

          jine2:'',
          jifen1:'',
          jifen2:'',
          time1:''
        },
         rules2:{
            jine: [
            { validator: validatejine, trigger: 'blur' }
          ],
           jine1: [
            { validator: validatejineone, trigger: 'blur' }
          ],
          jifen: [
            { validator: validatejifen, trigger: 'blur' }
          ],
          time: [
            { validator: validatetime, trigger: 'blur' }
          ],
         },
         clientTimespan:new Date().toLocaleString(),
         clientVersion: '1',
          }
      },
    methods: {
      open2(couponId) {
        this.$confirm('此操作将永久删除该兑换券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(JSON.stringify(couponId))
           DeleTicket.call(this,{
            id:JSON.stringify(couponId),
            clientVersion:this.clientVersion,
            clientTimespan:this.clientTimespan
          })
          .then(res=>{
            console.log(res)
            if(res.data.code===1){
               this.$message({
            type: 'success',
            message: '删除成功!'
          });
           //刷新列表
           this.getticket()
            }
          })
          .catch(err=>{

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      establish(){
     this.dialogFormVisible=true;
      },
      // 模态框确定
     lsy(ruleForm2){
       this.dialogFormVisible = false;
      //  this.youhui.push(this.listarr);
      // console.log(this.youhui)
       let listarr = {}
      //  发送创建兑换券请求
this.$refs.ruleForm2.validate((valid) => {
                            if(valid) {
                                alert('submit!');
                            } else {
                                alert('error submit!!');
                                return false;
                            }
                        });
      //  this.listarr={num:'400',number:'200',numm:'10',qx:'50',dh:'40',sy:'75'}
     },
     //编辑兑换券
     bianji(couponId){
       this.dialogFormVisible1=true
       console.log(couponId)
       this.selectId1 = couponId
     },
    
    //  编辑模态框确定
     edit(ruleForm2){
     this.dialogFormVisible1=false
     let ID = this.selectId1
     console.log(ID)
     
     },
     //请求兑换券列表
      getticket(){
        GetTicket.call(this,`?input.clientTimespan=${this.clientTimespan}`)
      .then(res=>{
        // console.log(res)
        if(res.data.code===1){
          this.youhui=res.data.data.tickList
        }
      })
      .catch(err=>{

      })
     },
    },
    created() {
      this.getticket()
    },
  }
</script>

<style lang="less" scope>
.exchange{
    background: #fff;
    height: 100%;
    padding: 15px 0 15px 15px;
    h4{
        margin-bottom: 20px;
    }
    .box{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        height: 100%;
        .youhui{
        width: 350px;
        height: 150px;
        padding: 0 40px;
        border-radius: 20px;
        line-height: 70px;
        background: skyblue;
        border-left: 10px dotted #fff;
        border-right: 10px dotted #fff;
        margin-bottom: 50px;
        margin-right: 65px;
        .top{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #fff;
            span{
                font-size: 20px;
                font-weight: bold;
            }
        }
        .bottom{
            display: flex;
            justify-content: space-between;
            p{
                color:#fff;
            }
        }
        .btn{
            display: flex;
            margin-top: 10px;
            justify-content: flex-end;
        }
        }
    }
        .add{
            width: 200px;
            height: 100px;
            background: #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover{
                cursor: pointer;
            }
    }
    .el-dialog__header{
        padding: 0;
    }
    .el-dialog__body{
        padding: 0;
        .el-form{
            .title{
                padding: 15px 0 15px 15px;
                background: #ccc;
                margin-bottom: 15px;
            }
            .top{
                display: flex;
                .el-form-item{
                    .el-form-item__content{
                        margin-left: 0!important;
                        width: 320px;
                    }
                }
            }
        }
    }
    
}
</style>
