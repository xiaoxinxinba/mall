<template>
    <div>
      <!--承诺书-->
      <div class="promise" v-if="pageType===0">
        <div class="remind">
          您的营业执照<span v-if="deadline<1">已经到期</span><span v-if="deadline>0">还有{{deadline}}天到期</span>，请及时更新营业执照相关信息
        </div>
        <div class="promise-main">
            <div class="date">营业执照承诺办证日期<span>2018-05-29</span></div>
            <div class="promise-book">
              <viewer :images="licenseImg.split('')">
                <img class="vue-lazyload avatar" v-lazy="licenseImg" alt="" title="点击查看大图">
              </viewer>
            </div>
        </div>
        <el-button class="promise-btn" type="primary" @click="upLicense">上传营业执照</el-button>
      </div>



      <!--营业执照-->
      <div class="license" v-if="pageType===1">
        <div class="remind" v-if="stateLicense===0">您的营业执照<span v-if="deadline<1">已经到期</span><span v-if="deadline>0">还有{{deadline}}天到期</span>，请及时更新营业执照相关信息</div>
        <div class="remind" style="color: #fb6800"  v-if="stateLicense===1"><i class="el-icon-time"></i><span>审核中！</span></div>
        <div class="remind" style="color: green"  v-if="stateLicense===2"><i class="el-icon-circle-check-outline"></i><span>审核通过</span></div>
        <div class="remind" style="color: #fb6800"  v-if="stateLicense===3"><i class="el-icon-circle-close-outline"></i><span>审核未通过</span><span class="reason">原因*******************</span></div>
        <div  class="license-main">
            <div class="license-head-btn"  v-if="stateLicense===0||stateLicense===3">
              <el-button type="primary" @click="record">年审/变更记录</el-button>
              <el-button type="primary" @click="annualVerify">上传年审资料</el-button>
            </div>
            <div>
              <div class="license-num"><span class="title-content">营业执照号</span><span>{{licenseCard}}</span></div>
            </div>
            <div class="license-img">
              <viewer :images="licenseImg.split('')">
                <img class="vue-lazyload avatar" v-lazy="licenseImg" alt="" title="点击查看大图">
              </viewer>
            </div>
            <div class="date"><span class="title-content">成立日期</span><span>{{licenseCreateTime}}</span></div>
            <div class="date"><span class="title-content">有效期至</span><span>{{licenseValidTime}}</span></div>
        </div>
        <el-button class="license-btn" type="primary"  v-if="stateLicense!==1" @click="amend">修改</el-button>
      </div>





      <!--上传年审资料弹框-->
      <el-dialog
        title="新增年审记录"
        :visible.sync="isAnnualVerify"
        width="616px" class="isAnnualVerify-demo">

        <el-form  :model="annualVerifyInfor" :rules="rules" ref="annualVerifyInfor" class="demo-form" label-width="135px">

          <el-form-item label="年审时间" prop="date">
            <el-date-picker clearable style="width: 440px;" v-model="annualVerifyInfor.date" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>

          <el-form-item class="year-upload" label="年审营业执照副本" prop="imageUrl">
            <el-input v-model="annualVerifyInfor.imageUrl" v-if="false"></el-input>

            <CustomUpload :img="annualVerifyInfor.imageUrl"></CustomUpload>

          </el-form-item>

          <el-form-item class="form-btn">
            <div>
              <el-button type="primary" @click="annualVerifySure('annualVerifyInfor')">提交审核</el-button>
              <el-button @click="annualVerifyCancel('annualVerifyInfor')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--日期提醒-->

      <el-dialog
        :title="dateTitle"
        :visible.sync="dateRemind"
        width="30%"
        center>
        <div>您的营业执照<span v-if="deadline<1">已经到期</span><span v-if="deadline>0">还有{{deadline}}天到期</span>，请及时更新营业执照相关信息</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dateRemindBtn">{{dateRemindBtnContent}}</el-button>
        </span>
      </el-dialog>

    </div>


</template>

