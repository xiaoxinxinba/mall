<template>
    <div class="integralpayment">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <p class="collection">
          <span style="color:red;marginRight:5px;">*</span>
         <span style="marginRight:20px;">店铺购物积分(倍)</span>  
           
         <el-form-item prop="jifen">
        <el-input v-model="ruleForm.jifen" style="width:250px;" value="sss"></el-input>
        </el-form-item>

         <span style="marginLeft:30px;">购物获得积分 = 商品价格 * 1</span>  <span style="marginLeft:90px;color:red;">店铺积分最多1位整数，1位小数</span> 
      </p>
      <p class="collection">
        <span style="color:red;marginRight:9px;">*</span>
        <span>收藏商品送积分(分)</span> 
        <span style="marginLeft:10px;">
            <el-radio v-model="radio" label="1">是</el-radio>
             <el-radio v-model="radio" label="2">否</el-radio>
        </span>
           
           <el-form-item prop="jifen1">
        <el-input v-model="ruleForm.jifen1" style="width:250px;" v-if="this.radio==='2'?false:true"></el-input>
        </el-form-item>
         <span style="color:red;marginLeft:34px;">积分最多7位整数</span>
      </p>
    <p class="collection">
        <span style="color:red;marginRight:9px;">*</span>
        <span>关注店铺送积分(分)</span> 
        <span style="marginLeft:10px;">
             <el-radio v-model="radio1" label="1">是</el-radio>
             <el-radio v-model="radio1" label="2">否</el-radio>
        </span>
           
        <el-form-item prop="jifen2">
        <el-input v-model="ruleForm.jifen2" style="width:250px;" v-if="this.radio1==='2'?false:true"></el-input>
        </el-form-item>
         <span style="color:red;marginLeft:34px;">不能为空</span>
      </p>
      <p class="collection">
        <span style="color:red;marginRight:9px;">*</span>
        <span>晋升会员送积分(分)</span> 
         <span style="marginLeft:10px;">
            <el-radio v-model="radio2" label="1">是</el-radio>
             <el-radio v-model="radio2" label="2">否</el-radio>
        </span>
           
           <el-form-item prop="name1">
        <el-input v-model="ruleForm.name" style="width:250px;" v-if="this.radio2==='2'?false:true"></el-input>
        </el-form-item>
      </p>
      <div class="box">
          <el-button type="primary">保存</el-button>
          <el-button @click="edit">修改</el-button>
      </div>
      </el-form>
      <!-- 模态框 -->
      <el-dialog :visible.sync="dialogFormVisible">
  <el-form :model="ruleForm1" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <p class="collection">
          <span style="color:red;marginRight:5px;">*</span>
         <span style="marginRight:20px;">店铺购物积分(倍)</span>  
           
         <el-form-item prop="jifen">
        <el-input v-model="ruleForm1.jifen" style="width:250px;" value="sss"></el-input>
        </el-form-item>

         <span style="marginLeft:30px;">购物获得积分 = 商品价格 * 1</span>  <span style="marginLeft:90px;color:red;">店铺积分最多1位整数，1位小数</span> 
      </p>
      <p class="collection">
        <span style="color:red;marginRight:9px;">*</span>
        <span>收藏商品送积分(分)</span> 
        <span style="marginLeft:10px;">
            <el-radio v-model="radio" label="1">是</el-radio>
             <el-radio v-model="radio" label="2">否</el-radio>
        </span>
           
           <el-form-item prop="jifen1">
        <el-input v-model="ruleForm1.jifen1" style="width:250px;" v-if="this.radio==='2'?false:true"></el-input>
        </el-form-item>
         <span style="color:red;marginLeft:34px;">积分最多7位整数</span>
      </p>
    <p class="collection">
        <span style="color:red;marginRight:9px;">*</span>
        <span>关注店铺送积分(分)</span> 
        <span style="marginLeft:10px;">
             <el-radio v-model="radio1" label="1">是</el-radio>
             <el-radio v-model="radio1" label="2">否</el-radio>
        </span>
           
        <el-form-item prop="jifen2">
        <el-input v-model="ruleForm1.jifen2" style="width:250px;" v-if="this.radio1==='2'?false:true"></el-input>
        </el-form-item>
         <span style="color:red;marginLeft:34px;">不能为空</span>
      </p>
      <p class="collection">
        <span style="color:red;marginRight:9px;">*</span>
        <span>晋升会员送积分(分)</span> 
         <span style="marginLeft:10px;">
            <el-radio v-model="radio2" label="1">是</el-radio>
             <el-radio v-model="radio2" label="2">否</el-radio>
        </span>
           
           <el-form-item prop="name1">
        <el-input v-model="ruleForm1.name" style="width:250px;" v-if="this.radio2==='2'?false:true"></el-input>
        </el-form-item>
      </p>
      </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="sure">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
