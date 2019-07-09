<template>
  <!--待付款/待接单-->

  <div class="container">
    <!--待付款-->
    <div class="pay" v-if="fatherSource.editPrice">
      <p>当前订单状态：<span>等待买家付款 </span></p>
      <div class="amend-price">
        <el-button @click="visitEditPriceDialog">修改价格</el-button>
        <span>如有疑问，请致电满集全国统一服务热线：400-6766-999</span>
      </div>
      <div  class="change-address" v-if="fatherSource.sellerTag">
        <i class="sign"></i><span>标记│{{fatherSource.sellerTag }}</span>
      </div>
    </div>
    <!--待接单-->
    <div class="order" v-if="fatherSource.acceptOrder">
      <p>当前订单状态： <span>待接单 </span>
        <span v-if="validTime(fatherSource.latestTaskDate)" class="tag"><span style="color: #cc6600;"></span>{{countDown}}内未接单，系统将自动取消订单</span>
      </p>
      <ul>
        <li>● 买家已付款，请尽快接单，超过2天未接单系统将自动取消订单。</li>
        <li>● 如果缺货，可联系买家协商接单后延迟发货，或操作 <span>无货退款</span>。</li>
      </ul>
      <div class="receiveOrder">
        <el-button @click="receiveorders">接单</el-button>
        <span>如有疑问，请致电满集全国统一服务热线：400-6766-999</span>
      </div>
    </div>

    <!--修改价格弹框-->
    <el-dialog
      title="提示"
      :visible.sync="amendPrice"
      width="520px"
      center>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品总价：" prop="total">
          <el-input v-model="ruleForm.total" @change="change"></el-input>
        </el-form-item>
        <el-form-item label="订单运费：" prop="freight">
          <el-input v-model="ruleForm.freight"></el-input>
        </el-form-item>
        <el-form-item label="修改说明：" prop="explain">
          <el-input type="textarea" maxlength="50" placeholder="50字以内" clearable resize="none" autosize v-model="ruleForm.explain"></el-input>
        </el-form-item>

        <el-form-item class="amend-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>


  </div>
</template>

<script>
  import GetChangeOrderAmount from '../../../api/Order/GetChangeOrderAmount';
  import moment from 'moment';
  export default {
    inject:["reload"],
    name: "waitPay",
    props: ['fatherSource'],
    data(){
      let ret=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      //总价和运费金额判断
      let checkrealMoney = (rule,value,callback) => {
        if(!ret.test(value))
        {
          callback(new Error('请输入正确的金额格式，最多保留2位小数。'));
        }
        else if (value < 0.01) {
          callback(new Error('商品总价不能小于0.01'));
        }else  {
          callback();
        }
      };
      let checkfreight =  (rule,value,callback) => {
        if (value != 0) {
          if(!ret.test(value))
          {
            callback(new Error('请输入正确的金额格式，最多保留2位小数。'));
          }else  {
            callback();
          }
        }
        else {
           callback();
         }
      };
      return{
        dataSource:{},
        amendPrice:false,    //是否显示修改价格弹框
        currentTabComponent:'',//加载什么页面
        countDown:'',
        ruleForm:{
          total:'',
          freight:'',
          explain:'',
        },
        rules:{
          total:[{ required: true, message: '请输入商品总价', trigger: 'blur' } ,{ validator:checkrealMoney,trigger:"blur"}],
          freight:[{ required: true, message: '请输入订单运费', trigger: 'blur'},{ validator:checkfreight,trigger:"blur"}],
          explain:[{ required: true, message: '请输入修改说明', trigger: 'blur' }],
        },
      }
    },
    watch:{
      dataSource:function () {
        //处理任务时间
        if (this.dataSource.latestTaskDate !== "1900-01-01 00:00:00") {
          setInterval(() => {
            this.countDown = this.countTime(this.dataSource.latestTaskDate);
          }, 1000);
        }
      }
    },
    methods:{
      /**
       * 当前状态到下一状态倒计时
       * @param day
       * @returns {string}
       */
      countTime: function (day) {
        let str='';
        //获取当前时间
        let date = new Date();
        let now = date.getTime();
        //设置截止时间
        let endDate = new Date(day);
        let end = endDate.getTime();
        //时间差
        let leftTime = end - now;
        //定义变量 d,h,m,s保存倒计时的时间
        if (leftTime >= 0) {
          //let d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
          let h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
          let m = Math.floor(leftTime / 1000 / 60 % 60);
          let s = Math.floor(leftTime / 1000 % 60);
          //if (h>0){ str += d+"天"}
          str += h+"时"+m+"分"+s+"秒";
        }
         return str;
      },
       //价格判断
      change(){
        let realMoney = (this.fatherSource.payment.realMoney * 0.8).toFixed(2);//原商品总价
        if ( parseFloat(this.ruleForm.total) <= parseFloat(realMoney)) {
          this.$message({
            message: '已降价超过20%，请谨慎操作',
            type: 'warning'
          });
        }
      },
      //时间有效验证
      validTime(date) {
        return date && date !== "1900-01-01 00:00:00";
      },
      //修改价格赋值
      visitEditPriceDialog(){
        this.amendPrice=true;
        this.ruleForm.total=this.fatherSource.payment.realMoney;
        this.ruleForm.freight=this.fatherSource.payment.realFreight;
      },
      //修改价格的确定和取消
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.amendPrice=false;
            let date = new Date().toString();
            this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
            let obj ={
              orderType: this.$route.query.type,//订单类型
              goodsMoney: this.ruleForm.total,//商品金额
              expressMoney: this.ruleForm.freight,//运费
              reason:this.ruleForm.explain,//描述
              orderId: this.fatherSource.orderId,//订单编号
              rowver: this.fatherSource.rowVer,//行版本
              clientTimespan: this.time
            };
            GetChangeOrderAmount.call(this,obj).then(response => {
              if (response.status === 200 && response.data.code === 1) {
                this.$message({message: '修改价格成功', type: 'success'});
                this.reload(); //刷新页面
              } else {
                this.$message({showClose: true, message: response.data.desc, type: 'error'});
              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.amendPrice=false;
      },
      receiveorders(){
        this.$parent.changePage('ReceiveOrder');
      }
    },
    created(){
      this.dataSource = this.fatherSource;
    },
  }
</script>

<style lang="less" scoped>
  @import "less/waitPayOrder.less";
</style>
