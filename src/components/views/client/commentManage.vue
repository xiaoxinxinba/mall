<template>
  <!--评论管理-->
  <div class="container">
    <ul class="title-btn"><li>全部评论</li><li @click="sikp">问答列表</li></ul>
    <div class="line"></div>
    <div class="main">

      <div class="grade">
        <div class="grade-left"></div>
        <ul class="grade-list"><li>超赞：{{superAverage?superAverage:0}} </li><li>满意：{{satisfiedAverage?satisfiedAverage:0}} </li><li>一般：{{generalAverage?generalAverage:0 }}</li><li>较差：{{poorAverageAverage?poorAverageAverage:0}}</li></ul>
        <ul class="grade-list"><li>描述：<span>{{describeAverage?describeAverage:0}}</span> 分</li><li>包装：<span>{{packingAverage?packingAverage:0}}</span> 分</li><li>服务：<span>{{serviceAverage?serviceAverage:0}}</span> 分</li><li>物流：<span>{{logisticsAverage?logisticsAverage:0}}</span> 分</li></ul>
      </div>

      <div class="filtrate-btn"><el-button type="primary" @click="isFiltrate=!isFiltrate">筛选</el-button></div>
      <!--筛选-->
      <div class="filtrate" v-show="isFiltrate">
        <div class="filtrate-search"><span>订单编号：</span><el-input style="width: 170px;" v-model="orderNo" placeholder="请输入订单编号"></el-input></div>
        <div class="filtrate-search"><span>商品名称：</span><el-input style="width: 170px;" v-model="articleTitle" placeholder="请输入商品名称"></el-input></div>
        <div class="filtrate-search"><span>评论关键字：</span><el-input style="width: 170px;" v-model="commentKeyWord" placeholder="请输入评论关键字"></el-input></div>
        <div class="filtrate-search"><span>用户昵称：</span><el-input style="width: 170px;" v-model="userName" placeholder="请输入用户名称"></el-input></div>
        <div class="filtrate-search"><span>评论等级：</span><el-select style="width: 170px;" v-model="commentLevel" placeholder="请选择评论等级"><el-option v-for="item in commentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><span>回复状态：</span><el-select style="width: 170px;" v-model="replyState" placeholder="请选择审核状态"><el-option v-for="item in replyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><span>评论时间：</span>
          <el-date-picker
            v-model="timeDate"
            value-format='yyyy-MM-dd'
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="filtrate-search"><span>审核状态：</span><el-select style="width: 170px;" v-model="examineState" placeholder="请选择回复状态"><el-option v-for="item in checkOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
        <div class="filtrate-search"><el-button type="primary" @click="onsubmit">查询</el-button><el-button type="info" @click="chongzhi">重置</el-button></div>
      </div>
      <!--列表-->
      <div class="show" v-for=" (item,i) in tableData ">
        <div class="show-title">
          <span class="order-code">订单号: {{item.orderNo}} </span><span class="commentator">评论人：{{item.nickName}}</span><i class="chat"></i><span class="order-time">下单时间：{{item.orderDate }}</span>
          <div class="evaluate"><i :class="classType[item.commentLevel-1]"></i><span>{{item.commentLevelName}}</span></div>
          <ul class="grade-infor"><li>描述：<span>{{item.describe}}</span></li><li>包装：<span>{{item.packing}}</span></li><li>服务：<span>{{item.service}}</span></li><li>物流：<span>{{item.logistics }}</span></li></ul>
          <ul class="show-title-right">
            <li @click="orderDetails(item.orderNo,'goods')">查看订单</li>
           <!-- <li v-if="item.isAllowReply==0" @click="dialogReply=true,commentId=item.commentId">回复</li>-->
            <li @click="reply(item.commentId)">回复</li>
            <li v-if="item.isApplyIntervene === 1" @click="applyPlate(i)">申请平台介入</li>
          </ul>
        </div>
        <ul class="show-main">
          <li class="show-main-left">
            <div class="show-main-left-main">
              <img :src="item.articlePic" alt="">
              <div class="img-right">
                <p>{{item.articleTitle }}</p>
                <div>规格:{{item.articleSpecs }}</div>
              </div>
            </div>
          </li>
          <div class="show-main-line" style="left: 40%;"></div>
          <li class="show-main-middle">
            <div>
              <span class="show-main-middle-content">{{item.commentContent}}</span><div></div>
              <span>{{item.commentDate}}</span>
              <span class="look-infor" @click="dialogComment,lookCommentDetail(item.commentId)">查看评论详情</span>
              <div v-if="item.isIntervene ===1" class="intervene">已申请平台介入<span  class="look-infor" @click="platformIntervene(item.jobId)">查看介入详情</span></div>
            </div>
          </li>
          <div class="show-main-line" style="left: 80%"></div>
          <li class="show-main-right">
            <div>信誉分<span>{{item.creditScore}}</span></div>
          </li>
        </ul>
      </div>
      <div class="no_data" v-if="tableData.length === 0">暂无数据</div>

      <!--分页-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.totalCount">
        </el-pagination>
      </div>

      <!--评论详情弹框-->
      <el-dialog title="评论详情" :visible.sync="dialogComment" width="500px" >
        <div class="dialog-comment" v-model="CommentDetails">
          <div class="comment">
            <!--<div class="comment-title"><span class="time">{{CommentDetails.id}}</span></div>-->
            <div class="comment-title"><span class="time">{{CommentDetails.time}}</span></div>
            <div class="comment-main">{{CommentDetails.content}}</div>
            <ul class="comment-img" v-if="CommentDetails.imgs!==undefined&&CommentDetails.imgs.length>0">
              <li><img :src=CommentDetails.imgs ></li>
            </ul>
          </div>

          <div v-if="CommentDetails.replyInfo!=null">
            <div class="goods-reply">
              <span class="goods-reply-title">商家回复：</span>
              <div class="goods-reply-main">{{CommentDetails.replyInfo.content}}</div>
              <div class="goods-reply-time"><span class="time">{{CommentDetails.replyInfo.time}}</span></div>
            </div>
            <ul class="check">
              <li><span class="check-title">审核状态：</span><span class="state">{{CommentDetails.replyInfo.statusName}}</span></li>
              <li v-if="CommentDetails.replyInfo.status==2"><span class="check-title">未通过原因：</span><span>{{CommentDetails.replyInfo.reason}}</span></li>
              <li><span class="check-title">信誉分变化：</span><span>{{CommentDetails.replyInfo.creditScore}}</span></li>
              <div class="check-time"><span class="time">{{CommentDetails.replyInfo.auditTime}}</span></div>
            </ul>
          </div>

          <div class="add-comment" v-model="commentAgain" v-if="commentAgain.time !=null">
            <div class="comment-title"><span class="add-comment-left">追评</span><span class="time">{{commentAgain.time}}</span></div>
            <div class="comment-main">{{commentAgain.content}}</div>
            <ul class="comment-img">
              <li><img :src="commentAgain.imgs" alt=""></li>
            </ul>
          </div>
        </div>
      </el-dialog>

      <!--回复-->
      <el-dialog title="" :visible.sync="dialogReply" width="500px">
        <div class="dialog-reply">
          <div class="dialog-reply-title">回复评论：</div>
          <div class="dialog-reply-textarea">
            <el-input type="textarea" :autosize="{ minRows:8}" resize="none" maxlength="250" show-word-limit placeholder="请输入回复内容" v-model="commentReply">
            </el-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <div class="footer-btn">
            <el-button type="primary" @click="submitReply()">提交</el-button>
            <el-button @click="dialogReply = false">取消</el-button>
          </div>
        </div>
      </el-dialog>


    </div>
  </div>
