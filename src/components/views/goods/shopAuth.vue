<template>
  <div class="container">
    <div class="title"><span>你最近使用的类目：</span><span>{{type.join('>')}}</span></div>

    <div class="main" v-for="(item,index) in tableDataAlready" :class="index === 0?'none':''">
      <div class="upload-title"><span>当前类目资质认证需要上传：</span><span>{{item.title}}</span><span class="look-example" @click="lookExample(item.title)">查看证件示例</span></div>
      <div class="left">
        <div class="upload">
          <CustomUpload :img="item.imgInfo"></CustomUpload>
          <!--<el-upload-->
            <!--class="avatar-uploader"-->
            <!--action="https://jsonplaceholder.typicode.com/posts/"-->
            <!--:show-file-list="false"-->
            <!--:on-success="handleAvatarSuccess"-->
            <!--:before-upload="beforeAvatarUpload">-->
            <!--<img v-if="item.imgUrl" :src="item.imgUrl"  class="avatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</el-upload>-->
        </div>
        <div class="">
          <div class="input checked">
            <div class="input-title">证件有效期至：  </div><el-date-picker v-model="item.deadlineTime" type="date" placeholder="选择日期"></el-date-picker>
          </div>
          <div class="input-title "></div><el-checkbox v-model="item.isForever" :disabled="isChecked(item)">永久有效</el-checkbox>
        </div>
      </div>
      <div class="right">
        <div class="upload-remind"><i class="el-icon-warning"></i>如果暂无许可证，可延期上传，审核通过后可以正常经营</div>

        <div class="input">
          <div class="input-title">计划上传时间 :</div><el-date-picker v-model="item.commitmentTime" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div class="textarea">
          <div class="input-title">原因说明 :</div>
          <div class="textarea-main"><el-input type="textarea" :autosize="{ minRows: 4}" resize="none" placeholder="200字以内" maxlength=200 clearable v-model="item.rejectReason"></el-input></div>
        </div>
      </div>

    </div>


    <div class="foot-btn">
      <el-button type="primary" @click="SubmitCredentials">确认</el-button>
      <el-button >取消</el-button>
    </div>

    <!--查看证件示例-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogLook"
      width="520px"
      center>
      <div class="dialog-look">
        <img :src="lookSrc" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import CustomUpload from '@/components/public/customUpload';
  import shopCredentials from '../../../api/ShopBusinessScope/ShopCredentials';
  import ChangeShopCredential from '../../../api/ShopBusinessScope/ChangeShopCredential';
  export default {
    components:{
      CustomUpload
    },
    mounted () {

    },
    data () {
      return {
        categoryId: parseInt(this.$route.query.cateId),//当前选中分类
        type:[],//类目类型
        tableDataAlready: [],
        /*[
         {
           id: 29,//java证件Id
           title: "质检、检疫、检验报告",//证件名称
           isForever:false,//证件有效期 true=0:永久有效 false=1：临时有效
           deadlineTime: "2019-05-31",//证件有效日期
           imgUrl: "http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201905/28/bMovHwbGwh1.jpg",
           status: 1,//状态 0通过 1待审核 2未通过 3待上传 ,
           uploadType: 0,//0已上传1延迟上传
           commitmentTime: "",//延迟上传时间
           rejectReason: ""//延迟原因
         }
       ]*/
        submitData:[],//提交数据
        dialogLook:false,
        dialogTitle:'资质证件名称',
        lookSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/7shbd7QGHha.jpg',
      }
    },
    computed:{

    },
    methods:{
      //提交资质证件
      SubmitCredentials(){
        var _this=this;
        _this.submitData=[];
        var vResult=true;
        for(var item of _this.tableDataAlready){
          item.imgUrl = item.imgInfo.imgArr[0];
          if ((item.imgUrl == "" || item.imgUrl == null || typeof(item.imgUrl) == "undefined") && (item.commitmentTime == "" || item.commitmentTime == null || typeof(item.commitmentTime) == "undefined")) {
            _this.$message({
              showClose: true,
              message: '请选择上传' + item.title + '证件图片，或者选择延迟上传',
              type: 'error'
            });
            vResult=false;
            break;
          }
          if (item.commitmentTime != "" && item.commitmentTime != null && typeof(item.commitmentTime) != "undefined") {
            item.uploadType = 1;
          }
          if (item.imgUrl != "" && item.imgUrl != null && typeof(item.imgUrl) != "undefined") {
            item.uploadType = 0;
          }
          if (item.uploadType == 0) {
            if (item.imgUrl == "" || item.imgUrl == null || typeof(item.imgUrl) == "undefined") {
              _this.$message({
                showClose: true,
                message: '请上传' + item.title + '图片',
                type: 'error'
              });
              vResult=false;
              break;
            }
            if (item.isForever) {
              item.deadlineTime = '';
            } else if (item.isForever == false && (item.deadlineTime == "" || item.deadlineTime == null || typeof(item.deadlineTime) == "undefined")) {
              _this.$message({
                showClose: true,
                message: '请选择' + item.title + '截止时间',
                type: 'error'
              });
              vResult=false;
              break;
            }
          }
          if (item.uploadType == 1) {
            if (item.commitmentTime == "" || item.commitmentTime == null || typeof(item.commitmentTime) == "undefined") {
              _this.$message({
                showClose: true,
                message: '请选择' + item.title + '承诺上传时间',
                type: 'error'
              });
              vResult=false;
              break;
            }
            if (item.rejectReason == "" || item.rejectReason == null || typeof(item.rejectReason) == "undefined") {
              _this.$message({
                showClose: true,
                message: '请输入' + item.title + '延迟上传原因',
                type: 'error'
              });
              vResult=false;
              break;
            }
          }
          _this.submitData.push({
            title:item.title,
            image: item.imgUrl,
            id: item.id,
            uploadType:item.uploadType,
            deadlineTime: item.deadlineTime,
            commitmentTime: item.commitmentTime,
            saveCategoryCredentials: item.rejectReason,
            isForever: item.isForever
          });
        }
        if (_this.submitData!=null && _this.submitData.length>0 && vResult)
        {
          //提交数据
          console.log(JSON.stringify(_this.submitData),"提交数据");
          ChangeShopCredential.call(this,{
            credentials:_this.submitData,
            clientTimespan: new Date()
          }).then(res => {
            if (res.data.code === 1) {
              this.$message.success(res.data.desc);
            }else {
              this.$message.error(res.data.desc);
            }
          })
        }
      },
      //证件永久有效是否可选判断
      isChecked(itme) {
        if(itme.deadlineTime==="" ||itme.deadlineTime===null){
          itme.isForever =true;
          return false;
        }else{
          itme.isForever =false;
          return true;
        }
      },
      //查看证件示例
      lookExample(title){
        this.dialogTitle=title;
        this.dialogLook=true;
      },
      //图片上传
      handleAvatarSuccess(res, file) {
        this.imageSrc = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      }
    },
    created(){
      var _this = this;
      shopCredentials.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
        if(res.data.code===1){
          console.log(res);
          console.log("加载"+this.categoryId);
          for(let item of res.data.data)
          {
            if (item.cateId==this.categoryId)
            {
              this.type.push(item.cateTitle);
              console.log(this.tableDataAlready,"加载处理前");
              item.credentials.map(cds=>{
                cds.imgInfo={
                    idName: 'img'+cds.id, // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
                    limit: 1, // 上传图片的最大限制个数
                    imgArr: (cds.imgUrl==="" || cds.imgUrl==null)? []:[cds.imgUrl], // 上传成功返回的数组，默认传空
                }
                this.tableDataAlready.push(cds);
              });
              console.log(this.tableDataAlready,"加载处理前后");
              break;
            }
          }
        }else{
          this.$message.error(res.data.desc);
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  /*@import "./less/index.less";*/
  @import "less/shopAuth.less";
</style>
