<template>
  <div class="adticle_box">
    <div class="line"></div>
    <div class="main_box">
      <div class="top">
        <span v-for="item in stateOpera" @click="stateChange( item.type )" :class="state === item.type ? 'on' : ''">{{item.name}}</span>
      </div>

      <div class="btn">
        <el-button type="default" size="small" @click="goEdit">+ 新增文章</el-button>
        <el-button type="default" size="small" @click="goMjHeadlines">满集头条</el-button>
      </div>

      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            fixed
            prop="sort"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="title"
            label="文章标题"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="categary"
            label="文章分类"
            align="center">
          </el-table-column>
          <el-table-column
            prop="pic"
            label="封面图片"
            align="center">
            <template slot-scope="scope">
              <div class="table_pic">
                <span>
                  <img :src="scope.row.pic" alt="">
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="extension"
            label="商品推广"
            align="center">
          </el-table-column>
          <el-table-column
            prop="time"
            label="发布时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="260"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.stateNum===1">
                <el-button type="text" size="small" @click="Publish(scope.row)">{{publishList[scope.row.isPublish]}}</el-button>
              <!--<el-button type="text" size="small" @click="releaseVisible = true">发布</el-button>-->
              <el-button type="text" size="small" @click="goDetail(scope.row.id)">查看</el-button>
              </span>
              <el-button type="text" size="small" @click="goEdit(scope.row)">编辑</el-button>
              <span v-if="scope.row.stateNum===1">
              <el-button type="text" size="small" @click="deleteArticle(scope.row.id)">删除</el-button>
              <!--<el-dropdown>
                <span style="font-size: 12px; color: #3F9DFF; margin-left: 10px; display: inline-block; cursor: pointer;">
                  分享
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>微博</el-dropdown-item>
                  <el-dropdown-item>QQ</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>-->
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!--页码开始-->
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="recordCount">
          </el-pagination>
        </div>
        <!--页码结束-->
      </div>
    </div>

    <!--取消发布提示框 start-->
    <el-dialog
      title="取消发布提示"
      :visible.sync="cancleVisible"
      width="500px">
      <div class="dialog_box">
        <p>确定取消发布？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="cancleVisible = false">取消</el-button>
        <el-button type="primary" @click="publishOrCancel">确定</el-button>
      </span>
    </el-dialog>
    <!--取消发布提示框 end-->

    <!--发布提示框 start-->
    <el-dialog
      title="发布提示"
      :visible.sync="releaseVisible"
      width="500px">
      <div class="dialog_box">
        <p>确定发布？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="releaseVisible = false">取消</el-button>
        <el-button type="primary" @click="publishOrCancel">确定</el-button>
      </span>
    </el-dialog>
    <!--发布提示框 end-->

    <!--删除提示框 start-->
    <el-dialog
      title="删除提示"
      :visible.sync="deleteVisible"
      width="500px">
      <div class="dialog_box">
        <p>确定删除？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="deleteVisible = false">取消</el-button>
        <el-button type="primary" @click="isDelete">确定</el-button>
      </span>
    </el-dialog>
    <!--删除提示框 end-->

  </div>
</template>

