<template>
  <!--申请平台介入-->
  <div class="container">
    <div class="line"></div>
    <div class="main">
      <!--评价信息-->
      <div class="evaluate">
        <div class="evaluate-title">评价信息</div>
        <ul class="evaluate-list" >
          <li><span>订 单 号</span>：<div class="evaluate-list-num">{{detail.orderNo}}</div></li>
          <li><span>订单商品</span>：<div class="evaluate-list-goods">{{detail.articleTitle}}</div></li>
          <li><span>评      价</span>：<div class="evaluate-grade"><i class="evaluate-grade-icon" :class="classType[detail.commentLevel]"></i><span>{{detail.commentLevelName}}</span></div></li>
          <li>
            <span>评价内容</span>：
            <div class="evaluate-content">
              <div class="evaluate-content-main">{{detail.commentContent }}</div>
              <ul class="evaluate-content-ul">
                <li v-if="imgSrc.length>0">
                  <viewer class="evaluate-content-img" :images="imgSrc">
                    <img class="vue-lazyload avatar" v-lazy="imgSrc[i]" alt="" title="点击查看大图">
                  </viewer>
                </li>
              </ul>
              <div class="evaluate-add" v-if="commentAgain.content != null">
                <div class="evaluate-add-title">【追 评】</div>
                <div class="evaluate-content-main">{{commentAgain.content}}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--申请原因和意愿-->
      <div class="reason">
        <div class="reason-title"><span>*</span>申请原因和意愿：</div>
        <el-input type="textarea" style="width: 800px;"  v-model="content" :autosize="{ minRows: 8}" resize="none" minlength="20"  maxlength="500" show-word-limit placeholder="20-500字，必填。请在这里说明您需要平台介入处理的原因以及您对处理的期！"></el-input>
      </div>
      <!--上传凭证-->
      <div class="evidence">
        <div class="evidence-title"><span>上传凭证：</span>商品实物图片，聊天记录截图，物流信息证明等截图，最多可上传5张图片</div>
       <ul class="evidence-ul">
            <CustomUpload :img="pic"></CustomUpload>
        </ul>
      </div>
      <!--按钮-->
      <div class="btn">
        <el-button type="primary" @click="submitCheck" :loading="isSubmitCheck">提交审核</el-button>
        <el-button type="info">返回</el-button>
      </div>

    </div>

    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

  import CustomUpload from '@/components/public/customUpload';
  import shopApplyPlatformInvolved from '@/api/client/shopApplyPlatformInvolved.js'  //商家pc申请平台介入


  export default {
    name: "platformIntervene",
    components: {
      CustomUpload
    },
    data(){
      return{
        detail:{},
        classType:['bad','bad','general','good','super'],      //评论等级变化的class名



        //不知道有没有用
        commentAgain:[],
        commentId:'',
        imgSrc:[],
        //


        content:'',
        dialogImageUrl: '',
        dialogVisible: false,
        pic: {
          idName: 'img', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 5, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        isSubmitCheck:false,
      }
    },
    mounted() {

    },
    methods: {


      //提交审核
      submitCheck(){
        this.isSubmitCheck = true;
        shopApplyPlatformInvolved.call(this,{
          orderNo:this.detail.orderNo,
          content:this.content,
          pic:this.pic.imgArr.join(','),
          clientTimespan:this.$Tool.formatDate(new Date())
        }).then(res=>{
          console.log('申请平台介入数据',res)
        })
      },



    },
    created() {
      this.detail = JSON.parse(this.$route.query.detail);

    }
  }
</script>

<style lang="less" scoped>
  @import "less/platformIntervene.less";
</style>
