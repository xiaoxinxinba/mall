<template>
  <!--交易纠纷详情-->
  <div class="container">

    <div class="left">
      <div class="left_top" v-model="disputeDetails">
        <div class="left_top_remind">
          <span>待处理</span>
          <span>剩余3天2小时15分，系统自动同意换货申请，请及时处理</span>
        </div>
        <div class="title"><span></span>换货详情</div>
        <div class="box">
          <!--换货详情-->
          <div class="details">
            <div class="details_left"><img :src="detailsImg" alt=""></div>
            <div class="details_right">
              <div class="details_goods">MISSILE米赛尔把套 山地车把套自行车 单车锁死橡胶把套特价包邮  *  2件</div>
              <div class="details_color">颜色分类:黑色<span class="look_more" @click="lookMoreDialogVisible = true">查看更多商品</span></div>
            </div>
          </div>
          <!--买家信息-->
          <div class="info">
            <ul class="info_list">
              <li><span class="reason_title info_list_title">买家</span><span>：</span><div class="reason_right info_right">小王子球球<span class="chat"><i></i>联系买家</span></div></li>
              <li><span class="reason_title info_list_title">订单号</span><span>：</span><div class="reason_right info_right">53019512109317318</div></li>
              <li><span class="reason_title info_list_title">退单号</span><span>：</span><div class="reason_right info_right">53019512109317318</div></li>
              <li><span class="reason_title info_list_title">下单时间</span><span>：</span><div class="reason_right info_right">2017-08-30 21:12:20</div></li>
              <li><span class="reason_title info_list_title">退单时间</span><span>：</span><div class="reason_right info_right">2017-08-30 21:12:20</div></li>
              <li><span class="reason_title info_list_title">退单类型</span><span>：</span><div class="reason_right info_right">退货退款<span class="look_flow">查看相关退单流程</span></div></li>
            </ul>
          </div>
          <!--原因-->
          <ul class="reason">
            <li><span class="reason_title getWidth">纠纷类型</span><span>：</span><div class="reason_right">发错货</div></li>
            <li><span class="reason_title">问题描述</span><span>：</span><div class="reason_right reason_explain">因为卖家服务态度恶劣，并且商品质量不好，我要申请退款，不再购买。</div></li>
            <li>
              <span class="reason_title">凭证</span><span>：</span>
              <ul class="reason_img">
                <viewer :images="detailsImg.split('')">
                  <li><img :src="detailsImg" alt=""></li>
                </viewer>
              </ul>
            </li>
            <li><span class="reason_title">联系人</span><span>：</span><div class="reason_right">珊珊</div></li>
            <li><span class="reason_title">联系电话</span><span>：</span><div class="reason_right">12345678911</div></li>

          </ul>
        </div>
      </div>

      <div class="left_bottom">
        <div class="title"><span></span>处理历史</div>
        <ul class="dispose_list">
          <li>
            <div class="dispose_title"><span class="icon_left"></span><span class="dispose_date">2016-08-01 11:09:59</span><div>换货成功</div></div>
            <ul class="dispose_content">
              <li></li>
            </ul>
          </li>
          <li>
            <div class="dispose_title"><span class="icon_left"></span><span class="dispose_date">2016-08-01 11:09:59</span><div>换货成功</div></div>
            <ul class="dispose_content">
              <li>卖家发出更换后的商品  物流公司：圆通快递</li>
              <li>卖家发出更换后的商品  物流公司：圆通快递</li>
            </ul>
          </li>
          <li>
            <div class="dispose_title"><span class="icon_left"></span><span class="dispose_date">2016-08-01 11:09:59</span><div>换货成功</div></div>
            <ul class="dispose_content">
              <li>卖家发出更换后的商品  物流公司：圆通快递</li>
              <li>卖家发出更换后的商品  物流公司：圆通快递</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <div class="right">
      <div class="seller">
        <div class="title"><span></span>{{pageType === '待处理'?'卖家处理':'平台处理结果'}}<span class="title_time" v-if="pageType === '处理完成'">2019-03-06   12:25:21</span></div>

        <ul class="seller_list">

          <!--提交举证按钮-->
          <li class="seller_content" v-if="pageType === '待处理'">
            <div class="seller_content_left"><i class="">1</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="buyer_address">
                  <div class="buyer_address_btn btn" style="margin-top: 0px;"><el-button type="primary" :disabled="isA.disabled" @click="aaa">提交举证</el-button></div>
                </div>
              </div>
            </div>
          </li>

          <!--平台处理结果-->
          <li class="seller_content" v-if="pageType === '处理完成'">
            <div class="seller_content_left"><i class="">1</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="dispose_result">
                  <div class="dispose_result_list"><span>处理结果 : </span>维持原判，商家同意给买家退款</div>
                  <div class="dispose_result_list"><span>说明 : </span>商品有质量问题</div>
                  <ul class="dispose_result_img">
                    <viewer :images="imgArr">
                      <li v-for="(item,index) in imgArr" :key="index"><img :src="item" alt=""></li>
                    </viewer>
                  </ul>

                </div>
              </div>
            </div>
          </li>



          <!--收货有问题-问题描述-->
          <li class="seller_content" v-if="isB.show">
            <div class="seller_content_left"><i class="">{{isB.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="receive_goods">
                  <div class="seller_title"><span>*</span>举证内容：</div>
                  <div class="receive_goods_textarea">
                    <el-input type="textarea"  v-model="receiveTextarea" maxlength="200" show-word-limit :autosize="{ minRows: 5}" resize="none" placeholder="请输入举证内容"></el-input>
                  </div>
                  <div class="receive_goods_img">
                    <div>
                      <CustomUpload :img="receiveChild"></CustomUpload>
                    </div>
                    <span><span>{{receiveChild.imgArr.length}}</span>/5</span>
                  </div>
                  <div class="buyer_address_btn btn"><el-button type="primary" :disabled="isB.disabled"  @click="bbb">确定</el-button><el-button @click="bbbCancel">取消</el-button></div>
                </div>
              </div>
            </div>
          </li>

          <!--处理记录-->
          <li class="seller_content" v-if="isC.show">
            <div class="seller_content_left"><i class="">{{isC.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="record">
                  <div class="seller_title">处理记录：</div>

                  <div class="record_main">
                    <div class="record_time">2019-03-06   12:25:21</div>
                    <div class="record_content">商品无质量问题，发货前已仔细检查</div>
                    <ul class="record_img_list">
                      <viewer :images="imgArr">
                        <li v-for="(item,index) in imgArr" :key="index"><img :src="item" alt=""></li>
                      </viewer>
                    </ul>
                  </div>
                  <div class="buyer_address_btn btn" style="margin-top: 10px;"><el-button type="primary" @click="ccc">继续举证</el-button></div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!--卖家处理进度条-->
        <ul class="seller_right">
          <li v-for="(item,index) in rightList" :key="index"><i></i>{{item}}</li>
        </ul>
      </div>

    </div>

    <!--查看更多商品-->

    <el-dialog title="提示" :visible.sync="lookMoreDialogVisible" width="560px"  class="dialog_refund">
      <div class="details details_none">
        <div class="details_left"><img :src="detailsImg" alt=""></div>
        <div class="details_right">
          <div class="details_goods">MISSILE米赛尔把套 山地车把套自行车 单车锁死橡胶把套特价包邮  *  2件</div>
          <div class="details_color">颜色分类:黑色</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary"  @click="lookMoreDialogVisible = false">确定</el-button>
          <el-button @click="lookMoreDialogVisible = false">取消</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import CustomUpload from '@/components/public/customUpload'
  import disputeDetails from '../../../api/client/disputeDetails';

  export default {
    name: "TradeDisputeDispose",
    components:{
      CustomUpload,
    },
    data(){
      return{
        parmeter: {
          sheetId: this.$route.query.sheetId,
          orderBackNum:this.$route.query.orderBackNum,
        },
        sheetId:'',
        orderBackNum:'',
        pageType:'待处理',  //待处理  处理完成
        isA:{show:true,disabled:false,step:1},   //提交举证
        isB:{show:false,disabled:false,step:2},   //举证内容
        isC:{show:false,disabled:false,step:2},   //处理记录
        isD:{show:false,disabled:false,step:2},    //卖家寄货
        detailsImg:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/fHommAZzcbc.jpg',
        receiveTextarea:'',  //收货有问题 问题描述
        receiveChild:{      //收货有问题 问题描述图片
          idName:'aaa',
          limit:5,
          imgArr:[],
        },
        imgArr:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/fHommAZzcbc.jpg','http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/pgiv4AheV4e.jpg',
          'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/7shbd7QGHha.jpg','http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],
        rightList:['提交举证'],
        lookMoreDialogVisible:false,   //查看更多商品
        disputeDetails:[],
        orderBackDetails:[],
        operationTypeLists:[],
      }
    },
    mounted(){
      this.initData();
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
      initData(){
        disputeDetails.call(this,`?sheetId=${this.parmeter.sheetId}&orderBackNum=${this.parmeter.orderBackNum}&clientTimespan=${this.dateToMs(new Date())}`)
          .then(
            (res)=>{
              console.log(res,'纠纷详情数据');
              this.disputeDetails= res.data.data.disputeDetails;//纠纷详情
              this.orderBackDetails=res.data.data.orderBackDetails;//换货详情
              this.operationTypeLists= res.data.data.operationTypeList;//处理历史
            }
          )
      },

      aaa() {
        this.isA.disabled=true;
        this.isB=Object.assign(this.isB,{show:true,disabled:false,step:2});
      },
      bbb() {
        this.isB.disabled=true;
        this.isC=Object.assign(this.isC,{show:true,disabled:false,step:3});
        this.isB.show=false;
      },
      bbbCancel() {
        this.isB.show=false;
        if(this.isC.show){
          return
        }
        this.isA.disabled=false;
      },
      ccc() {
        this.isB.show=true;
        this.isB.disabled=false;
      },

    },
    created() {

    },
  }
</script>

<style lang="less" scoped>
  @import "less/tradeDisputeDispose.less";
</style>