<script>
  import LicenseDeadline from '../../../../api/CompanyInfo/LicenseDeadline';
  import LicenseInfo from '../../../../api/CompanyInfo/LicenseInfo';
  import CustomUpload from '@/components/public/customUpload'
  import AddLicenseChangeAndAnnualExa from '../../../../api/CompanyInfo/AddLicenseChangeAndAnnualExa';
  export default {
    name: "stateRemind",
    data(){
      let imgPass=(rule, value, callback) => {
        if (this.annualVerifyInfor.imageUrl.imgArr.length > 0) {
          callback();
        } else {
          callback(new Error('请上传营业执照'));
        }
      };
      return{
        pageType:1,   //页面类型  0是承诺书  1是营业执照
        shopId:1,//商家id
        deadline:1,//证照到期时间

        licenseCard:'',//营业执照号
        licenseImg:'',//营业执照
        licenseCreateTime:'',//成立时间
        licenseValidTime:'',//有效期
        stateLicense:0,    //营业执照的状态  0到期提醒   1审核中  2审核通过   3审核未通过
        remark:'',//审核备注
        updateTIme:'',//更新时间

        isAnnualVerify:false,   //控制年审框
        annualVerifyInfor:{
          date:'',  //年审时间
          imageUrl:{ idName: 'qqq', limit: 1, imgArr: [] },  //上传的图片,  //上传的图片
        },
        rules:{
          date:[{ required: true, message: '请选择年审时间', trigger: 'blur' }],
          imageUrl:[{ required: true, validator: imgPass, trigger: 'change'}]
        },
        dateRemind:true,    //控制时间提醒框
        dateTitle:'营业执照到期提醒',
        dateRemindBtnContent:'修改',
        clientVersion: 1,
        clientTimespan: new Date().toLocaleString(),
        licenseId:'',
      }
    },
    methods:{
      //获取证件有效期
      licenseDeadline(){
        LicenseDeadline.call(this,'?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan)
          .then(
            res => {
              if (res.data.code === 1) {
                this.shopId = res.data.data[0].shopId;
                this.pageType = res.data.data[0].type;
                this.deadline = res.data.data[0].deadline;
              }
            }
          )
      },
      //营业执照信息
      licenseInfo(){
        LicenseInfo.call(this,'?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan)
          .then(
            res => {
              if (res.data.code === 1) {
                /*console.log(('------------------------------------------------------------'));
                console.log(res.data.data);*/
                this.licenseCard=res.data.data.licenseCard;
                this.licenseImg =res.data.data.licenseImg  ;
                this.licenseCreateTime =res.data.data.licenseCreateTime ;
                this.licenseValidTime =res.data.data.licenseValidTime ;
                this.remark =res.data.data.remark ;
                this.updateTIme  =res.data.data.updateTIme ;
                //this.stateLicense=0;
                this.licenseId=res.data.data.licenseCard+','+res.data.data.status;
                //状态为1时显示正在审核
                if(res.data.data.status ===0){
                  this.stateLicense=1;
                }
                //如果通过显示到期时间
                if(res.data.data.status ===1){
                  this.stateLicense=0;
                }
                //未通过直接显示未通过
                if(res.data.data.status ===2){
                  this.stateLicense=3;
                }
              }
            }
          )
      },

      //营业执照变更
      changeLog(type){
        if (this.stateLicense === 1) {
          this.$message.error('请等待审核完毕');
          this.isAnnualVerify = false;
          return;
        }
        /*if (type === 0) {
          if (this.licence.imgArr.length<1){
            return alert('图片为空');
          }
        }*/
        /*if (type === 1) {
          if (this.annualVerifyInfor.imageUrl.imgArr.length<1){
            return alert('图片为空');
          }
        }*/
        let model={
          type:type,
          licenseImg:this.annualVerifyInfor.imageUrl.imgArr[0],
          licenseCard:this.licenseNum,
          licenseCreateTime:this.licenseCreateTime,
          licenseValidTime:this.licenseValidTime,
          clientVersion: this.clientVersion,
          clientTimespan: this.clientTimespan,
          licenseAuditTime:this.annualVerifyInfor.date.toLocaleString(),
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
                this.$message.error(`${res.data.desc}`);
              }
            }
          )
      },
      //上传营业执照
      upLicense(){
        this.$router.push({name:'Amend'})
      },




      //年审/变更记录
      record(){
        this.$router.push({name:'AuditList'})
      },

      //年度审核
      annualVerify(){
        this.isAnnualVerify=true
      },
      annualVerifyCancel(formName){
        //console.log('取消')
        this.$refs[formName].resetFields();
        this.isAnnualVerify=false
      },
      annualVerifySure(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.changeLog(1);
            this.isAnnualVerify=false;
          }
        });
      },




      //日期提醒
      dateRemindBtn(){
        //console.log('日期提醒按钮')
        this.dateRemind=false
      },


      amend(){
        this.$router.push({name:'Amend',query:this.licenseId})
      },

    },
    created(){
      this.licenseDeadline();
      this.licenseInfo();
    },
    components: {
      // upload,
      CustomUpload
    },
    watch:{

    }
  }
</script>

<style lang="less" scoped>
  @import "less/stateRemind.less";
</style>
