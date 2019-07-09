<template>
  <div>
    <div class="title">
      <p>授权代理人信息</p>
    </div>
    <div class="main">
      <el-form :model="agent_form" :rules="agent_rule" ref="agent_rule" label-width="140px" size="medium">
        <el-form-item label="代理人姓名：" prop="agent_name">
          <el-input style="width: 300px" v-model="agent_form.agent_name"></el-input>
        </el-form-item>
        <el-form-item label="代理人手机：" prop="agent_phone">
          <el-input style="width: 300px" v-model="agent_form.agent_phone"></el-input>
        </el-form-item>
        <el-form-item label="代理人身份证号：" prop="agent_idCard">
          <el-input style="width: 300px" v-model="agent_form.agent_idCard"></el-input>
        </el-form-item>
        <el-form-item label="代理人身份证照片：" prop="agent_idCard_positive">
          <el-input v-model="agent_form.agent_idCard_positive" v-if="false"></el-input>
          <div class="inline">
            <CustomUpload :img="agent_form.agent_idCard_positive"></CustomUpload>
            <p>（身份证正面）</p>
          </div>
          <div class="inline">
            <CustomUpload :img="agent_form.agent_idCard_negative"></CustomUpload>
            <p>（身份证反面）</p>
          </div>
          <div class="inline" style="color: #00a2ff">
            要求：证件文字清新，建议使用原图
          </div>
        </el-form-item>
        <el-form-item label="授权委托书：" prop="agent_book">
          <el-input v-model="agent_form.agent_book" v-if="false"></el-input>
          <div class="inline">
            <CustomUpload :img="agent_form.agent_book"></CustomUpload>
          </div>
          <div class="inline" style="line-height: 1.8;text-align: left;color: #999">
            要求：<br/> 1、委托书需加盖公章；<br/> 2、拍照上传请确保照片清晰；<br/> 3、支持jpg、png图片格式，大小不超过8M <br/> 4、拍照上传请确保照片清晰； <br/> 5、支持jpg、png图片格式，大小不超过8M。
            <br/>
            <el-button type="primary" size="mini" style="margin-top: 10px;">下载模板</el-button>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button size="medium" type="info" @click="$router.go(-1)">上一步</el-button>
          <el-button size="medium" type="primary" @click="submit('agent_rule')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import CustomUpload from '@/components/public/customUpload'
  import BIZChangeProxySave from '@/api/ShopInfo/BIZChangeProxySave'

  export default {
    name: "agentInfo",
    components: {
      CustomUpload
    },
    data() {
      //手机验证规则
      let validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('手机号格式有误'))
        } else {
          callback()
        }
      };
      //身份证验证规则
      let validateIdCard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号'));
        } else if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value))) {
          callback(new Error('身份证号格式有误'))
        } else {
          callback()
        }
      };
      //身份证照片验证规则
      let validateIdCardImg = (rule, value, callback) => {
        if (this.agent_form.agent_idCard_positive.imgArr.length === 0 || this.agent_form.agent_idCard_negative.imgArr.length === 0) {
          callback(new Error('请上传身份证照片'));
        } else {
          callback()
        }
      };
      //授权书照片验证规则
      let validateBookImg = (rule, value, callback) => {
        if (this.agent_form.agent_book.imgArr.length === 0) {
          callback(new Error('请上传授权委托书照片'));
        } else {
          callback()
        }
      };
      return {
        agent_form: {
          agent_name: '',
          agent_phone: '',
          agent_idCard: '',
          agent_idCard_positive: {
            idName: 'agent_idCard_positive', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
            limit: 1, // 上传图片的最大限制个数
            imgArr: [], // 上传成功返回的数组，默认传空
          },
          agent_idCard_negative: {
            idName: 'agent_idCard_negative', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
            limit: 1, // 上传图片的最大限制个数
            imgArr: [], // 上传成功返回的数组，默认传空
          },
          agent_book: {
            idName: 'agent_book', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
            limit: 1, // 上传图片的最大限制个数
            imgArr: [], // 上传成功返回的数组，默认传空
          },
        },
        agent_rule: {
          agent_name: [{required: true, message: '请输入代理人姓名', trigger: 'blur'}],
          agent_phone: [{required: true, validator: validatePhone, trigger: 'blur'}],
          agent_idCard: [{required: true, validator: validateIdCard, trigger: 'blur'}],
          agent_idCard_positive: [{required: true, validator: validateIdCardImg, trigger: 'blur'}],
          agent_book: [{required: true, validator: validateBookImg, trigger: 'blur'}]
        }
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            BIZChangeProxySave.call(this, {
              user_id: JSON.parse(sessionStorage.getItem('tokenInfo')).userId,
              shop_id: JSON.parse(sessionStorage.getItem('tokenInfo')).shopId,
              name: this.agent_form.agent_name,
              tel: this.agent_form.agent_phone,
              cert_no: this.agent_form.agent_idCard,
              img_cert_obverse: this.agent_form.agent_idCard_positive.imgArr[0],
              img_cert_reverse: this.agent_form.agent_idCard_negative.imgArr[0],
              img_trust_instrument: this.agent_form.agent_book.imgArr[0],
            }).then(res => {
              if (res.data.code === 1) {
                this.$router.push({name: 'ChangeCompanyInfo'})
              } else {
                this.$message.error(res.data.desc);
              }
            })
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .title {
    border-bottom: 2px solid #00a2ff;

    p {
      width: 7.1rem;
      height: 2.3rem;
      background-color: #00a2ff;
      border-radius: 0.2rem 0.2rem 0rem 0rem;
      color: #fff;
      text-align: center;
      line-height: 2.3rem;
    }
  }

  .main {
    padding: 20px;
    background-color: #fff;
    .inline {
      display: inline-block;
      margin-right: 20px;
      vertical-align: bottom;
      text-align: center;
    }
  }
</style>
