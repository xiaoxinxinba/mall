<template>
  <div class=" cashout" v-loading="page_loading">
    <div class="title">
      <p>申请提现</p>
    </div>
    <div class="cashout_main">
      <div class="cashbtn">
        <p>自动提现</p>
        <p>
          <el-switch
            :active-value="active_value"
            :inactive-color="inactive_value"
            v-model="cashbtn_value"
            @change="tixianStatusChange"
          >
          </el-switch>
          <span style="margin-left: 10px;color: #00a2ff;">{{cashbtn_value === '1' ? '已开启' : '已关闭'}}</span>
        </p>
        <p class="rules" @click="rule_dialog = true">提现规则</p>
      </div>
      <div class="cash_card">
        <div><span>可提现金额：</span><span class="cash_money">{{ cashmoney | NumFormat }}</span></div>
        <div><span>提现银行卡：</span>
          <div class="bankcard"><p><img :src="cashcard.img" alt="" class="bankimg"></p>
            <p>{{cashcard.bank}}</p>
            <p>{{cashcard.lastnum}}</p></div>
          <span class="changecard" @click="changeBank">更换银行卡</span></div>
        <div><span>提现金额：</span>
          <el-input type="number" v-model="tixian_money" @input="tipTextChange" placeholder="请输入提现金额，最低100"
                    style="width: 300px;"></el-input>
          <span class="changecard" @click="tixianAll">全部提现</span></div>
        <div class="monet_input"><p :class="{'red_tip': tip_text_color}">{{tip_text}}</p></div>
        <div class="monet_input">
          <el-button type="primary" @click="tixianSubmit" :loading="submit_loading" :disabled="tip_text_color">确认提现</el-button>
          <el-button @click="$router.go(-1)">返 回</el-button>
<!--          <span class="rules" @click="rule_dialog = true">提现规则</span>-->
        </div>
      </div>
    </div>
    <!--    弹出层-->
<!--    提现规则-->
    <el-dialog
      title="提现规则"
      :visible.sync="rule_dialog"
      width="30%">
      <div style="line-height: 1.8;">
        <p>1、分为自动提现和手动提现</p>
        <p>2、手动提现在5个工作日内完成</p>
        <p>3、自动提现为10日、20日和月末</p>
        <p>4、提现金融服务费最低不少于1元/笔</p>
        <p>5、提现金额低于300元另收6‰金融服务费</p>
      </div>
    </el-dialog>
