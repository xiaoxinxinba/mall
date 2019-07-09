<template>
  <div class="amend">
    <div class="amend-main">
      <div class="title-btn">
        <el-button type="primary" @click="record">年审/变更记录</el-button>
        <el-button type="primary" @click="annualVerify">上传年审资料</el-button>
      </div>


      <!--营业执照上传-->
      <div class="license">
        <div class="license-num"><div class="input-title"><span style="color: #ff0000">*</span><span>营业执照号</span></div><el-input placeholder="请输入营业执照号" v-model="licenseNum" clearable></el-input></div>

        <div class="license-upload">
          <div class="license-uploader">
            <!--<el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleLicenseSuccess"
              :before-upload="beforeLicenseUpload">
              <img v-if="licenceSrc" :src="licenceSrc" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>-->
            <CustomUpload :img="licence"></CustomUpload>

            <!--<div class="test">
              <CustomUpload :img="child"></CustomUpload>
            </div>-->
          </div>

          <div class="license-example">
            <div>图示</div>
            <img src="./img/license.png" alt="">
          </div>

          <div class="license-explain">
            <span>营业执照需满足以下要求，否则会影响店铺销售：</span>
            <ul>
              <li>1、影印件图片必须是营业执照副本。</li>
              <li>2、影印件要求必须为彩色、清晰的数码相机拍摄件或扫描件，涂改后无效 ( 或黑白影印件加盖公司红色公章 )。</li>
              <li>3、影印件上的公司名称必须与你公司信息中填写的公司名称完全一致。</li>
              <li>4、证件须在有效期之内。</li>
              <li>5、图片必须清晰、完整、方向正确，不能带有无关的水印、标记或者其他网站的logo。</li>
              <li>6、支持jpg、png、bmp的图片格式，大小不超过8M。</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="establishDate">
        <div class="input-title">成立日期</div><el-date-picker clearable v-model="establishDate" type="date" placeholder="选择日期"></el-date-picker>
      </div>

      <div class="overDate">
        <div class="input-title">有效期至</div><el-date-picker clearable v-model="overDate" type="date" placeholder="选择日期"></el-date-picker>
      </div>

    </div>

    <div class="footer">
      <el-button type="primary" @click="changeLog(0)">提交审核</el-button>
      <el-button type="info" @click="goBack">取消</el-button>
    </div>

    <!--上传年审资料弹框-->
    <div class="check">
      <el-dialog
        title="新增年审记录"
        :visible.sync="isAnnualVerify"
        width="615px"
        center>

        <el-form  :model="annualVerifyInfor" :rules="rules" ref="annualVerifyInfor" class="demo-form">

          <el-form-item label="年审时间" prop="date">
            <el-date-picker
              clearable
              v-model="annualVerifyInfor.date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item class="year-upload" label="年审营业执照副本" prop="imageUrl">
            <!--<el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleCheckSuccess"
              :before-upload="beforeCheckUpload">
              <img v-if="annualVerifyInfor.imageUrl" :src="annualVerifyInfor.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>-->
            <CustomUpload :img="annualVerifyInfor.imageUrl"></CustomUpload>
          </el-form-item>

          <el-form-item class="form-btn">
            <el-button type="primary" @click="annualVerifySure('annualVerifyInfor')">提交审核</el-button>
            <el-button @click="annualVerifyCancel('annualVerifyInfor')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>

</template>

<script>
  import CustomUpload from '@/components/public/customUpload'
  import AddLicenseChangeAndAnnualExa from '../../../../api/CompanyInfo/AddLicenseChangeAndAnnualExa';
  export default {
    name: "amend",
    data(){
      return{
        /*child: {
          idName: 'qqq', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 3, // 上传图片的最大限制个数
          imgArr: ['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201905/24/DZGrWusdDwb.jpg'], // 上传成功返回的数组，默认传空
        },*/
        licence: { idName: 'www', limit: 1, imgArr: [] },
        licenseNum:'',  //营业执照号
       // licenceSrc:'',  //营业执照src
        establishDate:'', //成立日期    Thu Apr 18 2019 00:00:00 GMT+0800 (中国标准时间)
        overDate:'',  //有效期至
        isAnnualVerify:false,   //控制年审框
        annualVerifyInfor:{
          date:'',  //年审时间
          imageUrl:{ idName: 'qqq', limit: 1, imgArr: [] },  //上传的图片
        },
        rules:{
          date:[{ required: true, message: '请选择年审时间', trigger: 'blur' }],
          imageUrl:[{ required: true, message: '请上传营业执照年审副本', trigger: 'blur' }]
        },
        clientVersion: 1,
        clientTimespan: new Date().toLocaleString(),
        status:'',
      }
    },
    methods:{
      //营业执照变更
      changeLog(type){
        if (this.status === '0') {
          this.$message.error('请等待审核完毕');
          return;
        }
        /*if (type === 0) {
          if (this.licence.imgArr.length<1){
            return alert('图片为空');
          }
        }
        if (type === 1) {
          if (this.annualVerifyInfor.imageUrl.imgArr.length<1){
            return alert('图片为空');
          }
        }*/
        let model={
          type:type,
          licenseImg:this.licence.imgArr[0],
          licenseCard:this.licenseNum,
          licenseCreateTime:this.establishDate.toLocaleString(),
          licenseValidTime:this.overDate.toLocaleString(),
          clientVersion: this.clientVersion,
          clientTimespan: this.clientTimespan,
          licenseAuditTime:this.annualVerifyInfor.date,
        };
        AddLicenseChangeAndAnnualExa.call(this,model)
          .then(
            res=>{
              if (res.data.code === 1) {
                /*console.log(('-----------------变更营业执照和年审记录---------------------------------------'));
                console.log(res.data.data);*/
                this.$message({
                  message:'提交成功，请耐心等待平台审核',
                })
              }else {
                this.$message.error('提交失败'+res.data.desc);
              }
            }
          )
      },
      //营业执照图片上传
      /*handleLicenseSuccess(res, file) {
        this.licenceSrc = URL.createObjectURL(file.raw);
        console.log(this.licenceSrc)
      },*/
     // beforeLicenseUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 10;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
     // },


      record(){
        this.$router.push({name:'AuditList'})
      },

      //年度审核
      annualVerify(){
        this.isAnnualVerify=true
      },
      annualVerifyCancel(formName){
        console.log('取消')
        this.$refs[formName].resetFields();
        this.isAnnualVerify=false
      },
      annualVerifySure(formName){
        //上传年审记录
       // console.log('确定')
        // this.isAnnualVerify=false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            this.$message({
              message: '提交成功，请耐心等待平台审核',
              type: 'success'
            });
            this.isAnnualVerify=false
            this.changeLog(1);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      goBack() {
        this.$router.go( -1 );
      },
      //年审图片上传
      /*handleCheckSuccess(res, file) {
        this.annualVerifyInfor.imageUrl = URL.createObjectURL(file.raw);
        console.log(this.annualVerifyInfor.imageUrl)
      },
      beforeCheckUpload(file) {*/
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 10;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
     // },
    },
    created() {
      //获取营业执照号
      let license=[];
      /*console.log(('-------------'));
      console.log(this.$route.query);*/
      license = this.$route.query.split(',');
      this.licenseNum =license[0];
      this.status=license[1];
        /*console.log(license[1]);*/
    },
    components: {
      // upload,
      CustomUpload
    },
    watch:{
      'child.idname'(val) {
      }
    }
  }
</script>

<style lang="less"  scoped>
  @import "less/amend.less";
</style>