</template>

<script>
  import getCommentDetails from '../../../api/client/getCommentDetails';    //获取商家具体商品评论信息
  import addGoodsCommentReply from '../../../api/client/addGoodsCommentReply';    //商家回复评论
  import orderCommentList from '../../../api/client/orderCommentList';    //获取商家订单评论分页列表(待完善)





  export default {
    name: "commentManage",
    data(){
      return{
        statisticScore:{},
        isFiltrate:false,   //筛选框是否显示
        orderNo: '',//订单编号
        articleTitle: '',//商品名称
        commentKeyWord:'',//评论关键字
        commentLevel:'',//评论等级
        replyState:'',//回复状态
        examineState:'',//审核状态
        userName:'',//用户名称
        timeDate:'',//时间
        options: [],
        commentOptions:[{value: -1, label: '全部等级评论'},{value: 5, label: '超赞'},{value: 4, label: '满意'},{value: 3, label: '一般'},{value: 2, label: '较差'},],
        replyOptions:[{value: -1, label: '全部回复状态'},{value: 1, label: '已回复'},{value: 0, label: '待回复'}],
        checkOptions:[{value: -1, label: '全部审核状态'},{value: 1, label: '已通过'},{value: 2, label: '未通过'},{value: 0, label: '待审核'}],
        classType:['bad','bad','general','good','super'],      //评论等级变化的class名
        imgSrc:'',
        dialogComment:false,
        dialogReply:false,
        commentReply:'',
        CommentDetails:[],
        tableData:[],
        Dettailstatus: '',
        pageSize: 5,
        pageIndex: 1,
        totalCount: 1,
        commentId:'',//
        superAverage:'',
        satisfiedAverage:'',
        generalAverage:'',
        poorAverageAverage:'',
        describeAverage:'',
        packingAverage :'',
        serviceAverage :'',
        logisticsAverage :'',
        commentAgain:[],
      }
    },
    computed:{

    },
    methods:{
      //定义日期转换函数
      dateToMs (date) {
        if(date!=null && date!=''){
          let d = new Date(date);
          let result=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
          return result;
        }else{
          return '';
        }
      },
      // 表单重置
      chongzhi(){
        this.orderNo = '';
        this.articleTitle = '';
        this.commentKeyWord = '';
        this.userName = '';
        this.commentLevel = -1;
        this.replyState = -1;
        this.timeDate = '';
        this.examineState = -1;
        this.pageSize = 5;
        this.pageIndex = 1;
        this.searchBtn();
       console.log(this.orderNo,this.articleTitle,this.commentKeyWord,this.commentLevel,this.replyState,this.examineState,this.userName,this.timeDate,)
      },
      sikp(){
        this.$router.push({name:'QuestionList'});
      },
      onsubmit(){
        this.searchBtn();
      },
      //搜索列表
      searchBtn(){
        this.timeDate = this.timeDate?this.timeDate:'';
        return new Promise((resolve)=>{
          orderCommentList.call(this,
            '?orderNo=' +this.orderNo+
            '&articleTitle='+this.articleTitle+
            '&commentKeyWord='+this.commentKeyWord+
            '&userName='+this.userName+
            '&commentLevel=' + this.commentLevel +
            '&replyState='+this.replyState+
            '&examineState=' + this.examineState +
            '&clientVersion=1.0.0'+
            '&startDate='+this.dateToMs(this.timeDate[0])+
            '&endDate='+this.dateToMs(this.timeDate[1])+
            '&pageSize=' +this.pageSize+
            '&pageIndex='+this.pageIndex+
            '&clientTimespan='+this.dateToMs(new Date())
          ).then(res => {
            console.log(res,'评论列表数据');
            if(res.data.code===1){
              this.tableData = res.data.data.orderCommentInfoModels;
              this.totalCount = res.data.data.recordCount;
              this.Dettailstatus = res.data.data.status;
              this.superAverage = res.data.data.superAverage;//超赞
              this.satisfiedAverage  = res.data.data.satisfiedAverage ;//满意
              this.generalAverage   = res.data.data.generalAverage ;//一般
              this.poorAverageAverage   = res.data.data.poorAverageAverage ;//较差
              this.describeAverage =  res.data.data.describeAverage;//描述平均分
              this.packingAverage    = res.data.data.packingAverage ;//包装平均分
              this.serviceAverage     = res.data.data.serviceAverage  ;//服务平均分
              this.logisticsAverage      = res.data.data.logisticsAverage   ;//物流平均分
              resolve(res.data.data);
            }
          })
        })

      },


      //查看订单
      orderDetails(orderNo,type){
        this.$router.push({path:'../OrderManage/Details',query:{ orderNo:orderNo,type:type }})
      },

      applyPlate(index){
        this.$router.push({name:'PlatformIntervene',query:{detail:JSON.stringify(this.tableData[index])}});
      },
      reply(id) {
        this.dialogReply=true;
        this.commentId=id;
        this.commentReply='';
      },

      //查看评论详情(参数调用端版本号clientVersion待传)
      lookCommentDetail(id){
        this.dialogComment=true;
        this.commentDetail(id);
      },
      commentDetail(id){
        getCommentDetails.call(this,'?commentId='+id+'&clientTimespan='+this.dateToMs(new Date()))
          .then(
            (res)=>{
              console.log(res,'评论详情数据');
              this.CommentDetails = res.data.data.comment;//评论信息
             this.commentAgain = res.data.data.commentAgain;//追评信息
              //  this.replyInfo = res.data.data.comment.replyInfo;
            }
          )
      },
      //回复
      submitReply(){
        addGoodsCommentReply.call(this,{
          commentId:this.commentId,
          content:this.commentReply,
          clientVersion:'1.0.0',
          clientTimespan:this.dateToMs(new Date()),
        })
          .then(
            (res)=>{
              if(res.data.code === 1){
                this.$message({
                  message:'回复成功',
                  type:'success'
                });
                this.dialogReply=false;
              }else{
                this.$message.error(res.data.desc);
              }
            }
          )
      },
      //平台介入详情
      platformIntervene(){
        this.$router.push({path:'client/interveneResult'})
      },

      handleSizeChange(val) {
        this.pageSize = val;
        this.searchBtn();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.searchBtn();
        console.log(`当前页: ${val}`);
      },



    },
    created(){
      this.commentLevel = this.commentOptions[0].value;
      this.replyState = this.replyOptions[0].value;
      this.examineState = this.checkOptions[0].value;
      this.searchBtn();
      // this.submitReply()
    },
  }
</script>

<style lang="less" scoped>
  @import "less/commentManage.less";

  .no_data{
    text-align: center;
    padding: 20px 0;
    color: #666;
    font-size: 16px;
  }

</style>
