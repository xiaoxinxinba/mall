<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <!--编辑-->
      <div v-show="pageType === 1">
        <div class="form_wrap">
          <div class="form_span">
            <span>法人账户 </span>
          </div>
          <div class="form_box">
            <el-form-item label="账户类型：" prop="accountType">
              <el-input style="width: 440px;" v-model="ruleForm.accountType" placeholder="请输入账户类型"></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" prop="companyName">
              <el-input style="width: 440px;" v-model="ruleForm.companyName" placeholder="请输入公司名称"></el-input>
            </el-form-item>
            <el-form-item label="银行账号：" prop="bankAccount">
              <el-input style="width: 440px;" v-model="ruleForm.bankAccount" placeholder="请输入银行账号"></el-input>
            </el-form-item>
            <el-form-item label="开户银行：" prop="bankOfDeposit">
              <el-input style="width: 440px;" v-model="ruleForm.bankOfDeposit" placeholder="请输入开户银行"></el-input>
            </el-form-item>
            <el-form-item label="所属支行：" prop="subordinateBranch">
              <el-input style="width: 440px;" v-model="ruleForm.subordinateBranch" placeholder="请输入所属支行"></el-input>
            </el-form-item>

            <div class="before_span label_lineHeight25">
              <el-form-item label="开户许可证或印鉴卡照片：" >
                <div class="cardImg_style">
                  <div>
                    <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="licenceImgSuccess"
                    >
                      <img v-if="ruleForm.licenceImg" :src="ruleForm.licenceImg" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                </div>
              </el-form-item>
            </div>

          </div>
        </div>

        <div class="form_wrap">
          <div class="form_span">
            <span>委托收款</span>
          </div>
          <div class="form_box">
            <el-form-item label="受托方：" prop="trustee">
              <el-input style="width: 440px;" v-model="ruleForm.trustee" placeholder="请输入受托方"></el-input>
            </el-form-item>
            <el-form-item label="银行账号：" prop="trusteeAccount">
              <el-input style="width: 440px;" v-model="ruleForm.trusteeAccount" placeholder="请输入银行账号"></el-input>
            </el-form-item>
            <el-form-item label="开户银行：" prop="trusteeBankOfDeposit">
              <el-input style="width: 440px;" v-model="ruleForm.trusteeBankOfDeposit" placeholder="请输入开户银行"></el-input>
            </el-form-item>
            <el-form-item label="所属支行：" prop="trusteeBranch">
              <el-input style="width: 440px;" v-model="ruleForm.trusteeBranch" placeholder="请输入所属支行"></el-input>
            </el-form-item>

            <div class="before_span">
              <el-form-item label="银行卡照片：" >
                <div class="cardImg_style">
                  <div>
                    <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="backImgPositiveSuccess"
                    >
                      <img v-if="ruleForm.backImgPositive" :src="ruleForm.backImgPositive" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                  <p>（银行卡正面）</p>
                </div>

                <div class="cardImg_style marLeft_40">
                  <div>
                    <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="backImgOtherSuccess"
                    >
                      <img v-if="ruleForm.backImgOther" :src="ruleForm.backImgOther" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                  <p>（银行卡反面）</p>
                </div>
              </el-form-item>
            </div>

            <el-form-item label="委托方：" prop="entrustingParty">
              <el-input style="width: 440px;" v-model="ruleForm.entrustingParty" placeholder="请输入委托方"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="entrustingPartyPhone">
              <el-input style="width: 440px;" v-model="ruleForm.entrustingPartyPhone" placeholder="请输入委托方联系电话"></el-input>
            </el-form-item>

            <div class="before_span label_lineHeight25">
              <el-form-item label="授权书：" >
                <div class="cardImg_style">
                  <div>
                    <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="authorizationSuccess"
                    >
                      <img v-if="ruleForm.authorization" :src="ruleForm.authorization" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                </div>
              </el-form-item>
            </div>

          </div>
        </div>

        <div class="marginTop_30">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="goBack">返回</el-button>
          </el-form-item>
        </div>
      </div>

      <!--详情-->
      <div v-show="pageType === 0">

        <div class="form_wrap">
          <div class="form_span">
            <span>法人账户</span>
          </div>
          <div class="form_box">
            <el-form-item label="账户类型：" >
              <p class="info_p">企业商户</p>
            </el-form-item>
            <el-form-item label="公司名称：" >
              <p class="info_p">重庆XXX网络科技有限公司</p>
            </el-form-item>
            <el-form-item label="银行账号：" >
              <p class="info_p">5222 2634 8787 098</p>
            </el-form-item>
            <el-form-item label="开户银行：" >
              <p class="info_p">工商银行</p>
            </el-form-item>
            <el-form-item label="所属支行：" >
              <p class="info_p">观音桥支行</p>
            </el-form-item>

            <div class="label_lineHeight25">
              <el-form-item label="开户许可证或印鉴卡照片：" >
                <div class="cardImg_style">
                  <viewer :images="['https://picsum.photos/500/300']">
                    <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/250/160`" alt="" title="点击查看大图">
                  </viewer>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="form_wrap">
          <div class="form_span">
            <span>委托收款</span>
          </div>
          <div class="form_box">
            <el-form-item label="受托方：">
              <p class="info_p">李法人</p>
            </el-form-item>
            <el-form-item label="银行账号：">
              <p class="info_p">5222 3456 9898 234</p>
            </el-form-item>
            <el-form-item label="开户银行：">
              <p class="info_p">建设银行</p>
            </el-form-item>
            <el-form-item label="所属支行：">
              <p class="info_p">观音桥支行</p>
            </el-form-item>
            <el-form-item label="银行卡照片：" >
              <div class="cardImg_style">
                <viewer :images="['https://picsum.photos/500/300']">
                  <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/250/160`" alt="" title="点击查看大图">
                </viewer>
                <p>（银行卡正面）</p>
              </div>

              <div class="cardImg_style marLeft_40">
                <viewer :images="['https://picsum.photos/500/300']">
                  <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/250/160`" alt="" title="点击查看大图">
                </viewer>
                <p>（银行卡反面）</p>
              </div>
            </el-form-item>
            <el-form-item label="委托方：">
              <p class="info_p">重庆XXX网络科技有限公司</p>
            </el-form-item>
            <el-form-item label="联系电话：">
              <p class="info_p">18845615652</p>
            </el-form-item>

            <div class="label_lineHeight25">
              <el-form-item label="授权书：" >
                <div class="cardImg_style">
                  <viewer :images="['https://picsum.photos/500/300']">
                    <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/250/160`" alt="" title="点击查看大图">
                  </viewer>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="marginTop_30">
          <el-form-item>
            <el-button type="primary" @click="edit">修改</el-button>
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
        pageType: 0, // 页面类型：0是查看，1是编辑
        dialogVisible: false, // 点击修改时的确认提示
        ruleForm: {
          accountType: '',
          companyName: '',
          bankAccount: '',
          bankOfDeposit: '',
          subordinateBranch: '',
          licenceImg: '',
          trustee: '',
          trusteeAccount: '',
          trusteeBankOfDeposit: '',
          trusteeBranch: '',
          backImgPositive: '',
          backImgOther: '',
          entrustingParty: '',
          entrustingPartyPhone: '',
          authorization: ''
        },
        rules: {
          accountType: [
            { required: true, message: '请输入账户类型', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          companyName: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ],
          bankAccount: [
            { required: true, message: '请输入银行账号', trigger: 'blur' }
          ],
          bankOfDeposit: [
            { required: true, message: '请输入开户银行', trigger: 'blur' }
          ],
          subordinateBranch: [
            { required: true, message: '请输入所属支行', trigger: 'blur' }
          ],
          trustee: [
            { required: true, message: '请输入受托方', trigger: 'blur' }
          ],
          trusteeAccount: [
            { required: true, message: '请输入银行账号', trigger: 'blur' }
          ],
          trusteeBankOfDeposit: [
            { required: true, message: '请输入开户银行', trigger: 'blur' }
          ],
          trusteeBranch: [
            { required: true, message: '请输入所属支行', trigger: 'blur' }
          ],
          entrustingParty: [
            { required: true, message: '请输入委托方', trigger: 'blur' }
          ],
          entrustingPartyPhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ]
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
       * 图片上传（开户许可证或印签卡照片）
       */
      licenceImgSuccess(res, file) {
        this.ruleForm.licenceImg = URL.createObjectURL(file.raw);
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
       * 图片上传（银行卡正面）
       */
      backImgPositiveSuccess(res, file) {
        this.ruleForm.backImgPositive = URL.createObjectURL(file.raw);
      },

      /**
       * 图片上传（银行卡反面）
       */
      backImgOtherSuccess(res, file) {
        this.ruleForm.backImgOther = URL.createObjectURL(file.raw);
      },

      /**
       * 图片上传（授权书）
       */
      authorizationSuccess(res, file) {
        this.ruleForm.authorization = URL.createObjectURL(file.raw);
      },

      /**
       * 点击修改执行事件
       */
      edit() {
        this.pageType = 1;
      },

      /**
       * 返回
       */
      goBack() {
        this.pageType = 0;
      },


    }
  }
</script>

<style lang="less" scoped>
  @import "./less/information.less";

  .avatar-uploader {
    width: 250px;
    height: 160px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #eee;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 250px;
    height: 160px;
    display: block;
  }

  /*/deep/ .form_box > div {
    margin-bottom: 10px;
  }*/

</style>
