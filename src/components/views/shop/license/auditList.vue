<template>
  <div class="box">
    <ul class="title">
      <li v-for="(item,index) in title" :key="index" @click="changeChoice(item)">{{item}}</li>
    </ul>
    <div class="ribbon"></div>
    <div class="audit">
      <el-table
        :data="showData"
        style="width: 100%;text-align: center" border>
        <el-table-column
          label="序号"
          width="86">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="变更时间"
          width="262">
          <template slot-scope="scope">
            <span>{{ scope.row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="营业执照号"
          width="262">
          <template slot-scope="scope">
            <span>{{ scope.row.licenseNum}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="年审营业执照副本"
          width="262">
          <template slot-scope="scope">
            <img class="license-img" :src="scope.row.licenseSrc" alt="">
          </template>
        </el-table-column>

        <el-table-column
          label="审核状态"
          width="262">
          <template slot-scope="scope">
            <span :class="scope.row.auditState===1?'pass':'nopass'">{{statusList[scope.row.auditState]}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="审核备注"
          width="262">
          <template slot-scope="scope">
            <span>{{scope.row.auditRemark}}</span>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="152">
          <template slot-scope="scope" v-if="scope.row.id===1">
            <el-button
              size="mini"
              @click="auditAmend(scope.$index, scope.row)">修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="auditCurrentPage"
            :page-sizes="auditPageSizes"
            :page-size="auditPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="auditTotal">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-button class="foot-btn" type="info" @click="back">返回</el-button>


    <!--年审弹框-->
    <!--<el-dialog-->
      <!--title="年审提醒"-->
      <!--:visible.sync="centerDialogVisible"-->
      <!--width="30%"-->
      <!--center>-->
      <!--<span>请在6月30日之前完成营业执照的年审，并上传年审资料到满集网平台上。</span>-->
      <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="auditSure">上传年审资料</el-button>-->
  <!--</span>-->
    <!--</el-dialog>-->


    <!--上传年审资料弹框-->
    <div class="check">
      <el-dialog
        title="新增年审记录"
        :visible.sync="isAnnualVerify"
        width="615px"
        class="isAnnualVerify-demo">

        <el-form :model="annualVerifyInfor" :rules="rules" ref="annualVerifyInfor" class="demo-form" label-width="135px">

          <el-form-item label="年审时间" prop="date">
            <el-date-picker
              style="width: 440px"
              clearable
              v-model="annualVerifyInfor.date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="到期时间" prop="endDate">
            <el-date-picker
              style="width: 440px"
              clearable
              v-model="annualVerifyInfor.endDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item class="year-upload" label="年审营业执照副本" prop="imageUrl">
            <el-input v-model="annualVerifyInfor.imageUrl" v-if="false"></el-input>

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
  import LicenseAnnualExamination from '../../../../api/CompanyInfo/LicenseAnnualExamination';
  import CustomUpload from '@/components/public/customUpload'
  import AddLicenseChangeAndAnnualExa from '../../../../api/CompanyInfo/AddLicenseChangeAndAnnualExa';
  export default {
    name: "auditList",
    beforeRouteEnter(to, from, next) {
      console.log('to', to)
      console.log('from', from)

      next(
        (vm) => {
          vm.backRouter = from.name
        }
      )
    },
    data() {
      let imgPass=(rule, value, callback) => {
        if (this.annualVerifyInfor.imageUrl.imgArr.length > 0) {
          callback();
        } else {
          callback(new Error('请上传营业执照'));
        }
      };
      return {
        title: ['年审记录', '变更记录'],
        auditTableData: [/*{
          id: 1,
          date: '2016-05-02',
          licenseNum: 'PJHEHHNE7465683839JHHJKJJD',
          licenseSrc: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
          auditState: '未通过',
          auditRemark: '照片模糊',
        },
          {
            id: 2,
            date: '2016-05-04',
            licenseNum: 'PJHEHHNE7465683839JHHJKJJD',
            licenseSrc: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
            auditState: '已通过',
            auditRemark: '照片模糊',
          },
          {
            id: 3,
            date: '2016-05-01',
            licenseNum: 'PJHEHHNE7465683839JHHJKJJD',
            licenseSrc: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
            auditState: '未通过',
            auditRemark: '照片模糊',
          },
          {
            id: 4,
            date: '2016-05-03',
            licenseNum: 'PJHEHHNE7465683839JHHJKJJD',
            licenseSrc: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
            auditState: '已通过',
            auditRemark: '照片模糊',
          }*/],
        statusList:['待审核','审核通过','审核未通过'],
        auditPageSizes: [1, 2, 3, 4],
        auditPageSize: 4,    //初始化时每页几条
        auditCurrentPage: 1,
        auditSize: 4,      //每页几条
        auditCurrent: 1,   //第几页

        centerDialogVisible: true,  //控制年审框

        isAnnualVerify: true,   //控制年审上传框
        annualVerifyInfor: {
          date: '',  //年审时间
          endDate:'', //到期时间
          imageUrl: { idName: 'qqq', limit: 1, imgArr: [] },  //上传的图片
        },
        rules: {
          date: [{required: true, message: '请选择年审时间', trigger: 'blur'}],
          endDate: [{required: true, message: '请选择到期时间', trigger: 'blur'}],
          imageUrl:[{ required: true, validator: imgPass, trigger: 'change'}]

        },
        backRouter: '',   //返回的路由
        clientVersion: 1,
        clientTimespan: new Date().toLocaleString(),
        num:'',
        status:'',
      };
    },
    computed: {
      auditTotal() {
        return this.auditTableData.length
      },
      showData() {
        let start = (this.auditCurrent - 1) * this.auditSize
        let end = start + this.auditSize
        return this.auditTableData.filter((item, index) => {
          if (index >= start && index < end) {
            return item
          }
        })
      }
    },
    methods: {
      //营业执照变更
      changeLog(type){
        //alert('执行方法');
        if (this.status === 0) {
          this.$message.error('请等待审核完毕');
          this.isAnnualVerify = false;
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
        let licenseValidTime = '';
        if (this.annualVerifyInfor.endDate !== '') {
          licenseValidTime = this.annualVerifyInfor.endDate.toLocaleString();
        }
        let licenseAuditTime = '';
        if (this.annualVerifyInfor.date !== '') {
          licenseAuditTime = this.annualVerifyInfor.date.toLocaleString();
        }

        let model={
          type:type,
          licenseImg:this.annualVerifyInfor.imageUrl.imgArr[0],
          licenseCard:this.num,
          licenseCreateTime:this.clientTimespan,
          licenseValidTime:licenseValidTime,
          clientVersion: this.clientVersion,
          clientTimespan: this.clientTimespan,
          licenseAuditTime:licenseAuditTime,
        };
        AddLicenseChangeAndAnnualExa.call(this,model)
          .then(
            res=>{
              if (res.data.code === 1) {
                /*console.log(('-----------------变更营业执照和年审记录---------------------------------------'));
                console.log(res.data.data);*/
                this.$message({
                  message:'提交成功，请耐心等待平台审核',
                });
                this.isAnnualVerify = false;
                this.licenseAnnualExamination();
              }else {
                  this.$message.error(res.data.desc);
              }
            }
          )
      },
      changeChoice(name) {
        if (name === '变更记录') {
          console.log('跳转')
          this.$router.push({name: 'ChangeList', query: {backRouter: this.backRouter}})
        }
      },
      auditAmend(index, row) {
        this.isAnnualVerify = true
        this.num=row.licenseNum;
        this.status=row.auditState;
        //alert(row.licenseNum)
        //console.log(index, row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.auditSize = val;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.auditCurrent = val;
      },

      auditSure() {
        this.centerDialogVisible = false;
        this.isAnnualVerify = true
      },
      back() {
        console.log(this.backRouter)
        this.$router.push({name: this.backRouter})
      },


      //年度审核
      annualVerify() {
        this.isAnnualVerify = true
      },
      annualVerifyCancel(formName) {
        //console.log('取消')
        this.$refs[formName].resetFields();
        this.isAnnualVerify = false
      },
      annualVerifySure(formName) {
        // this.isAnnualVerify=false
       this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            this.$message({
              message: '提交成功，请耐心等待平台审核',
              type: 'success'
            });
            this.isAnnualVerify = false;
            this.changeLog(1);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //年审图片上传
      handleCheckSuccess(res, file) {
        this.annualVerifyInfor.imageUrl = URL.createObjectURL(file.raw);
        //console.log(this.annualVerifyInfor.imageUrl)
      },
      beforeCheckUpload(file) {
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
      },
      //获取年审记录
      licenseAnnualExamination() {
        LicenseAnnualExamination.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan)
          .then(
            res => {
              if (res.data.code === 1) {
                for (let i = 0; i < res.data.data.length; i++) {
                  this.auditTableData.push({
                    id:i+1,
                    date:res.data.data[i].licenseAuditTime,
                    licenseSrc:res.data.data[i].licenseImg ,
                    licenseNum:res.data.data[i].licenseCard  ,
                    auditRemark:res.data.data[i].remark    ,
                    auditState:res.data.data[i].status     ,
                  });
                }
                //console.log(('---------------------年审记录列表--------------------------------------------------------------------------------'));
               // console.log(res.data.data);
                this.num=res.data.data[0].licenseCard;
                this.status=res.data.data[0].status;
              }else {
                this.$message.error('获取年审记录失败');
              }
            }
          )
      },
    },
    created(){
      this.licenseAnnualExamination();
    },
    components: {
      // upload,
      CustomUpload
    },
    watch: {
      'child.idname'(val) {
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "less/auditList.less";
</style>