import GetPointRule from '../../../../api/Member/GetPointRule.js'//获取店铺积分发放规则 get
import EditPointRule from '../../../../api/Member/EditPointRule.js'//修改店铺积分规则 post
export default {
data(){
       var validatejifen = (rule, value, callback) => {
         let reg = /^\d{1}(\.\d{1})?$/
        if (!value) {
          callback(new Error('请输入积分'));
        } else if(!reg.test(value)){
          callback(new Error('请输入正确的积分'));
        }else{
          callback()
        }
      };
      var validatejifenone = (rule,value,callback)=>{
        let reg = /^\d{1,7}$/
        if(!value){
          callback(new Error('请输入积分'))
        }else if(!reg.test(value)){
          callback(new Error('请输入正确的积分'))
        }else{
          callback()
        }
      }
      var validatejifentwo = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入积分'));
        } else {
          callback();
        }
      };

    return {
        radio: '1',
        radio1:'1',
        radio2:'1',
        ruleForm:{
         jifen:'',
         jifen1:'',
         jifen2:'',
         name:''
        },
        ruleForm1:{
         jifen:'',
         jifen1:'555',
         jifen2:'',
         name:''
        },
        rules:{
          jifen: [
            { validator: validatejifen, trigger: 'blur' }
          ],
           jifen1: [
            { validator: validatejifenone, trigger: 'blur' }
          ],
           jifen2: [
            { validator: validatejifentwo, trigger: 'blur' }
          ],
        },
        clientTimespan:new Date().toLocaleString(),
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form:{

        }
    }
},
methods: {
  getPoint(){
    //   获取店铺积分发放规则
  GetPointRule.call(this,`?input.clientTimespan=${this.clientTimespan}`)
   .then(res=>{
   console.log(res)
   if(res.data.code===1){
     this.ruleForm.jifen = res.data.data.pointMultiple
     this.ruleForm.jifen1 = res.data.data.wishlistPoint 
     this.ruleForm.jifen2 = res.data.data.favoriteShopPoint 
     this.ruleForm.name = res.data.data.vipPoint 
   }
   })
   .catch(err=>{
     this.$message.error(res.data.desc)
   })
  },
  // 修改，数据回显
  edit(){
  this.dialogFormVisible = true 
  //   //   获取店铺积分发放规则
  GetPointRule.call(this,`?input.clientTimespan=${this.clientTimespan}`)
   .then(res=>{
  //  console.log(res)
   if(res.data.code===1){
     this.ruleForm1.jifen = res.data.data.pointMultiple
     this.ruleForm1.jifen1 = res.data.data.wishlistPoint 
     this.ruleForm1.jifen2 = res.data.data.favoriteShopPoint 
     this.ruleForm1.name = res.data.data.vipPoint 
     
   }
   })
   .catch(err=>{
     this.$message.error(res.data.desc)
   })
  },
  //确定修改
  sure(){
    this.dialogFormVisible = false
    // 修改店铺积分规则
  EditPointRule.call(this,{
    pointMultiple:this.ruleForm1.jifen,
    wishlistPoint:this.ruleForm1.jifen1,
    favoriteShopPoint:this.ruleForm1.jifen2,
    vipPoint:this.ruleForm1.name,
    clientTimespan:this.clientTimespan
  })
  .then(res=>{
   console.log(res)
  if(res.data.code===1){
    this.$message({
       message: res.data.desc,
          type: 'success'
    })
    this.getPoint()
  }
  })
  .catch(err=>{

  })

  }
},
created() {
  this.getPoint()
},
}
</script>

<style lang="less" scope>
.integralpayment{
    background: #fff;
    height: 500px;
    .collection{
        display: flex;
        margin-top: 20px;
        align-items: center;
        .el-form-item{
            display: flex;
            align-items: center;
            margin: 0;
            margin-top: 10px;
            .el-form-item__content{
                margin-left: 0!important;
            }
        }
    }
    .box{
    margin-left: 30px;
    margin-top: 30px;
    }
}


</style>
