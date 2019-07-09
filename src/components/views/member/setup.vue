<template>
    <div class="setup">
        <div class="text">
            <h3>设置说明:</h3>
            <p>1，会员等级：会员分为5个等级（一星、二星、三星、四星、五星），开启会员功能后，需逐级设置会员的升级条件以及会员权益。</p>
            <p>2，升级条件：订单交易成功后，买家的交易满足升级任意条件即可自动升级为相应等级会员。</p>
            <p>3，会员权益：购物积分将按店铺购物积分基础以倍数获取。</p>
        </div>
        <div class="jifen">
            <p>店铺购物积分：<span>{{point}}倍</span>  购物获得积分 = 商品价格 * 1（积分取整数）</p>
        </div>

         <el-table
    :data="tableData"
    border
    style="width: 100%;marginTop:20px;"
    >
    <el-table-column
      fixed
      prop="level"
      label="序号"
     >
    </el-table-column>
    <el-table-column
      prop="alias"
      label="会员等级"
     >
    </el-table-column>
    <el-table-column
      prop="buyAmount"
      label="交易额"
     >
    </el-table-column>
    <el-table-column
      prop="buyCount"
      label="交易次数"
      >
    </el-table-column>
    <el-table-column
      prop="pointMultiple"
      label="积分倍数"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="handleEidt(scope.row)">设置</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 模态框 -->
  <div class="frame">
<el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px;">

    <el-form :model="form">
  <div style="height:40px;paddingLeft:30px;borderBottom:1px solid #ccc;">
     <span style="fontSize:18px;color:black;marginRight:15px;">升级条件</span>满足以下条件自动升级到{{title}}
  </div>
  </el-form>
  <div style="borderBottom:1px solid #ccc;">
      <div style="color:#00a2ff;paddingLeft:30px;marginTop:8px;">
   <span>交易额：￥<el-input v-model="input" placeholder="请输入内容" style="width:200px;"></el-input></span>-或-交易次数：<el-input v-model="input1" placeholder="请输入内容" style="width:200px;"></el-input>
  </div>
  <div>
       <span style="fontSize:18px;color:black;marginRight:15px;paddingLeft:30px;">会员权益</span>{{title}}可享受的权益
  </div>
  </div>
  <div style="paddingLeft:30px;">
  <p style="color:black;marginTop:8px;">折&emsp;&emsp;扣:<el-input v-model="discount" placeholder="请输入内容" style="width:200px;"></el-input>%</p>
  <p style="color:black;marginTop:8px;">积分倍数：<el-input v-model="input3" placeholder="请输入内容" style="width:200px;"></el-input></p>
  <p style="color:black;marginTop:8px;">生日优惠：<el-input v-model="input4" placeholder="请输入内容" style="width:200px;"></el-input>% <span style="marginLeft:30px;color:red;">会员生日当天可享专属优惠</span></p>
  <p style="color:black;marginTop:8px;">升级奖励：<el-button type="primary" style="border:none;color:#fff;background:#00a2ff;" @click="select">选择赠品</el-button><span style="marginLeft:30px;color:red;">会员升级后获得奖励</span> </p>
  </div>
  

  <div slot="footer" class="dialog-footer">
    <el-button @click="baocun">保存</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
  </div>
 
</el-dialog>
  </div>
    </div>
    
</template>

<script>
import GetShopVipRule from '../../../api/Member/GetShopVipRule.js'//获取店铺会员规则
import EditShopVipRule  from '../../../api/Member/EditShopVipRule.js'//开通、编辑店铺会员规则 post
export default {
    data(){
        return {
        id:'',
        isSet:'',//是否设置信息，0否，1是
        isOpenDiscount:'',//是否开启折扣权益
        isOpenPointMultiple:'',//是否开启积分倍数权益
        point:'',//店铺购物积分
        input:'',//交易额
        input1:'',//交易次数
        discount:'',//折扣
        input3:'',//积分倍数
        input4:'',//生日优惠
        tableData:[], 
        list:{}, 
        title:'',
        aturnover:'',//交易额
        transactiontimes:'',//交易次数
        ID:'',//设置选中的ID
        jifen:'',//积分
        dialogFormVisible: false,
         form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth:'120px',
        clientTimespan:new Date().toLocaleString()
        }
    },
    methods: {
   handleEidt(row){
       this.dialogFormVisible=true;   
       this.list = row
       console.log(this.list)

       this.isSet = this.list.isSet
       this.id = this.list.id
       this.title = this.list.alias
       this.isOpenDiscount = this.list.isOpenDiscount
       this.isOpenPointMultiple = this.list.isOpenPointMultiple
       this.discount = this.list.discount
       this.level = this.list.level
       this.input = this.list.buyAmount
       this.input1 = this.list.buyCount
       this.input3 = this.list.pointMultiple
   },
   select(){
       this.$router.push({name:'give'})
   },
   // 获取店铺会员规则
   getmember(){
       GetShopVipRule.call(this,`?input.clientTimespan=${this.clientTimespan}`)
      .then(res=>{
        // console.log(res)
      if(res.data.code===1){
          this.tableData=res.data.data.rules
          this.point = res.data.data.point
          this.list = res.data.data.rules
      }
      })
      .catch(err=>{
     this.$message.error(res.data.desc);
      })
   },
   //保存修改
   baocun(){
       this.dialogFormVisible = false
       EditShopVipRule.call(this,{
           rules:[
               {
                isSet: this.isSet,
                id: this.id,
                alias: this.title,
                level: this.level,
                buyCount: this.input1,
                buyAmount: this.input,
                discount: this.discount,
                isOpenDiscount: this.isOpenDiscount,
                pointMultiple:this.input3,
                isOpenPointMultiple: this.isOpenPointMultiple
               }
           ],
           clientTimespan:this.clientTimespan
       })
       .then(res=>{
         console.log(res)
        if(res.data.code===1){
            this.$message({
                message:'设置成功',
                type:'success'
            })
            //属性表
            this.getmember()
        }else{
            this.$message.error(res.data.desc)
        }
       })
       .catch(err=>{

       })
   },
   
    },
    created() {
        this.getmember()
    },

}
</script>

<style lang="less">
.setup{
    background: #fff;
    padding: 20px;
    .text{
        width: 1510px;
        height: 136px;
        background: #e4ebf1;
        padding: 20px;
        p{
            margin-top: 10px;
        }
    }
    .jifen{
        margin-top: 15px;
        span{
            color:#00a2ff;
            margin-right: 30px;
        }
    }
    .cell{
        text-align: center;
    }
    .frame{
        .el-dialog__header{
            padding: 0;
            background: #ccc;
            padding:10px 0 5px 5px;
            
        }
        .el-dialog__body{
            padding: 0;
            line-height: 40px;
        }
    }
}
</style>
