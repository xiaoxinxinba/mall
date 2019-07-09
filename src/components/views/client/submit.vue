<template>
  <!--提交建议,提交举报-->
  <div class="container">
    <div class="type" v-if="pageType === 0">
      <span class="title"><i>*</i>建议类型：</span>
      <ul class="type-ul">
        <li v-for="(item,index) in typeListSuggest" :key="index" @click="submit.type=item;current=index;" :class="current===index?'choose':''" >{{item}}</li>
      </ul>
    </div>
    <div class="type"  v-if="pageType === 1">
      <span class="title"><i>*</i>举报类型：</span>
      <ul class="type-ul">
        <li v-for="(item,index) in typeListInform" :key="index" @click="submit.type=item;current=index;" :class="current===index?'choose':''" >{{item}}</li>
      </ul>
    </div>

    <div v-if="pageType === 1">
      <div class="inform-object inform">
        <span class="title">举报对象：</span>
        <div class="inform-right">
          <el-input v-model="submit.reportToObject" style="width: 416px;" placeholder="请输入要举报的用户名或店铺名称"></el-input>
        </div>
      </div>
      <div class="order inform">
        <span class="title">添加订单号：</span>
        <div class="inform-right">
          <el-input v-model="submit.orderNo" style="width: 416px;" placeholder="多个订单号的请用逗号隔开"></el-input>
        </div>
      </div>
      <div class="inform-remind">若举报涉及到订单问题，请务必添加订单号</div>
    </div>
    <div class="detail">
        <span class="title"><i>*</i>详细描述：</span>
        <div class="detail-textarea">
            <el-input type="textarea" style="width: 800px;" v-model="submit.describe" :autosize="{ minRows: 5}"  maxlength="300" show-word-limit resize="none" placeholder="请输入您的宝贵意见，您描述得越详细，我们能更好的改进，来为您提供更优质的服务；且您的意见建议一旦被平台采纳，还有额外的惊喜等着你哦~"></el-input>
            <div class="upload">
                <div>
                    <!--<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>-->
                    <CustomUpload :img="upload"></CustomUpload>
                </div>
            <span>{{upload.imgArr.length}}/5</span>
        </div>
        <div class="remind">{{pageType === 0 ? '图文并茂能更好的表达您的想法哦~' : '上传图片凭证能提升举报成功率哦~'}}</div>
        </div>
    </div>
    <div class="btn"><el-button type="primary" @click="submitData()">提交</el-button><el-button type="info" @click="back()">取消</el-button></div>
  </div>
</template>

<script>
import CustomUpload from '../../public/customUpload';
import SuggestPost from '../../../api/client/suggestPost';
import ReportPost from '../../../api/client/reportPost';
export default {
    name: "submit",
    data(){
        return {
            pageType: this.$route.query.pageType,     //0我要建议  1我要举报
            current:0,
            typeListSuggest:['使用功能','操作体验','满集服务','其他建议'],
            typeListInform:['反复退款','滥发信息','人身攻击','恶意抄袭','评论违规','其他举报'],
            detail:'',
            input:'',
            upload: { //图片上传
                idName: 'upload', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
                limit: 5, // 上传图片的最大限制个数
                imgArr: [], // 上传成功返回的数组，默认传空
            },
            submit: {
                msgFrom: 'PC',
                type: '',
                describe: '',
                orObject: '商家',
                orderNo: '', //订单号
                reportToObject: '' //被举报人/商家名称
            }
        }
    },
    mounted(){
        // 初始化类型值
        this.submit.type = this.pageType == 0 ? this.typeListSuggest[0] : this.typeListInform[0];
    },
    components: {
        CustomUpload
    },
    methods:{
        submitData: function(){
            if(this.pageType == 1) this.submitReportData();
            else if(this.pageType == 0) this.submitSuggestData();
        },
        submitSuggestData: function(){
            SuggestPost.call(this, {
                msgFrom: this.submit.msgFrom,
                suggestType: this.submit.type,
                describe: this.submit.describe,
                pics: this.upload.imgArr.join(','),
                orObject: this.submit.orObject,
                clientVersion: "1.0.0",
                clientTimespan: this.$Tool.formatDate(new Date())
            }).then(res => {
                if(res.data.code == 1){
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.back();
                }else{
                    this.$message.error('服务不可用，稍后再试');
                }
            })
        },
        submitReportData: function(){
            ReportPost.call(this, {
                msgFrom: this.submit.msgFrom,
                reportType: this.submit.type,
                reportToObject: this.submit.reportToObject,
                orderNo: this.submit.orderNo,
                describe: this.submit.describe,
                pics: this.upload.imgArr.join(','),
                orObject: this.submit.orObject,
                clientVersion: "1.0.0",
                clientTimespan: this.$Tool.formatDate(new Date())
            }).then(res => {
                if(res.data.code == 1){
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.back()
                }else{
                    this.$message.error('服务不可用，稍后再试');
                }
            })
        },
        back: function(){
            this.$router.go(-1);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    },
    created() {
      this.$route.meta.title=this.$route.query.pageType?'我要举报':'我要建议';
    }
}
</script>

<style lang="less" scoped>
@import "less/submit.less";
</style>
