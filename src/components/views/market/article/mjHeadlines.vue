<template>
  <div class="adticle_box">
    <div class="line"></div>
    <div class="mjHeadlines_box">
      <ul>
        <li>
          <div class="left">
            <span>
              <img src="https://picsum.photos/200/300" alt="">
            </span>
          </div>

          <div class="right">
            <div class="content">
              <h3>店铺爆款已经做了很久了，效果不错，但是全电流量提不上来怎么办？</h3>
              <p>现代社会已经有越来越多的人离不开手机了，最头疼的事儿莫过于手机电量告警，相信很多人为了避免这种担 忧都会随身携带大容量移动电源</p>
            </div>
            <div class="top">
              <span>满集网</span>
              <div>
                <span>2019/05/21</span>
                <span class="icon look">2222</span>
                <span class="icon zan">232</span>
                <span class="icon like">562</span>
              </div>
            </div>
          </div>
        </li>

        <li>
          <div class="left">
            <span>
              <img src="https://picsum.photos/200/300" alt="">
            </span>
          </div>

          <div class="right">
            <div class="content">
              <h3>店铺爆款已经做了很久了，效果不错，但是全电流量提不上来怎么办？</h3>
              <p>现代社会已经有越来越多的人离不开手机了，最头疼的事儿莫过于手机电量告警，相信很多人为了避免这种担 忧都会随身携带大容量移动电源</p>
            </div>
            <div class="top">
              <span>满集网</span>
              <div>
                <span>2019/05/21</span>
                <span class="icon look">2222</span>
                <span class="icon zan">232</span>
                <span class="icon like">562</span>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="btn">
        <el-button type="primary" @click="articleList(20)">加载更多</el-button>
      </div>

      <div class="btn_back">
        <el-button type="default" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ArticleList from '../../../../../src/api/article/ArticleList'
  export default {
    data () {
      return {
        currentPage: 1,
        clientVersion: '1',
        clientTimespan: new Date().toLocaleString(),
        tableData: [],
      }
    },
    methods: {
      //获取文章列表
      articleList(pageSize){
        ArticleList.call(this,'?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan + '&status='
          + this.state + '&pageIndex=' + this.currentPage + '&pageSize=' + pageSize)
          .then(
            res=>{
              this.tableData=[];
              if (res.data.code === 1) {
                /*console.log(('--------------------------列表数据--------------------------------------------------------'));
                console.log(res.data.data);*/
               // this.recordCount=res.data.data.recordCount;
                //有数据就绑定
                if (res.data.data.recordCount > 0) {
                  let table={};
                  for (let i = 0; i < res.data.data.data.length; i++) {
                    //已审核显示发布未发布，否则显示是否审核
                    let state;
                    res.data.data.data[i].status=1;
                    if (res.data.data.data[i].status===1){
                      state=this.publishList[res.data.data.data[i].isPublish];
                    }else {
                      state=this.stateList[res.data.data.data[i].status]
                    }
                    //res.data.data.data[i].articleId='123,2,28';
                    //商品id的数量就是推广数量
                    let extension;
                    if (res.data.data.data[i].articleId!==''){
                      extension = res.data.data.data[i].articleId.split(',').length+'个';
                    } else {
                      extension='未推广';
                    }
                    table={
                      sort:1+i,
                      id:res.data.data.data[i].id,
                      categary:this.categaryList[res.data.data.data[i].categoryId],
                      categaryId:res.data.data.data[i].categoryId,
                      title:res.data.data.data[i].title ,
                      pic:res.data.data.data[i].coverPicture  ,
                      articleId :res.data.data.data[i].articleId   ,
                      extension:extension ,
                      time:res.data.data.data[i].updateTime  ,
                      state:state  ,
                      //只有通过了审核才能进行其他操作，否则只能编辑
                      stateNum:res.data.data.data[i].status,
                      content :res.data.data.data[i].content  ,
                      remark :res.data.data.data[i].remark  ,
                      isPublish :res.data.data.data[i].isPublish  ,//0未发布、1发布 ,
                      addTime:res.data.data.data[i].addTime,
                      praiseCount :res.data.data.data[i].praiseCount ,
                      favoriteCount :res.data.data.data[i].favoriteCount ,
                      pageView :res.data.data.data[i].pageView ,
                    };
                    /*console.log(('----------------11111------------------------------------------------------------------'));
                    console.log(res.data.data.data[i].articleId);
                    console.log(res.data.data.data[i].articleId.split(','));*/
                    this.tableData.push(table);
                  }
                }
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
    created(){
      //alert(123);
      this.articleList(2);
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