<script>
  import ArticleList from '../../../../../src/api/article/ArticleList'
  import DeleteArticle from '../../../../../src/api/article/DeleteArticle'
  import PublishArticle from '../../../../../src/api/article/PublishArticle'
  import CancelPublishArticle from '../../../../../src/api/article/CancelPublishArticle'
  export default {
    mounted () {

    },
    data () {
      return {
        state: 0,
        stateOpera: [{
          name: '待审核',
          type: 0
        }, {
          name: '已审核',
          type: 1
        }, {
          name: '草稿箱',
          type: 2
        }],
        isDeleteId:'',
        tableData: [/*{
          sort: '1',
          title: '卫生纸怎么选',
          categary: '居家生活',
          pic: 'https://picsum.photos/200/300',
          extension: '2个',
          time: '2019-05-12 12:12:20',
          state: '已发布',
        }, {
          sort: '2',
          title: '卫生纸怎么选',
          categary: '居家生活',
          pic: 'https://picsum.photos/200/300',
          extension: '2个',
          time: '2019-05-12 12:12:20',
          state: '待审核',
        }*/],
        tempTableData:{},
        categaryList:['居家生活','手机数码','服装服饰'],
        stateList:['待审核','通过','未通过','草稿'],
        publishList:['发布','取消发布'],
        cancleVisible: false, // 取消发布提示框的显示变量
        releaseVisible: false, // 发布提示框的显示变量
        deleteVisible: false, // 删除提示框的显示变量
        currentPage: 1,
        pageSize: 10,
        recordCount: 44,
        clientVersion: '1',
        clientTimespan: new Date().toLocaleString(),
      }
    },
    methods: {
      //获取文章列表
      articleList(){
        ArticleList.call(this,'?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan + '&status='
          + this.state + '&pageIndex=' + this.currentPage + '&pageSize=' + this.pageSize)
          .then(
            res=>{
              this.tableData=[];
              if (res.data.code === 1) {
                /*console.log(('--------------------------列表数据--------------------------------------------------------'));
                console.log(res.data.data);*/
                this.recordCount=res.data.data.recordCount;
                //有数据就绑定
                if (res.data.data.recordCount > 0) {
                  let table={};
                  for (let i = 0; i < res.data.data.data.length; i++) {
                    //已审核显示发布未发布，否则显示是否审核
                    let state;
                    //res.data.data.data[i].status=1;
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

      //删除文章
      deleteArticle(id) {
        this.deleteVisible = true;
        this.isDeleteId=id;
      },
      isDelete(){
        this.deleteVisible = false;
          DeleteArticle.call(this, {
          articleId: this.isDeleteId,
          clientVersion: this.clientVersion,
          clientTimespan: this.clientTimespan,
        }).then(
          res => {
            if (res.data.code === 1) {
              this.$message.success('操作成功');
              this.articleList();
            }else {
              this.$message.success('操作失败');
            }
          }
        )
      },

      //发布或者取消发布
      Publish(tableData) {
        if (tableData.isPublish===0){
          this.releaseVisible= true;// 发布提示框的显示变量
        } else if (tableData.isPublish === 1) {
          this.cancleVisible= true; // 取消发布提示框的显示变量
        }
        this.tempTableData=tableData;
      },
      publishOrCancel(){
        if (this.tempTableData.isPublish===0){
          this.releaseVisible= false;
          PublishArticle.call(this, {
            articleId: this.tempTableData.id,
            clientVersion: this.clientVersion,
            clientTimespan: this.clientTimespan,
          }).then(
            res => {
              if (res.data.code === 1) {
                this.$message.success('发布成功');
                this.articleList();
              }else {
                this.$message.success('发布失败');
              }
            }
          )
        } else if (this.tempTableData.isPublish===1){
          this.cancleVisible= false;
          CancelPublishArticle.call(this, {
            articleId: this.tempTableData.id,
            clientVersion: this.clientVersion,
            clientTimespan: this.clientTimespan,
          }).then(
            res => {
              if (res.data.code === 1) {
                this.$message.success('取消发布成功');
                this.articleList();
              }else {
                this.$message.success('取消发布失败');
              }
            }
          )
        }
      },

      stateChange( type ) {
        this.state = type;
      },

      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage=val;
      },

      /**
       * 跳转到文章详情页面
       */
      goDetail(id) {
        this.$router.push({ name: 'ArticleDetail' ,query: {id: id}});
      },

      /**
       * 跳转到文章编辑页面
       */
      goEdit(tableData) {
        this.$router.push({ name: 'AddArticle' ,query: {tableId: tableData.id}});
      },

      goMjHeadlines() {
        this.$router.push({ name: 'MjHeadlines' });
      },
    },
    created(){
      //alert(123);
      this.articleList();
    },
    watch:{
      state:function (val) {
        this.articleList();
      },
      currentPage:function () {
        this.articleList();
      },
      pageSize:function () {
        this.articleList();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
