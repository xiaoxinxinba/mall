<template>
  <div class="adticle_box">
    <div class="line"></div>
    <div class="detail_box">
      <div class="top">
        <span>满集网</span>
        <div>
          <span><!--2019/05/21-->{{ruleForm.updateTime}}</span>
          <span class="icon look"><!--2222-->{{ruleForm.pageView}}</span>
          <span class="icon zan"><!--232-->{{ruleForm.praiseCount}}</span>
          <span class="icon like"><!--562-->{{ruleForm.favoriteCount}}</span>
        </div>
      </div>

      <div class="content">
        <h3><!--店铺爆款已经做了很久了，效果不错，但是全电流量提不上来怎么办？-->{{ruleForm.name}}</h3>
        <p><!--现代社会已经有越来越多的人离不开手机了，最头疼的事儿莫过于手机电量告警，相信很多人为了避免这种担 忧都会随身携带大容量移动电源-->{{ruleForm.content}}</p>
        <div class="img">
          <img :src="ruleForm.pic.imgArr[0]" alt="" />
          <!--<img src="https://picsum.photos/200/300" alt="" />-->
        </div>
      </div>

      <div class="btn">
        <el-button type="default" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import GetArticleDetails from '../../../../../src/api/article/GetArticleDetails'
  export default {
    data () {
      return {
        ruleForm: {
          id: 0,
          name: '',
          categary: '',
          pic: {idName: 'ttt', limit: 1, imgArr: []},
          content: '输入内容',
          articleId: '',
          categaryId: '',
          extension:'',
          updateTime:'',
          addTime:'',
          status:'',
          isPublish:'',
          praiseCount:'',
          favoriteCount:'',
          pageView:'',
          shopId:'',
        },
      }
    },
    methods: {

      //获取文章
      getArticleDetails(id) {
        GetArticleDetails.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan
          + '&articleId=' + id)
          .then(
            res => {
              if (res.data.code === 1) {
               /* console.log(('----------------传过来参数------------------------------------------------------------------'));
                console.log(res.data.data);*/
                this.ruleForm.id=res.data.data.id;
                this.ruleForm.categary=res.data.data.categoryId;
                this.ruleForm.name=res.data.data.title ;
                this.ruleForm.pic.imgArr.push(res.data.data.coverPicture ) ;
                this.ruleForm.articleId =res.data.data.articleId   ;
                //this.ruleForm.extension=extension ,
                this.ruleForm.updateTime=res.data.data.updateTime  ;
                this.ruleForm.addTime=res.data.data.addTime  ;
                this.ruleForm.status=res.data.data.status  ;
                //只有.ruleForm通过了审核才能进行其他操作，否则只能编辑
                //this.ruleForm.stateNum=res.data.data.status,
                let start = res.data.data.content.indexOf('<p>');
                let end = res.data.data.content.indexOf('</p>');
                this.ruleForm.content =res.data.data.content.substring(start+3,end)  ;
                this.ruleForm.remark =res.data.data.remark  ;
                this.ruleForm.isPublish =res.data.data.isPublish  ;//0未发布、1发布 ,
                this.ruleForm.praiseCount =res.data.data.praiseCount ;
                this.ruleForm.favoriteCount =res.data.data.favoriteCount;
                this.ruleForm.pageView =res.data.data.pageView ;
                this.ruleForm.shopId =res.data.data.shopId ;
              }
            }
          )
      },
      /**
       * 返回
       */
      goBack() {
        this.$router.go( -1 );
      }
    },
    created() {
      if (this.$route.query.id !== undefined) {
        this.getArticleDetails(this.$route.query.id);
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