<!--    提现成功-->
    <el-dialog
      title=""
      :visible.sync="submit_dialog"
      width="40%">
      <div>
        <div style="text-align: center">
          <img :src="submit_img" alt="" style="margin-right: 10px;vertical-align: middle;"/>
          <div style="display: inline-block;vertical-align: middle;text-align: left">
            <p style="font-size: 1.1em;margin-bottom: 0.6em;">提现申请已提交，等待处理</p>
            <p>预计2个工作日到账</p>
          </div>
        </div>
        <div style="height: 1px;background: #c1c1c1;margin: 20px 0"></div>
        <div class="submit_info">
          <div>
            <span class="submit_info_title">提现到：</span>
            <span>{{cashcard.bank}} {{cashcard.lastnum}}</span>
          </div>
          <div>
            <span class="submit_info_title">提现金额：</span>
            <span style="margin-right: 20px;">{{tixian_money}}</span>
            <span class="submit_info_title">提现手续费：</span>
            <span>{{commission}}</span>
          </div>
          <div>
            <span class="submit_info_title">到账金额：</span>
            <span>{{tixian_money - commission}}</span>
          </div>
        </div>
        <div style="text-align: center">
          <el-button type="info" size="medium" @click="$router.go(-1)">知道了</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import GetUserwithdrawInit from '@/api/BankInfo/GetUserwithdrawInit'
  import AutoWithdrawStatus from '@/api/BankInfo/AutoWithdrawStatus'
  import CommissionPre from '@/api/BankInfo/CommissionPre'
  import AutoWithdrawSwitch from '@/api/BankInfo/AutoWithdrawSwitch'
  import GetBankInfo from '@/api/BankInfo/GetBankInfo'
  import Submit from '@/api/BankInfo/Submit'
  export default {
    data() {
      return {
        active_value: '1',
        inactive_value: '0',
        page_loading: true,
        rule_dialog: false,//规则弹框
        submit_dialog: false,// 提交弹框
        submit_img: require('../img/submit.png'),//提交成功图片
        cashbtn_value: '1',
        tixian_money: '', //提现金额
        commission: '', //手续费
        cashmoney: "0",
        cashcard: {
          bank: '',
          lastnum: '',
          img: '',
          id: '',
          condition: '',
        },
        tip_text: `单笔最低100元`,//提示文字
        tip_text_color: true,//提示文字样式
        submit_loading: false,
      }
    },
    created() {
      this.tixianInit();
      this.tixianStatusInit();
      this.tixianBankInit();
    },
    computed: {},
    methods: {
      //初始化提现银行卡
      tixianBankInit() {
        GetBankInfo.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.cashcard.bank = res.data.data.bankBasicInfo.bankName;
            this.cashcard.lastnum = `储蓄卡（尾号${res.data.data.bankBasicInfo.bankNo.substr(-4)}）`;
            this.cashcard.img = res.data.data.bankBasicInfo.bankIcon;
            this.cashcard.condition = res.data.data.bankEntrustInfo;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //提现初始化
      tixianInit() {
        this.page_loading = true;
        GetUserwithdrawInit.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          this.page_loading = false;
          if (res.data.code === 1) {
            this.cashmoney = res.data.data.accountAllowTx;
            this.cashcard.id = res.data.data.listBankCard[0].id;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.page_loading = false;
        })
      },
      //初始化自动提现状态
      tixianStatusInit() {
        this.page_loading = true;
        AutoWithdrawStatus.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          this.page_loading = false;
          if (res.data.code === 1) {
            this.cashbtn_value = res.data.data.toString();
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.page_loading = false;
        })
      },
      //改变提现状态
      tixianStatusChange(val) {
        let status = val ? val : '0';
        AutoWithdrawSwitch.call(this, {
          status: status,
          clientTimespan: this.$Tool.formatDate(new Date()),
        })
      },
      //提现手续费
      tixianFee() {
        return new Promise((resolve, reject) => {
          CommissionPre.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}&input.withdrawalsMoney=${this.tixian_money}`).then(res => {
            if (res.data.code === 1) {
              resolve(res.data.data.commissionMoney);
            }
          })
        });
      },
      //改变提示文字
      tipTextChange: async function() {
        let val = Number(this.tixian_money);
        if (val < 100) {
          this.tip_text = '单笔最低100元';
          this.tip_text_color = true;
        } else if (val > parseFloat(this.cashmoney)) {
          this.tip_text = '输入金额已超过可提现金额';
          this.tip_text_color = true;
        } else {
          //提现手续费
          this.commission = await this.tixianFee();
          this.tip_text = `本次提现手续费${this.commission}元，到账金额${val - this.commission}元`;
          this.tip_text_color = false;
        }
      },
      //全部提现
      tixianAll() {
        this.tixian_money = parseFloat(this.cashmoney);
        this.tipTextChange();
      },
      //确认提现
      tixianSubmit() {
        this.submit_loading = true;
        if (this.cashcard.condition) {
          if (this.cashcard.condition.status === 0) {
            this.$message.error('该银行卡待审核中，暂时无法提现');
            this.submit_loading = false;
            return;
          } else if (this.cashcard.condition.status === 2) {
            this.$message.error('该银行卡审核未通过，暂时无法提现');
            this.submit_loading = false;
            return;
          }
        }
        Submit.call(this, {
          withdrawalsMoney: Number(this.tixian_money),
          commissionMoney: this.commission,
          withdrawalsBankId: this.cashcard.id,
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          this.submit_loading = false;
          if (res.data.code === 1) {

            this.submit_dialog = true;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.submit_dialog = false;
        });
      },
      changeBank() {
        this.$router.push({
          name: 'ChangeDesc'
        })
      },
    },
    filters: {
      NumFormat: function (value) {
        if (!value) return '0.00';

        /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
        var intPart = Number(value) | 0; //获取整数部分
        var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

        var floatPart = ".00"; //预定义小数部分
        var value2Array = value.split(".");

        //=2表示数据有小数位
        if (value2Array.length == 2) {
          floatPart = value2Array[1].toString(); //拿到小数部分

          if (floatPart.length == 1) { //补0,实际上用不着
            return intPartFormat + "." + floatPart + '0';
          } else {
            return intPartFormat + "." + floatPart;
          }

        } else {
          return intPartFormat + floatPart;
        }

      }

    }
  }
</script>

<style lang="less">
  .cashout {
    //标题样式
    .title {
      border-bottom: 2px solid #00a2ff;

      p {
        width: 6.1rem;
        height: 2.3rem;
        background-color: #00a2ff;
        border-radius: 0.2rem 0.2rem 0rem 0rem;
        color: #fff;
        text-align: center;
        line-height: 2.3rem;
      }
    }

    //主要内容样式
    .cashout_main {
      padding: 1.2rem;
      height: 100%;
      background-color: #fff;
      border-bottom: 1px solid #e1e1e1;
      //按钮样式
      .cashbtn {
        border-bottom: 1px solid #e1e1e1;
        display: flex;
        padding: 0.5rem;

        .rules {
          cursor: pointer;
        }

        p {
          margin: 0.5rem;

        }

        p:last-child {
          color: #00a2ff;
          text-decoration: underline #00a2ff;
        }
      }

      .cash_card {
        padding: 0.4rem;

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        span:first-child {
          width: 10%;
          display: flex;
          justify-content: flex-end;
        }

        > div {
          margin-bottom: 10px;
          line-height: 3.6rem;
          display: flex;
          align-items: center;

          .changecard {
            color: #00a2ff;
            text-decoration: underline #00a2ff;
            cursor: pointer;
            margin-left: 1rem;
          }

          .bankcard {
            display: flex;
            flex-wrap: wrap;
            width: 12.7rem;
            height: 3.1rem;
            background-color: #ffffff;
            border: solid 1px #cccccc;

            p {
              height: 40%;
              width: 100%;
              line-height: 0;

            }

            p:first-child {
              height: 30%;
            }

            p:nth-child(2) {
              margin-left: 3.6rem;;
            }

            P:last-child {
              color: #cccccc;
              margin-left: 3.6rem;
              margin-bottom: 0.2rem;
            }

            .bankimg {
              width: 2.6rem;
              height: 2.3rem;
              margin: 0.4rem;
            }
          }

          .cash_money {
            width: 5.8rem;
            height: 1.3rem;
            font-size: 1.5rem;
            color: #ff0000;
            line-height: 1.3rem;;

          }
        }

        .monet_input {
          padding-left: 10%;
          line-height: 1.6rem;

          .red_tip {
            color: red;
          }

          p {
            margin-bottom: 2rem;;
          }

          .el-button {
            span {
              margin: 0;
              width: auto;
            }
          }

          .rules {
            margin: 0 0 0 15px;
            cursor: pointer;
            color: #00a2ff;
            text-decoration: underline #00a2ff;
          }
        }
      }
    }
    //提现成功dialog
    .submit_info {
      > div {
        margin-bottom: 10px;
      }
      .submit_info_title {
        color: #999;
      }
    }
  }
</style>
