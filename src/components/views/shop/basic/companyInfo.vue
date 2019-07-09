<template>
  <div>
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
              <el-input style="width: 440px;" v-model="ruleForm.applier" placeholder="请输入经办人姓名"></el-input>
            </el-form-item>
            <el-form-item label="经办人手机：" prop="chargePerple_phone">
              <el-input style="width: 440px;" v-model="ruleForm.applierPhone" placeholder="请输入经办人手机"></el-input>
            </el-form-item>
            <el-form-item label="负责人姓名：" prop="responsPerple_name">
              <el-input style="width: 440px;" v-model="ruleForm.manager" placeholder="请输入负责人姓名"></el-input>
            </el-form-item>
            <el-form-item label="负责人手机：" prop="responsPerple_phone">
              <el-input style="width: 440px;" v-model="ruleForm.managerPhone" placeholder="请输入负责人手机"></el-input>
            </el-form-item>
            <el-form-item label="集团/公司座机号：">
              <el-input style="width: 60px;" placeholder="023" v-model="ruleForm.areaCard"></el-input>
              <span> - </span>
              <el-input style="width: 368px;" placeholder="55555555" v-model="ruleForm.telephone"></el-input>
            </el-form-item>

          </div>
        </div>

        <div class="form_wrap">
          <div class="form_span">
            <span>公司信息</span>
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
              <el-input style="width: 440px;" v-model="ruleForm.name" placeholder="请与营业执照上的公司名称保持一致"></el-input>
            </el-form-item>
            <el-form-item label="法人姓名：" prop="legalperson_name">
              <el-input style="width: 440px;" v-model="ruleForm.legalPerson" placeholder="请与营业执照上的法人姓名保持一致"></el-input>
            </el-form-item>
            <el-form-item label="法人电话：">
              <el-input style="width: 440px;" v-model="ruleForm.legalPersonMobile" placeholder="请输入法人电话"></el-input>
            </el-form-item>
            <el-form-item label="法人身份证号：">
              <el-input style="width: 440px;" v-model="ruleForm.legalPersonIdcard" placeholder="请输入法人18位身份证号"></el-input>
            </el-form-item>

            <el-form-item label="法人身份证：" >
              <div class="cardImg_style">
                <div>
                  <!--<el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                  >
                    <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>-->


                  <CustomUpload :img="idFacadeImgUpload"></CustomUpload>
                </div>
                <p>（身份证正面照）</p>
              </div>

              <div class="cardImg_style marLeft_40">
                <div>
                 <!-- <viewer :images="['https://picsum.photos/500/300']">
                    <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/250/160`" alt="" title="点击查看大图">
                  </viewer>-->
                  <CustomUpload :img="idBackImgUpload"></CustomUpload>
                </div>
                <p>（身份证反面照）</p>
              </div>

              <div class="tip_style">要求：证件文字清新，建议使用原图</div>
            </el-form-item>

            <el-form-item label="微信账号：">
              <el-input style="width: 440px;" v-model="ruleForm.alipayAccount" placeholder="请输入微信账号"></el-input>
            </el-form-item>
            <el-form-item label="支付宝账号：">
              <el-input style="width: 440px;" v-model="ruleForm.wechatAccount" placeholder="请输入支付宝账号"></el-input>
            </el-form-item>

          </div>
        </div>

        <div class="marginTop_30" style="padding-left: 20px;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>

      <!--详情-->
      <div v-show="pageType === 0">
        <!--审核状态显示 no_pass 是未通过，auditing 是审核中，pass 是审核通过 -->
        <!--<div class="state pass" v-if="stateIsShow === true">
          <div class="left">
            &lt;!&ndash;<span>审核未通过！</span>&ndash;&gt;
            &lt;!&ndash;<span>公司信息审核中！</span>&ndash;&gt;
            <span>审核通过！</span>
            <span>原因：***************************************</span>
          </div>
          <div class="right">
            <span>2017-02-14</span>
            &lt;!&ndash;<el-button type="primary" size="mini">修改</el-button>&ndash;&gt;
            <el-button type="primary" size="mini" @click="stateIsShow = false">知道了</el-button>
          </div>
        </div>-->

        <div class="form_wrap">
          <div class="form_span">
            <span>联系方式</span>
          </div>
          <div class="form_box">
            <el-form-item label="经办人姓名：" >
              <p class="info_p">{{ruleForm.applier}}</p>
            </el-form-item>
            <el-form-item label="经办人手机：" >
              <p class="info_p">{{ruleForm.applierPhone}}</p>
            </el-form-item>
            <el-form-item label="负责人姓名：" >
              <p class="info_p">{{ruleForm.manager}}</p>
            </el-form-item>
            <el-form-item label="负责人手机：" >
              <p class="info_p">{{ruleForm.managerPhone}}</p>
            </el-form-item>
            <el-form-item label="集团/公司座机号：" >
              <p class="info_p">{{ruleForm.telephone}}</p>
            </el-form-item>
          </div>
        </div>

        <div class="form_wrap">
          <div class="form_span">
            <span>公司信息</span>
          </div>
          <div class="form_box">
            <el-form-item label="公司类型：">
              <p class="info_p">{{ruleForm.componyType}}</p>
            </el-form-item>
            <el-form-item label="公司名称：">
              <p class="info_p">{{ruleForm.name}}</p>
            </el-form-item>
            <el-form-item label="法人姓名：">
              <p class="info_p">{{ruleForm.legalPerson}}</p>
            </el-form-item>
            <el-form-item label="法人电话：">
              <p class="info_p">{{ruleForm.legalPersonMobile}}</p>
            </el-form-item>
            <el-form-item label="法人身份证号：">
              <p class="info_p">{{ruleForm.legalPersonIdcard}}</p>
            </el-form-item>
            <el-form-item label="法人身份证：" >
              <div class="cardImg_style">
                <viewer :images="idFacadeImg">
                  <img v-for="item in idFacadeImg" class="vue-lazyload avatar" v-lazy="item.pics" alt="" title="点击查看大图">
                </viewer>
                <p>（身份证正面照）</p>
              </div>

              <div class="cardImg_style marLeft_40">
                <viewer :images="idBackImg">
                  <img v-for="item in idBackImg" class="vue-lazyload avatar" v-lazy="item.pics" alt="" title="点击查看大图">
                </viewer>
                <p>（身份证反面照）</p>
              </div>
            </el-form-item>
            <el-form-item label="微信账号：">
              <p class="info_p">{{ruleForm.wechatAccount}}</p>
            </el-form-item>
            <el-form-item label="支付宝账号：">
              <p class="info_p">{{ruleForm.alipayAccount}}</p>
            </el-form-item>
          </div>
        </div>

        <div style="padding-left: 20px;" class="marginTop_30">
          <el-button type="primary" @click="edit">修改</el-button>
        </div>
      </div>
    </el-form>
<!--弹出层-->
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="500px">
      <span>修改信息将提交平台审核，确定提交公司信息变更吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ChangeCompanyInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="资料更新提醒"
      :visible.sync="updateVisible"
      width="500px">
      <span>由于系统升级，账户安全性提高，请您完成店铺相关资料的更新，否则将无法进行交易。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">稍后再说</el-button>
        <el-button type="primary" @click="updateData">立即更新</el-button>
      </span>
    </el-dialog>

    <div style="height: 30px;"></div><!--只用来占位-->
  </div>
</template>

<script>
  import GetCompanyInfo from '../../../../api/CompanyInfo/GetCompanyInfo'
  import changeCompanyInfo from '../../../../api/ShopInfo/ChangeCompanyInfo'
  import CustomUpload from '@/components/public/customUpload'
  export default {
    components: {
      // upload,
      CustomUpload
    },

    data () {
      return {
        pageType: 0, // 页面类型：0是查看，1是编辑
        stateIsShow: true, // 审核状态显示: true是显示，false是不显示
        dialogVisible: false, // 点击修改时的确认提示
        updateVisible: false,//
        ruleForm: {
          applier: '',//经办人姓名
          applierPhone: '',//经办人电话
          manager: '',//负责人姓名
          managerPhone: '',//负责人电话
          imageUrl: '',
          componyType: '',
          companyPhone:'',//公司电话
          name:'',
          legalPerson:'',//法人姓名
          legalPersonMobile:'',//法人电话
          legalPersonIdcard:'',//法人身份证
          alipayAccount:'',
          wechatAccount:'',
          areaCard:'',
          telephone:''//公司联系电话,
        },
        idFacadeImg:[],
        idBackImg:[],
        rules: {
          applier: [
            { required: true, message: '请输入经办人姓名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          applierPhone: [
            { required: true, message: '请输入经办人手机', trigger: 'blur' }
          ],
          manager: [
            { required: true, message: '请输入负责人姓名', trigger: 'blur' }
          ],
          managerPhone: [
            { required: true, message: '请输入负责人手机', trigger: 'blur' }
          ],
          legalPerson: [
            { required: true, message: '请输入法人姓名', trigger: 'blur' }
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
        areaCode:'',

        idFacadeImgUpload : { idName: 'idFacadeImgUpload', limit: 1, imgArr: [] },
        idBackImgUpload : { idName: 'idBackImgUpload', limit: 1, imgArr: [] },
        data:[],
        idFacade:'',
        idBack:'',
      };
    },
    computed: {
      //审核状态
      SupplementInformationStatus() {
        return this.$parent.status
      }
    },

    methods: {
      updateData() {
        this.$router.push({name: 'UpdataCompany'});
      },
      /**
       * 表单提交
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid,x) => {
          console.log(x);
          console.log(formName, "formName==================");
          if (valid) {
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
      edit() {
        if (this.SupplementInformationStatus === 3) {
          this.updateVisible = true;
        } else {
          this.pageType = 1;
        }
      },
      ChangeCompanyInfo(){

        let idFacadeImg = ''
        if(this.idFacadeImgUpload.imgArr !== null && this.idFacadeImgUpload.imgArr !== undefined && this.idFacadeImgUpload.imgArr.length > 0){
          idFacadeImg = this.idFacadeImgUpload.imgArr[0]
        }else{
          idFacadeImg = this.idFacade
        }

        let idBackImg = ''
        if(this.idBackImgUpload.imgArr !== null && this.idBackImgUpload.imgArr !== undefined && this.idBackImgUpload.imgArr.length > 0){
          idBackImg = this.idBackImgUpload.imgArr[0]
        }else{
          idBackImg = this.idBack
        }

        var data ={
          "type":this.ruleForm.componyType,
          "name": this.ruleForm.name,
          "telephone":this.ruleForm.telephone,
          "address": this.data.address,
          "cardNumber": this.data.cardNumber,
          "cardPics": this.data.cardPics,
          "legalPerson": this.ruleForm.legalPerson,
          "legalPersonMobile": this.ruleForm.legalPersonMobile,
          "legalPersonIdcard": this.ruleForm.legalPersonIdcard,
          "applier": this.ruleForm.applier,
          "applierPhone": this.ruleForm.applierPhone,
          "manager": this.ruleForm.manager,
          "managerPhone": this.ruleForm.managerPhone,
          "companyPhone": this.data.companyPhone,
          "wechatAccount": this.ruleForm.wechatAccount,
          "alipayAccount": this.ruleForm.alipayAccount,
          "reason": this.data.reason,
          "status": this.data.status,
          "auditTime": "",
          "areaCard":this.ruleForm.areaCard,
          "certificateDate": this.data.certificateDate,
          "idFacadeImg": idFacadeImg,
          "idBackImg": idBackImg,
          "clientVersion": "v1",
          "clientTimespan": new Date().toLocaleString()
        }
        changeCompanyInfo.call(this,data).then(res=>{
          if(res.data.code === 1){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.goBack()
            this.dialogVisible = false
          }else{
            this.$message.error(res.data.desc);
          }
        })
      },
      /**
       * 返回
       */
      goBack() {
        this.pageType = 0;
      },
    },
    created: async function () {
      this.time = new Date().toLocaleString();
      GetCompanyInfo.call(this,`?input.clientTimespan=${this.time}`).then(res=>{
        if (res.data.code === 1) {
            var data = res.data.data
            this.data = data
            this.ruleForm.applier = data.applier
            this.ruleForm.applierPhone = data.applierPhone
            this.ruleForm.manager = data.manager
            this.ruleForm.managerPhone = data.managerPhone
            this.ruleForm.companyPhone = data.companyPhone
            this.ruleForm.componyType = data.type
            this.ruleForm.name = data.name
            this.ruleForm.legalPerson = data.legalPerson
            this.ruleForm.legalPersonMobile = data.legalPersonMobile
            this.ruleForm.legalPersonIdcard  = data.legalPersonIdcard
            this.ruleForm.alipayAccount = data.alipayAccount //支付宝
            this.ruleForm.wechatAccount  = data.wechatAccount //微信账号
            this.idFacadeImg.push({pics: data.idFacadeImg })
            this.idFacade = data.idFacadeImg
            this.idBackImg.push({pics: data.idBackImg })
            this.idBack = data.idBackImg
            this.ruleForm.legalperson_name = data.legalPerson
            this.ruleForm.areaCard = data.areaCard
            this.ruleForm.telephone = data.telephone
        }
      });
    },
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
