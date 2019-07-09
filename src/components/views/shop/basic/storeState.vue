<template>
  <div class="store_box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="店铺状态" name="first">
        <div>
          <!--店铺状态显示-->
          <div class="store_state">
            <span>店铺状态：{{statusDesc}}</span>
          </div>

          <div class="store_content">
            <h3>关闭店铺说明</h3>
            <div>
              <h4>申请关闭店铺步骤如下：</h4>
              <h5>第一步：店铺关闭前必须完成事项：</h5>
              <p>1、所有订单必须结算完成；</p>
              <p>2、所有退单必须处理完成；</p>
              <p>3、所有交易纠纷必须处理完成；</p>
              <p>4、所有投诉必须处理完成；</p>
              <p>5、保证金余额不能为负数。</p>

              <h5>第二步：提交关闭店铺申请：</h5>
              <p>商家完成第一步骤中“店铺关闭前必须完成事项”后，即可提交关闭店铺申请，系统将下架该店铺内所有商品并将店铺冻结，关店申请提交至平台审核。用户端（PC端、APP端）不显示该店铺和商品信息。系统将以短信方式自动发送至店铺经办人、负责
                人手机上，客服中心电话与商家核实。</p>
            </div>

            <div>
              <h4>审核结果：</h4>
              <h5>1、经平台审核，如未通过，店铺不得关闭，商家可联系满集网客服中心咨询店铺关闭未成功原因。</h5>
              <h5>2、经平台审核，如通过的，平台将关闭店铺，店铺关闭后：</h5>
              <p>1）入驻平台未满6个月商家如强行关闭，平台将收取保证金金额的50%；</p>
              <p>2）缴纳的平台使用年费不予退还；</p>
              <p>3）平台对商家所有的奖励、积分、信誉等全部清零；</p>
              <p>4）信用记录根据提交的理由和核实的理由系统自动备存；</p>
              <p>5）商家的账户余额，将以平台自动提现方式转商家银行卡内；</p>
              <p>6）自审核通过之日起30天内，保证金退还至商家在平台绑定的银行卡内；</p>
              <p>7）商家可登陆商家后台，没有可操作的菜单，但可申请再次激活店铺；</p>
              <p>8）关闭店铺的审核结果以短信方式发送至经办人、负责人手机上。</p>
            </div>
          </div>

          <el-button type="primary" @click="closeShop">关闭店铺</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="申请关店记录" name="second">
        <div class="store_table">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="apply"
              label="注销申请"
              width="180">
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="state"
              label="审核状态">
            </el-table-column>
            <el-table-column
              prop="reason"
              label="原因">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="600px">
      <span>提交申请后，店铺内的商品即将全部下架，店铺冻结，请谨慎操作！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showReason">继 续</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="请输入注销原因"
      :visible.sync="reasonVisible"
      width="600px">
      <div style="position: relative;">
        <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          @input="descInput"
          maxLength="5"
          v-model="textarea">
        </el-input>
        <div style="position: absolute; bottom: 10px; right: 10px; color: #333;">
          <span>{{remnant}}</span> /
          <span>500</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reasonVisible = false">取 消</el-button>
        <el-button type="primary" @click="postCloseShop()">确 定</el-button>
      </span>
    </el-dialog>

    <div class="dealEvent_content">
      <el-dialog
        title="提示"
        :visible.sync="dealEventVisible"
        width="600px">
        <div>
          <p>有未处理事项，不可申请注销店铺，请尽快处理：</p>
          <p>1、有<span>{{noSettleOrder}}</span>个订单未结算</p>
          <p>2、有<span>{{noRefundOrder}}</span>个退单未处理</p>
          <p>3、有<span>{{disputeOrder}}</span>个交易纠纷正在进行中</p>
          <p>4、有<span>{{complaintOrder}}</span>个投诉正在进行中</p>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dealEventVisible = false">确 定</el-button>
      </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import GetApplyColseShop from '../../../../api/ShopInfo/GetApplyColseShop'
  import VerificationIsCloseShop from '../../../../api/ShopInfo/VerificationIsCloseShop'
  import PostApplyColseShop from '../../../../api/ShopInfo/PostApplyColseShop.js'
  export default {
    data () {
      return {
        activeName: 'first', // 默认显示的标签页
        dialogVisible: false, // 关闭店铺时的弹框
        dealEventVisible: false, // 有未处理事项时的弹框
        reasonVisible: false, // 注销原因模态框
        textarea: '', // 注销原因
        remnant: 500, // 注销原因限制字数
        statusDesc:'', //状态描述
        tableData: [{
          apply: '注销申请',
          time: '2016-05-02 12:11',
          state: '审核未通过',
          reason: '因未缴纳平台保证金，所以必须缴纳所有费用才可关闭店铺'
        }, {
          apply: '注销申请',
          time: '2016-05-02 12:11',
          state: '审核未通过',
          reason: '因未缴纳平台保证金，所以必须缴纳所有费用才可关闭店铺'
        }],
        noSettleOrder:0,//未结算订单数量
        noRefundOrder:0,//未处理的退单数量
        disputeOrder:0,//交易纠纷正在进行中的订单数量
        complaintOrder:0,//投诉正在进行中的订单数量
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },

      /**
       * 关闭店铺
       */
      closeShop() {
        this.time = new Date().toLocaleString();
        this.sessionId = sessionStorage.getItem('sessionId');
        VerificationIsCloseShop.call(this,`?input.sessionId=${this.sessionId}&input.clientTimespan=${this.time}`).then(res=>{

          if(res.data.code === 1){
            var data = res.data.data
            if(data.isColse === false || isColse === 'false'){
                this.noSettleOrder = data.noSettleOrder
                this.noRefundOrder = data.noRefundOrder
                this.disputeOrder = data.disputeOrder
                this.complaintOrder = data.complaintOrder
                this.dealEventVisible = true
                //this.dialogVisible = true;
            }else{
              this.dialogVisible = true;
            }
          }
        })
        // this.dealEventVisible = true;
      },
      postCloseShop(){
        if(this.textarea === ''){
          this.$message({
            message: '请填写关闭的原因',
            type: 'warning'
          });
          return
        }
        var data = {
          "reason": this.textarea,
          "clientVersion": "string",
          "clientTimespan": new Date().toLocaleString()
        }
        PostApplyColseShop.call(this,data).then(res=>{
           if(res.data.code === 1){
             this.$message({ message: '关店申请提交成功，请耐心等待平台审核', type: 'success' });
             return
           }else{
             this.$message.error(res.data.desc);
           }
        })
      },
      /**
       * 注销原因模态框
       */
      showReason () {
        this.reasonVisible = true;
      },

      /**
       * 确定关闭店铺
       */
      reasonSure () {
        this.dialogVisible = false;
        this.reasonVisible = false;

        this.$message({ message: '关店申请提交成功，请耐心等待平台审核', type: 'success' });
      },

      /**
       * 注销原因倒计数
       */
      descInput() {
        let txtVal = this.textarea.length;
        this.remnant = 500 - txtVal;
      },
    },
    created(){

      this.time = new Date().toLocaleString()
      this.sessionId = sessionStorage.getItem('sessionId')
      GetApplyColseShop.call(this,`?input.sessionId=${this.sessionId}&input.clientTimespan=${this.time}`).then(res=>{
          if(res.data.code === 1){
             var data = res.data.data
             this.statusDesc = data.statusDesc
             this.tableData = data.applyList
             if(data.status === 3){
               this.$router.push({ name: 'Close'});
               return
             }
             if(data.status === 2){
              this.$router.push({ name: 'Freeze'});
              return
             }
             console.log(data.applyList)
          }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./less/storeState.less";
</style>
