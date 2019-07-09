<template>
  <div class="transferaccounts">
    <div class="title"><span>转账给用户</span></div>
    <div>
      <div><p class="tips">温馨提示：仅限于对满集网用户进行转账，不能对商家进行转账</p></div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="用户信息：">
          <div>
            <img src="../img/avator.png" alt="" style="vertical-align: middle;"/><span
            style="color: #00a2ff;vertical-align: middle">张学友</span>
          </div>
        </el-form-item>
        <el-form-item label="用户账号：" prop="account">
          <el-input v-model="ruleForm.account" placeholder="请输入用户账号" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="转账金额：" prop="price">
          <el-input v-model="ruleForm.price" placeholder="请输入你的转账金额" style="width: 300px;"></el-input>
          <span style="color: #999;">{{maxMoneyTip}}</span>
        </el-form-item>
        <el-form-item label="转账通知：">
          <el-input v-model="ruleForm.notice" placeholder="请输入接受短信的手机号码" style="width: 300px;"></el-input>
        </el-form-item>
        <div class="verify">
          <strong style="font-size: 1.2em">安全验证</strong>
          <span style="font-size: 0.8em;color: #999">为了您的资金安全，请输入登录密码</span>
        </div>
        <el-form-item label="登录密码：" prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="请输入接受短信的手机号码"
                    style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认转账</el-button>
          <!--          <el-button @click="resetForm('ruleForm')">重置</el-button>-->
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--    弹出层-->
    <el-dialog
      title=""
      :visible.sync="submitDialog"
      width="35%">
      <div class="submit-dialog">
        <div class="header">
          <img src="../img/submit.png" alt=""/>
          <div>转账成功</div>
        </div>
        <div style="padding: 0 40px">
          <el-form label-width="120px">
            <el-form-item label="用户账号：">
              <strong>{{ruleForm.account}}</strong>
            </el-form-item>
            <el-form-item label="转账金额：">
              <strong style="color: red;">￥{{ruleForm.price}}</strong>
            </el-form-item>
            <el-form-item label="交易流水号：">
              <span>{{transactionNo}}</span>
            </el-form-item>
          </el-form>
        </div>
        <div style="text-align: center">
          <el-button @click="toDetail">查看详情</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import GetTransactionRule from '@/api/ShopPay/GetTransactionRule'
  import TransfeSure from '@/api/ShopPay/TransfeSure'
  import {JSEncrypt} from 'jsencrypt'

  export default {
    data() {
      //金额校检
      let validateMoney = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入金额'));
        } else if (value > this.maxMoney) {
          callback(new Error(`最大提现金额${this.maxMoney}`));
        } else {
          callback()
        }
      };
      return {
        transactionNo: '', //交易流水号
        maxMoney: 1000,
        maxMoneyTip: '',
        submitDialog: false,
        ruleForm: {
          account: '',//账号
          price: '',//金额
          notice: '',//通知
          password: '',//密码
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          price: [
            {required: true, validator: validateMoney, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入登录密码', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.dataInit();
    },
    methods: {
      toDetail() {
        this.$router.push({
          name: 'TransferDetail',
          query: {
            transionNo: this.transactionNo,
          }
        })
      },
      dataInit() {
        GetTransactionRule.call(this, {
          clientTimespan: this.$Tool.formatDate(new Date())
        }).then(res => {
          if (res.data.code === 1) {
            this.maxMoneyTip = res.data.data.perTransferMaxMoneyTip;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
            encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDC4wHerJc4BSst20Zb07lY9LeZss4OEEhe+SrnLyYy8hGquX/aTQNn+5wnV/+8ierKPgqPGIXPf1ZRww5/6yON+O7dAfJ7BRx85HneIWqwPCZToLck8DN8UXsBuXLMcG7tfMunnnZKenrPsAslN0eKvkYkvz4EPGdvmPwz0NCKXQIDAQAB');  // 设置公钥
            let rsaPassWord = encryptor.encrypt(this.ruleForm.password); // 对密码进行加密
            TransfeSure.call(this, {
              receiveUser: this.ruleForm.account,
              amount: this.ruleForm.price,
              payPassword: rsaPassWord,
              smsMobileTel: this.ruleForm.notice,
              clientTimespan: this.$Tool.formatDate(new Date()),
            }).then(res => {
              if (res.data.code === 1) {
                this.transactionNo = res.data.data.transactionNo;
                this.submitDialog = true;
              } else {
                this.$message.error(res.data.desc);
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>

<style lang="less">
  .transferaccounts {
    overflow: hidden;
    background-color: #fff;

    .title {
      padding: 0.8rem;
      background-color: #f9f9fb;

      span {
        font-weight: 800;
      }
    }

    .tips {
      padding: 15px;
      color: #999;
    }

    .verify {
      border-top: 1px solid #e1e1e1;
      padding: 20px 0 20px 40px;
    }

    .submit-dialog {
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
    }
  }
</style>
