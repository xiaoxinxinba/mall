<template>
  <!--问答列表-->
  <div class="container">
    <ul class="title-btn"><li  @click="sikp">全部评论</li><li>问答列表</li></ul>
    <div class="line"></div>
    <div class="main">
      <!--筛选-->
      <div class="filtrate">
        <div class="filtrate-search"><span>商品名称：</span><el-input style="width: 170px;" v-model="input" placeholder="请输入商品名称"></el-input></div>
        <div class="filtrate-search"><span>回复状态：</span><el-select style="width: 170px;" v-model="replyStatus" placeholder="请回复选择状态"><el-option v-for="item in replyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><span>审核状态：</span><el-select style="width: 170px;" v-model="auditStatus" placeholder="请选择审核状态"><el-option v-for="item in auditOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><span>提问时间：</span>
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="filtrate-search">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="info">重置</el-button>
        </div>
      </div>

      <!--列表-->
      <div class="table">
        <el-table :data="tableData" style="width: 100%" :border="true">
          <el-table-column label="id" width="100" v-if="false">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提问内容">
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.article_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提问时间">
            <template slot-scope="scope">
              <span>{{ scope.row.questionTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提问用户">
            <template slot-scope="scope">
              <span>{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="回复状态">
            <template slot-scope="scope">
              <span>{{scope.row.replyStatus === 1?'待回复':'已回复'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <span>{{ checkState(scope.row.auditStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <span class="operation" @click="handleReply(scope.row.id)">回复</span>
              <span class="operation" @click="handleLook(scope.row.id)">查看详情</span>
            </template>
          </el-table-column>
          <el-table-column label="信誉分">
            <template slot-scope="scope">
              <span>{{ scope.row.credit }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--分页-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :totalCount="this.totalCount">
        </el-pagination>
      </div>

    </div>

    <!--回复-->
    <el-dialog title="" :visible.sync="dialogReply" width="500px">
      <div class="dialog-reply">
        <div class="dialog-reply-title">回复评论：</div>
        <div class="dialog-reply-textarea">
          <el-input type="textarea" :autosize="{ minRows:8}" resize="none" maxlength="250" show-word-limit placeholder="请输入回复内容" v-model="replyInfo">
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="footer-btn">
          <el-button type="primary" @click="submitReply">提交</el-button>
          <el-button @click="dialogReply = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--提问详情-->
    <el-dialog title="" :visible.sync="dialogDetails" width="556px">
      <div class="details">
        <div class="dialog-question">
          <div class="dialog-title">提问详情：</div>
          <ul class="question-details details-list">
            <li><span>{{details.userName}}：</span><div>{{details.content}}</div></li>
            <li><span>商品信息：</span><div>{{details.article_name}}</div></li>
            <div class="time"><span>{{details.questionTime}}</span></div>
          </ul>
        </div>

        <div v-for="(item,i) in details.resultShopAnswerInfoModel">
          <div class="dialog-merchant-reply">
            <div class="dialog-title">商家回复：</div>
            <div class="merchant-reply">{{item.answerConten}}</div>
            <div class="time"><span>{{item.answerTime}}</span></div>
          </div>

          <div class="dialog-check-state">
            <div class="dialog-title">审核状态：</div>
            <div class="check-state">{{item.auditStatus}}</div>
            <ul class="details-list">
              <li><span>未通过原因：</span><div>{{item.auditRemark}}</div></li>
              <li><span>信誉分变化：</span><div>{{item.creditScore}}</div></li>
              <div class="time"><span>{{item.auditTime}}</span></div>
            </ul>
          </div>
          <div>
            <el-button type="warning" size="mini" @click="dialogReply = true, commentId = details.id">重新回复</el-button>
          </div>

        </div>

      </div>
    </el-dialog>

  </div>
</template>

<script>
  import getShopQuestList from '../../../api/client/getShopQuestList';      //获取列表
  import shopQuestionDetail from '../../../api/client/shopQuestionDetail';  //获取商家问答详情
  import AddArticleAnswer from '../../../api/client/AddArticleAnswer';  //添加商家回复问答

  export default {
    name: "questionList",
    data(){
      return{
        currentPage4:1,
        input:'',
        replyStatus:0,
        auditStatus:0,
        time: '',
        replyOptions: [{value: 0, label: '全部'}, {value: 1, label: '待回复'}, {value: 2, label: '已回复'}],
        auditOptions: [{value: 0, label: '全部'}, {value: 1, label: '待审核'}, {value: 2, label: '审核通过'}, {value: 3, label: '审核驳回'}],
        tableData: [],
        pageIndex : '',
        pageSize: '',
        totalCount: 1,
        dialogReply:false,
        replyInfo:'',
        dialogDetails:false,
        details:[],
        questionId:-1,
      }
    },
    methods:{
      checkState(val) {
        if(val === 1){
          return '待审核'
        }else if(val === 2){
          return '审核通过'
        }else if(val === 3){
          return '审核驳回'
        }
      },

      onSubmit(){
        this.searchBtn();
      },
      //查询问答列表
      searchBtn(){
        let beginTime='';
        let endTime='';
        this.time = this.time ? this.tiem : '';
        if(this.time !=='' && this.time.length>0){
          beginTime=this.$Tool.formatDate(this.time[0]);
          endTime=this.$Tool.formatDate(this.time[1]);
        }

        getShopQuestList.call(this,{
          articleIds:this.input,
          beginTime,
          endTime,
          replyStatus:this.replyStatus,
          auditStatus:this.auditStatus,
          clientTimespan:this.$Tool.formatDate(new Date()),
          pageIndex:1,
          pageSize:10
        })
          .then(
            (res)=>{
              if(res.data.code===1){
                console.log(res,'问答列表数据');
                this.tableData=res.data.data.resultShopQuestionListInfoModels;
              }
            }
          )
      },



      //查看详情(参数调用端版本号clientVersion待传)
      handleLook:async function(id){
        this.details = await this.detailsLook(id);
        this.dialogDetails = true;
      },
      detailsLook(id){
        return new Promise(resolve => {
          shopQuestionDetail.call(this,`?questionId=${id}&clientTimespan=${this.$Tool.formatDate(new Date())}`)
            .then(
              (res)=>{
                console.log('商家问答详情',res)
                if(res.data.code === 1){
                  resolve(res.data.data)
                }
              }
            )
        })
      },
      handleReply(id) {
        this.dialogReply = true;
        this.questionId = id;
      },
      //回复
      submitReply(){

        AddArticleAnswer.call(this,{
          questionId:this.questionId,
          user_role_type:'shop',
          answerContent:this.replyInfo,
          clientTimespan:this.$Tool.formatDate(new Date()),
        }).then(res=>{
          console.log('回复',res);
        })

        // this.dialogReply = false;

        // this.$message({
        //   message:'回复成功',
        //   type:'success'
        // });
      },

      sikp(){
        this.$router.push({name:'CommentManage'});
      },

      handleSizeChange(val) {
        this.pageSize=val;
        this.searchBtn();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.searchBtn();
        console.log(`当前页: ${val}`);
      }
    },
    created(){

      this.searchBtn();
    }
  }
</script>

<style lang="less" scoped>
  @import "less/questionList.less";
</style>
