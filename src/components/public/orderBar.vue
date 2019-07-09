<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px">
      <div class="dialog_box">
        <span>{{dialogMessage}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="printOrderManager">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import GetCountOrderByState from '../../api/Order/GetCountOrderByState'
  export default {
    data() {
      return {
        dialogVisible: false,
        dialogMessage:'',
        code:0
      };
    },
    methods: {
      initOrderCounter(){
        this.time = new Date().toLocaleString();
        let unAcceptOrder = 0;//待结单
        let upwaitShip =0;//未发货
        GetCountOrderByState.call(this,`?input.clientTimespan=${this.time}`).then(res=>{
          if (res.status === 200 && res.data.code === 1) {
            unAcceptOrder = res.data.data.waitAccept;//待结单
            upwaitShip =res.data.data.waitShip;//未发货
            if (unAcceptOrder > 0) {
              this.dialogVisible=true;
              this.code=1;
              this.dialogMessage ="您有"+unAcceptOrder+"个未接订单，请及时处理！";
              setInterval(() => this.ishide(), 599997);
            }else  if (upwaitShip > 0) {
              this.dialogVisible=true;
              this.code=200;
              this.dialogMessage ="您有"+upwaitShip+"个未发货订单，请尽快发货！";
              setInterval(() => this.ishide(), 599997);
            }
          } else if (res.data.code === 101) {

          }
        });
      },
      ishide(){
        this.code=0;
        this.dialogVisible=false;
      },
      /**
       * 跳转订单页面页面
       */
      printOrderManager(){
        this.dialogVisible=false;
        this.$router.push({path: '/OrderManage/orderList', query: {status: this.code}})
      },
      close(){
        this.dialogVisible =false;
      }
    },

    created: function () {
       setInterval(() => this.initOrderCounter(), 600000);
    },
  }
</script>

<style lang="less" scoped>
  @import "./less/orderBar.less";
</style>
