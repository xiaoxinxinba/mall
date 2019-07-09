<template>
  <!--银行卡信息-->
  <div class="container">
    <div class="remind">请认真核对已有的信息，并补充缺少的信息，否则将影响交易！</div>
    <div class="main">
      <div class="choose_type">
        <span>请选择绑定的帐户类型（必选）</span>
        <el-select style="width: 150px;" v-model="account" placeholder="请选择"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
      </div>
      <div class="main_list">
        <div class="main_title">
          <p>{{account === '企业商户'?'公司账户':'法人账户'}}</p>
          <p>温馨提示：您绑定的{{account === '企业商户'?'公司账户':'法人账户'}}信息请与《服务合同》上的信息保持一致</p>
        </div>

        <div class="main_from">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="190px" class="demo-ruleForm">
            <el-form-item label="持卡人姓名：" prop="name">
              <el-input style="width: 440px;" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="银行账号：" prop="bankNum">
              <el-input style="width: 440px;" v-model="ruleForm.bankNum" placeholder="请输入法人银行账号（仅限储蓄卡）"></el-input>
            </el-form-item>
            <el-form-item label="开户银行：" prop="bankOpen">
              <el-select style="width: 440px;" v-model="ruleForm.bankOpen" placeholder="请选择开户银行"><el-option v-for="item in optionsBankOpen" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
            </el-form-item>

            <el-form-item label="开户银行省市：" required>
              <div class="area_company">
                <div class="area_select">
                  <el-form-item label="" prop="province">
                    <el-select v-model="ruleForm.province" placeholder="请选择省份"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
                  </el-form-item>
                </div>
                <div class="area_select area_select_last">
                  <el-form-item label="" prop="city">
                    <el-select v-model="ruleForm.city" placeholder="请选择城市"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="所属支行：" prop="bankBase">
              <el-select style="width: 440px;" v-model="ruleForm.bankBase" placeholder="请选择所属支行"><el-option v-for="item in optionsBankOpen" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
            </el-form-item>
            <div class="bank_base">准确的所属支行信息，将会加快提现的到账速度</div>


            <el-form-item label="银行预留手机号：" prop="phone">
              <el-input style="width: 440px;" v-model="ruleForm.phone" placeholder="请输入银行预留手机号"></el-input>
            </el-form-item>

            <el-form-item label="银行卡照片：" v-show="account !== '企业商户'">
              <div class="cardImg_style">
                <div>
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                  >
                    <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <p>（银行卡正面照）</p>
              </div>

              <div class="cardImg_style marLeft_40">
                <div>
                  <viewer :images="['https://picsum.photos/500/300']">
                    <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/250/160`" alt="" title="点击查看大图">
                  </viewer>
                </div>
                <p>（银行卡反面照）</p>
              </div>

              <div class="tip_style">要求：证件文字清新，建议使用原图</div>
            </el-form-item>


            <el-form-item label="开户许可证或印鉴卡照片："  v-show="account === '企业商户'">
              <div class="cardImg_style">
                <div>
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                  >
                    <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </div>
            </el-form-item>



            <el-form-item>
              <el-button @click="goBack">上一步</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">提交审核</el-button>

            </el-form-item>
          </el-form>

        </div>


      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "updataBank",
    data(){
      return{
        account:'小微商户',
        options:[{value:'小微商户',label:'小微商户'},{value:'个体商户',label:'个体商户'},{value:'企业商户',label:'企业商户'}],
        optionsBankOpen:[{value:'建设银行',label:'建设银行'},{value:'工商银行',label:'工商银行'},{value:'农业银行',label:'农业银行'}],
        ruleForm:{
          name:'',
          bankNum:'',
          bankOpen:'',
          province:'',
          city:'',
          bankBase:'',
          phone:'',
        },
        rules:{
          name:[{ required: true, message: '请输入持卡人姓名', trigger: 'blur' }],
          bankNum:[{ required: true, message: '请输入银行卡账号', trigger: 'blur' }],
          bankOpen:[{ required: true, message: '请选择开户银行', trigger: 'change' }],
          province:[{ required: true, message: '请选择省份', trigger: 'change' }],
          city:[{ required: true, message: '请选择城市', trigger: 'change' }],
          bankBase:[{ required: true, message: '请选择所属支行', trigger: 'change' }],
          phone:[{ required: true, message: '请选择所属支行', trigger: 'change' }],

        },
      }
    },
    methods:{
      handleAvatarSuccess(res, file) {

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      goBack() {
        this.$router.go(-1);
      }
    },
    created(){
      this.$parent.change(3);
    },
  }
</script>

<style lang="less" scoped>
@import "less/updataBank.less";
</style>
