<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <!--编辑-->
      <div v-show="pageType === 1">
        <div class="form_wrap">
          <div class="form_span">
            <span>联系方式 </span>
            <i>经办人、负责人须填写不同联系方式，否则将影响店铺订单信息接收</i>
          </div>
          <div class="form_box">
            <el-form-item label="经办人姓名：" prop="chargePerple_name">
              <el-input style="width: 440px;" v-model="ruleForm.chargePerple_name" placeholder="请输入经办人姓名"></el-input>
            </el-form-item>
            <el-form-item label="经办人手机：" prop="chargePerple_phone">
              <el-input style="width: 440px;" v-model="ruleForm.chargePerple_phone" placeholder="请输入经办人手机"></el-input>
            </el-form-item>
            <el-form-item label="负责人姓名：" prop="responsPerple_name">
              <el-input style="width: 440px;" v-model="ruleForm.responsPerple_name" placeholder="请输入负责人姓名"></el-input>
            </el-form-item>
            <el-form-item label="负责人手机：" prop="responsPerple_phone">
              <el-input style="width: 440px;" v-model="ruleForm.responsPerple_phone" placeholder="请输入负责人手机"></el-input>
            </el-form-item>
            <el-form-item label="集团/公司座机号：">
              <el-input style="width: 60px;" placeholder="023" v-model="ruleForm.tel_areaCode"></el-input>
              <span> - </span>
              <el-input style="width: 368px;" placeholder="55555555" v-model="ruleForm.tel_num"></el-input>
            </el-form-item>

          </div>
        </div>

        <div class="form_wrap">
          <div class="form_span">
            <span>其他信息</span>
            <i>请严格按照相关证件信息，正确填写公司信息</i>
          </div>
          <div class="form_box">
            <el-form-item label="公司类型：">
              <el-select v-model="ruleForm.componyType" placeholder="请选择公司类型" style="width: 440px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司名称：">
              <el-input style="width: 440px;" placeholder="请与营业执照上的公司名称保持一致" v-model="ruleForm.company_name"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名：" prop="legalperson_name">
              <el-input style="width: 440px;" v-model="ruleForm.legalperson_name" placeholder="请与营业执照上的法人姓名保持一致"></el-input>
            </el-form-item>
            <el-form-item label="法人电话：">
              <el-input style="width: 440px;" placeholder="请输入法人电话" v-model="ruleForm.legalperson_phone"></el-input>
            </el-form-item>
            <el-form-item label="法人身份证号：">
              <el-input style="width: 440px;" placeholder="请输入法人18位身份证号" v-model="ruleForm.legalperson_idCard"></el-input>
            </el-form-item>

            <el-form-item label="法人身份证：" >
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
                <p>（身份证正面照）</p>
              </div>

              <div class="cardImg_style marLeft_40">
                <div>
                  <viewer :images="['https://picsum.photos/500/300']">
                    <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/250/160`" alt="" title="点击查看大图">
                  </viewer>
                </div>
                <p>（身份证反面照）</p>
              </div>

              <div class="tip_style">要求：证件文字清新，建议使用原图</div>
            </el-form-item>


            <el-form-item label="营业执照号：">
              <el-input style="width: 440px;" placeholder="请输入营业执照号" v-model="ruleForm.license_code"></el-input><span class="license-one">营业执照号有变更？</span><span class="license-two">去重新入驻</span>
            </el-form-item>


            <el-form-item label="营业执照：" >
              <div class="license-style">
                <div class="upload">
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
                <div class="license-img"></div>
                <div class="license-explain">
                  <ul>
                    <div>营业执照需满足以下要求，否则会影响店铺销售：</div>
                    <li>1、影印件图片必须是营业执照副本。</li>
                    <li>2、影印件要求必须为彩色、清晰的数码相机拍摄件或扫描件，涂改后无效（或黑白影印件加盖公司红色公章）</li>
                    <li>3、影印件上的公司名称必须与你公司信息中填写的公司名称完全一致。</li>
                    <li>4、证件须在有效期之内。</li>
                    <li>5、图片必须清晰、完整、方向正确，不能带有无关的水印、标记或者其他网站的logo。</li>
                    <li>6、支持jpg、png、bmp的图片格式，大小不超过8M。</li>
                  </ul>
                </div>
              </div>
            </el-form-item>


            <el-form-item label="成立日期：">
              <el-date-picker style="width: 440px;" v-model="ruleForm.startDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>

            <el-form-item label="有效期：">
              <el-radio v-model="ruleForm.radio" label="长期有效">长期有效</el-radio>
              <el-radio v-model="ruleForm.radio" label="有效期至">有效期至</el-radio>
              <el-date-picker style="width: 220px;" v-model="ruleForm.endDate" type="date" placeholder="选择日期"></el-date-picker>
              <div class="end-date">无营业期限、获取截止日期、或结束日期为永久，请选择长期有效</div>
            </el-form-item>




            <el-form-item label="微信账号：">
              <el-input style="width: 440px;" placeholder="请输入微信账号" v-model="ruleForm.weChat"></el-input>
            </el-form-item>
            <el-form-item label="支付宝账号：">
              <el-input style="width: 440px;" placeholder="请输入支付宝账号" v-model="ruleForm.alipay"></el-input>
            </el-form-item>

          </div>
        </div>

        <div class="marginTop_30">
          <el-form-item>
            <el-button @click="goBack">上一步</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="500px">
      <span>修改信息将提交平台审核，确定提交公司信息变更吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        pageType: 1, // 页面类型：0是查看，1是编辑
        stateIsShow: true, // 审核状态显示: true是显示，false是不显示
        dialogVisible: false, // 点击修改时的确认提示
        ruleForm: {
          chargePerple_name: '',
          chargePerple_phone: '',
          responsPerple_name: '',
          responsPerple_phone: '',
          company_name:'',
          legalperson_name: '',
          imageUrl: '',
          componyType: '',
          tel_areaCode:'',
          tel_num:'',
          legalperson_phone:'',
          legalperson_idCard:'',
          weChat:'',
          alipay:'',
          license_code:'',
          startDate:'',
          radio:'长期有效',
          endDate:'',
        },
        rules: {
          chargePerple_name: [
            { required: true, message: '请输入经办人姓名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          chargePerple_phone: [
            { required: true, message: '请输入经办人手机', trigger: 'blur' }
          ],
          responsPerple_name: [
            { required: true, message: '请输入负责人姓名', trigger: 'blur' }
          ],
          responsPerple_phone: [
            { required: true, message: '请输入负责人手机', trigger: 'blur' }
          ],
          legalperson_name: [
            { required: true, message: '请输入法人姓名', trigger: 'blur' }
          ],
        },
        options: [{ // 公司类型参数
          value: '选项1',
          label: '个体户'
        }, {
          value: '选项2',
          label: '私营企业'
        }, {
          value: '选项3',
          label: '国营企业'
        }, {
          value: '选项4',
          label: '合资企业'
        }, {
          value: '选项5',
          label: '上市公司'
        }, {
          value: '选项6',
          label: '政府机构'
        }, {
          value: '选项7',
          label: '事业单位'
        }, {
          value: '选项8',
          label: '公益机构'
        }],
      };
    },

    methods: {
      /**
       * 表单提交
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid,x) => {
          console.log(x);
          console.log(formName, "formName==================");
          if (valid) {
            alert('submit!');
            this.dialogVisible = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // this.$router.push({name:'StoreShopInfor'})    //下一步
      },

      /**
       * 请求接口，提交数据
       */
      submitData() {
        this.dialogVisible = false;
        this.$message({ message: '修改成功', type: 'success' });
        this.pageType = 1;
      },

      /**
       * 图片上传方法
       */
      handleAvatarSuccess(res, file) {
        this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
      },
      /*beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },*/

      /**
       * 点击修改执行事件
       */




      /**
       * 返回
       */
      goBack() {

      },


    }
  }
</script>

<style lang="less" scoped>
  @import "./less/companyInfor.less";



  /*/deep/ .form_box > div {
    margin-bottom: 10px;
  }*/

</style>
