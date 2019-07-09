<template>
  <!--建议详情，举报详情-->
  <div class="container">
    <div class="state">{{detailData.sheetStatusStr}}</div>
    <div class="main">
      <div class="example" v-if="null != detailData.disposeTime">
        <span class="iconic-left last"><i></i></span><span class="time">{{detailData.disposeTime}}</span><span class="opinion">平台处理意见</span>
        <div class="example-right">
          <div class="opinion-content">{{detailData.disposeContent}}</div>
          <ul class="show-img" v-if="detailData.disposePics != ''">
            <viewer class="describe-ul-img">
              <li v-for="item in detailData.disposePics.split(',')" :key="item">
                  <img class="papers vue-lazyload avatar" v-lazy="item" alt="" title="点击查看大图">
              </li>
            </viewer>
          </ul>
        </div>
      </div>

      <div class="example">
        <span class="iconic-left before"><i></i></span><span class="time">{{detailData.submitTime}}</span><span class="opinion">{{pageType === 1 ? '提交举报' : '提交建议'}}</span>
        <div class="example-right none-border">
          <ul class="show-list" v-if="pageType===0">
            <li><span class="show-list-left">建议类型：</span><span class="show-list-right">{{detailData.type}}</span></li>
            <li><span class="show-list-left">建议详情：</span><span class="show-list-right">{{detailData.content}}</span></li>
          </ul>
          <ul class="show-list" v-if="pageType===1">
            <li><span class="show-list-left">举报类型：</span><span class="show-list-right">{{detailData.type}}</span></li>
            <li><span class="show-list-left">举报对象：</span><span class="show-list-right">{{detailData.reportObject}}</span></li>
            <li><span class="show-list-left">订单号：</span><span class="show-list-right">{{detailData.orderNo}}</span></li>
            <li><span class="show-list-left">举报详情：</span><span class="show-list-right">{{detailData.content}}</span></li>
          </ul>
          <ul class="show-img" v-if="detailData.submitPics != ''">
            <viewer class="describe-ul-img">
              <li v-for="item in detailData.submitPics.split(',')" :key="item">
                <img class="papers vue-lazyload avatar" v-lazy="item" alt="" title="点击查看大图">
              </li>
            </viewer>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ReportOrSuggestDetail from '../../../api/client/reportOrSuggestDetail';
export default {
    name: "suggestInformDetails",
    data(){
      return{
        pageType: this.$route.query.pageType,  //0建议详情  1举报详情
        //imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/7shbd7QGHha.jpg','http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/pgiv4AheV4e.jpg'],
        detailData: {
            content: null,
            disposeContent: null,
            disposePics: '',
            disposeTime: null,
            id: null,
            orNumber: null,
            orderNo: null,
            sheetStatusId: null,
            sheetStatusStr: null,
            submitPics: '',
            submitTime: null,
            type: null,
            reportObject: null,
        }
      }
    },
    mounted: function(){
        this.initData();
    },
    methods: {
        initData: function(){
            ReportOrSuggestDetail.call(this,
                '?sheetId=' + this.$route.query.sheetId +
                '&clientVersion=1.0.0' +
                '&clientTimespan=' + this.$Tool.formatDate(new Date())
            ).then(res => {
                if(res.data.code == 1){
                    this.detailData = res.data.data.suggesDetail;
                }else{
                    this.$router.go( -1 );
                    this.$message.error('查询失败');
                }
            })
        }
    },
    created() {
      this.$route.meta.title=this.$route.query.pageType?'我要建议':'我要举报';

    }
  }
</script>

<style lang="less" scoped>
@import "less/suggestInformDetails.less";
</style>
