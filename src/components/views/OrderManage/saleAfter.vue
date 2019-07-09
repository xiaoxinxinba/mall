<template>
  <!--换货同意-->
  <div class="container sale_after" v-show="allData">

    <div class="left">
      <div class="left_top" id="aabc"  ref="leftTop">
        <div class="left_top_remind">
          <span>{{allData&&allData.processStatusText}}</span>
          <span>{{allData&&allData.lastTaskAt}}</span>
        </div>
        <div class="title"><span></span>{{pageType}}详情</div>
        <div class="box">
          <!--换货详情-->
          <div class="details">
            <div class="details_left"><img :src="allData&&allData.goods[0].img" alt="" ></div>
            <div class="details_right">
              <div class="details_goods">{{allData&&allData.goods[0].title}}</div>
              <div class="details_color">{{allData&&allData.goods[0].spec}}<span v-if="allData&&allData.goods.length>1" class="look_more" @click="lookMoreDialogVisible = true">查看更多商品</span></div>
            </div>
          </div>
          <!--买家信息-->
          <div class="info">
            <div class="info_title">买家信息</div>
            <ul class="info_list">
              <li><span class="reason_title info_list_title">买家</span><span>：</span><div class="reason_right info_right">{{allData&&allData.buyer.name}}<span class="chat" @click="chat"><i></i>联系买家</span></div></li>
              <li><span class="reason_title info_list_title">订单编号</span><span>：</span><div class="reason_right info_right">{{allData&&allData.orderNo}}</div></li>
              <li><span class="reason_title info_list_title">下单时间</span><span>：</span><div class="reason_right info_right">{{allData&&allData.createOrderAt}}</div></li>
            </ul>
          </div>
          <!--原因-->
          <ul class="reason">
            <li><span class="reason_title getWidth">{{pageType}}原因</span><span>：</span><div class="reason_right">{{allData&&allData.backReason}}</div></li>
            <li  v-show="pageType === '退款'||pageType === '退货退款'"><span class="reason_title" :style="`width:${leftWidth}px`">物流状态</span><span>：</span><div class="reason_right" :style="`width:calc(100% - ${leftWidth+14}px)`">已收到货</div></li>

            <li><span class="reason_title" :style="`width:${leftWidth}px`">{{pageType}}数量</span><span>：</span><div class="reason_right" :style="`width:calc(100% - ${leftWidth+14}px)`">{{allData&&allData.backQuantity}}</div></li>
            <!--<li><span class="reason_title">原因</span><span>：</span><div class="reason_right">多拍/拍错/不想要</div></li>-->
            <li v-show="pageType === '退货退款'"><span class="reason_title "  :style="`width:${leftWidth}px`">退货运费金额</span><span>：</span><div class="reason_right" :style="`width:calc(100% - ${leftWidth+14}px)`">¥{{allData&&allData.backFreightFee}}</div></li>
            <li v-show="pageType === '退款'|| pageType === '退货退款'"><span class="reason_title" :style="`width:${leftWidth}px`">退款金额</span><span>：</span><div class="reason_right" :style="`width:calc(100% - ${leftWidth+14}px)`">¥{{allData&&allData.backMoney}}</div></li>
            <li><span class="reason_title" :style="`width:${leftWidth}px`" >{{pageType}}说明</span><span>：</span><div class="reason_right reason_explain" :style="`width:calc(100% - ${leftWidth+14}px)`">{{(allData&&allData.backRemark) === ''?'--':allData.backRemark}}</div></li>
            <li>
              <span class="reason_title"  :style="`width:${leftWidth}px`">{{pageType}}凭证</span><span>：</span><span v-if="allData && allData.backPics.length ===0 ">--</span>
              <ul class="reason_img" v-else>
                <viewer :images="allData.backPics">
                  <li v-for="(item,index) in allData.backPics" :key="index"><img :src="item" alt="" ></li>
                </viewer>
              </ul>
            </li>
            <li>
              <span class="reason_title" :style="`width:${leftWidth}px`">买家留言</span><span>：</span><span v-if="!(allData && allData.backRemark)">--</span>
              <div v-else class="reason_leave_word"><div>{{allData && allData.backRemark}}</div><span>{{allData && allData.createAt}}</span></div>
            </li>
          </ul>
        </div>
      </div>

      <div class="left_bottom" :style="`min-height:calc(100vh - ${this.leftHeight+205}px)`">
        <div class="title"><span></span>处理历史</div>
        <ul class="dispose_list">
          <li v-for="(item,index) in operationLog" :key="index">
            <div class="dispose_title"><span class="icon_left"></span><span class="dispose_date">{{item.date}}</span><div>{{item.statusText}}</div></div>
            <ul class="dispose_content">
              <li>{{item.content}}</li>
            </ul>
          </li>


          <!--<li>-->
            <!--<div class="dispose_title"><span class="icon_left"></span><span class="dispose_date">2016-08-01 11:09:59</span><div>换货成功</div></div>-->
            <!--<ul class="dispose_content">-->
              <!--<li>卖家发出更换后的商品  物流公司：圆通快递</li>-->
              <!--<li>卖家发出更换后的商品  物流公司：圆通快递</li>-->
            <!--</ul>-->
          <!--</li>-->
          <!--<li>-->
            <!--<div class="dispose_title"><span class="icon_left"></span><span class="dispose_date">2016-08-01 11:09:59</span><div>换货成功</div></div>-->
            <!--<ul class="dispose_content">-->
              <!--<li>卖家发出更换后的商品  物流公司：圆通快递</li>-->
              <!--<li>卖家发出更换后的商品  物流公司：圆通快递</li>-->
            <!--</ul>-->
          <!--</li>-->


        </ul>
      </div>
    </div>

    <div class="right">
      <div class="seller">
        <div class="title"><span></span>卖家处理</div>

        <ul class="seller_right">
          <li v-for="(item,index) in rightList" :key="index"><i></i>{{item}}</li>
        </ul>

        <!--卖家处理进度条-->
        <ul class="seller_list">
          <!--是否同意换货-->
          <li class="seller_content" v-if="isA.show">
            <div class="seller_content_left"><i class="">1</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="exchange_goods">
                  <div class="seller_title">是否同意{{pageType}}：</div>
                  <div class="exchange_goods_radio"><el-radio v-model="isRadio" :disabled="isA.disabled" label="0">同意</el-radio><el-radio v-model="isRadio" :disabled="isA.disabled" label="1">不同意</el-radio></div>
                  <div class="exchange_goods_btn btn"><el-button type="primary" :disabled="isA.disabled" @click="aaa">确定</el-button></div>
                </div>
              </div>
            </div>
          </li>

          <!--买家寄货地址-->
          <li class="seller_content" v-if="isB.show">
            <div class="seller_content_left"><i class="">{{isB.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="buyer_address receive_goods">
                  <div class="seller_title">{{pageType === '维修'?'维修地址':'买家寄货地址'}} <span class="seller_title_remind" style="color: #ff6600;margin-left: 10px;" v-if="pageType === '维修'">请填写维修地址，用户可寄送维修，也可自行到店维修</span></div>
                  <div class="buyer_name">{{sellerAddr.consignee}} ， {{sellerAddr.mobile}}，<span @click="dialog.dialogVisible = true">更换收货地址</span></div>
                  <div class="buyer_address_details">{{sellerAddr.address}}，{{sellerAddr.postCode}} </div>
                  <div class="buyer_sales_explain"><span>退货说明：</span><div class=""><el-input type="textarea"  v-model="returnsRemark" :autosize="{ minRows: 1}" resize="none" placeholder="请输入退货说明"></el-input></div></div>
                  <div class="buyer_address_btn btn"><el-button type="primary"  :disabled="isB.disabled" @click="isAgreeReturn">确定</el-button></div>
                </div>
              </div>
            </div>
          </li>

          <!--是否确认收到买家寄回商品-->
          <li class="seller_content"  v-if="isC.show">
            <div class="seller_content_left"><i class="">{{isC.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="send_goods">
                  <div class="seller_title">是否确认收到买家寄回商品</div>
                  <div class="send_radio"><el-radio v-model="sendRadio" :disabled="isC.disabled" label="0">确认</el-radio><el-radio v-model="sendRadio" :disabled="isC.disabled" label="1">收货有问题</el-radio></div>
                  <div class="buyer_address_btn btn"><el-button type="primary" :disabled="isC.disabled"  @click="ccc">确定</el-button></div>
                </div>
              </div>
            </div>
          </li>

          <!--添加维修记录按钮-->
          <li class="seller_content" v-if="isH.show">
            <div class="seller_content_left"><i class="">{{isH.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="buyer_address">
                  <div class="buyer_address_btn btn" style="margin-top: 0px;"><el-button type="primary" :disabled="isH.disabled" @click="hhh">添加维修记录</el-button></div>
                </div>
              </div>
            </div>
          </li>


          <!--收货有问题-问题描述-->
          <li class="seller_content" v-if="isE.show">
            <div class="seller_content_left"><i class="">{{isE.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="receive_goods">
                  <div class="seller_title"><span>*</span>{{remind&&remind.reasonTitle}}：<span class="seller_title_remind">{{remind&&remind.reasonRemind}}</span></div>
                  <div class="receive_goods_textarea">
                    <el-input type="textarea"  v-model="reasonExplain" maxlength="200" show-word-limit :autosize="{ minRows: 5}" resize="none" :placeholder="remind&&remind.placeholder"></el-input>
                  </div>
                  <div class="receive_goods_img">
                    <div>
                      <CustomUpload :img="uploadImg"></CustomUpload>
                    </div>
                    <span><span>{{uploadImg.imgArr.length}}</span>/5</span>
                  </div>
                  <div class="buyer_address_btn btn"><el-button type="primary"  :disabled="isE.disabled" @click="eee">确定</el-button><el-button :disabled="isE.disabled" @click="eeeCancel">取消</el-button></div>
                </div>
              </div>
            </div>
          </li>

          <!--收货有问题-平台介入处理-->
          <li class="seller_content" v-if="isF.show">
            <div class="seller_content_left"><i class="">{{isF.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="platform_dispose">
                  <div class="seller_title">{{remind&&remind.disputeTitle}}-平台介入处理</div>
                  <div class="buyer_address_btn btn"><el-button type="primary" :disabled="isF.disabled" @click="fff">查看纠纷详情</el-button></div>
                </div>
              </div>
            </div>
          </li>


          <!--卖家寄货-->
          <li class="seller_content" v-if="isD.show">
            <div class="seller_content_left"><i class="">{{isD.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="goods_send">
                  <div class="seller_title">卖家寄货</div>
                  <div class="goods_send_list">
                    <div class="goods_send_item"><span class="goods_send_title">寄送方式：</span><el-radio v-model="sendWayRadio" label="0">快递物流</el-radio><el-radio v-model="sendWayRadio" label="1">商家自送</el-radio></div>
                    <div v-show="sendWayRadio==='0'">
                      <el-form :model="ruleFormLogistics" :rules="rulesLogistics" ref="ruleFormLogistics" label-width="82px" class="demo-ruleForm-logistics">
                        <el-form-item label="物流公司：" prop="sendCompany">
                          <el-select style="max-width: 416px;" v-model="ruleFormLogistics.sendCompany" placeholder="请选择物流公司"><el-option v-for="item in expressList" :key="item.id" :label="item.title" :value="item.id"></el-option></el-select>
                        </el-form-item>
                        <el-form-item label="快递单号：" prop="sendPostCode">
                          <el-input style="max-width: 416px;" v-model="ruleFormLogistics.sendPostCode" @keyup.native="numRule('ruleFormLogistics','sendPostCode')" placeholder="请输入快递单号"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    <div class="goods_send_self"  v-show="sendWayRadio==='1'">
                      <el-form :model="ruleFormSend" :rules="rulesSend" ref="ruleFormSend" label-width="120px" class="demo-ruleForm-send">
                        <el-form-item label="联系电话：" prop="phone">
                          <el-input style="max-width: 380px;" v-model="ruleFormSend.phone" @keyup.native="numRule('ruleFormSend','phone')" maxlength="11" placeholder="请输入送货人联系电话"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人姓名：" prop="name">
                          <el-input style="max-width: 380px;" v-model="ruleFormSend.name" placeholder="请输入送货人姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="预计送达时间：" prop="date">
                          <el-date-picker  style="width: 380px;" v-model="ruleFormSend.date" type="date"  value-format="yyyy-MM-dd" placeholder="请选择送达时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="送达时间段：">
                          <div class="send_time">
                            <div>
                              <el-form-item prop="startTime">
                                <el-time-select v-model="ruleFormSend.startTime" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}" placeholder="请选择"></el-time-select>
                              </el-form-item>
                            </div>
                            <div>至</div>
                            <div>
                              <el-form-item prop="endTime">
                                <el-time-select v-model="ruleFormSend.endTime" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}" placeholder="请选择"></el-time-select>
                              </el-form-item>
                            </div>
                          </div>
                        </el-form-item>
                      </el-form>
                      <!--<div class="look_courier"><span>查看快递员信息</span></div>-->
                    </div>
                  </div>
                  <div class="buyer_address_btn btn"><el-button type="primary" :disabled="isD.disabled" @click="ddd('ruleFormLogistics')">确定</el-button><span v-if="pageType === '补货'">提示：请注意退还用户寄回商品运费费用  金额：<span>¥10.00</span></span></div>
                </div>
              </div>
            </div>
          </li>


          <!--已退款-->
          <li class="seller_content" v-if="isG.show">
            <div class="seller_content_left"><i class="">{{isG.step}}</i><span></span></div>
            <div class="seller_content_right">
              <div class="seller_main">
                <div class="left_arrows"></div>
                <!---->
                <div class="refund_list">
                  <div class="seller_title">已退款</div>
                  <div class="refund_list_content">货款<span>{{allData&&allData.backMoney}}</span>元已原路退回买家账户</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <SaleAfterAddress :dialog="dialog" @sendAddress="acceptAddress"></SaleAfterAddress>

    <!--确定退款弹框-->
    <el-dialog title="提示" :visible.sync="refundDialogVisible" width="30%"  class="dialog_refund">
      <div class="refund">同意退款，将退<span>{{allData&&allData.backMoney}}</span>元至买家账户，是否确认？</div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary"  @click="refundSure">确定</el-button>
          <el-button @click="refundDialogVisible = false">取消</el-button>
        </div>
      </span>
    </el-dialog>

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
  import CustomUpload from '@/components/public/customUpload'     //上传图片组件
  import SaleAfterAddress from './SaleAfterAddress'   //更换地址 添加地址组件

  import GetOrderBackDetail from '@/api/AfterSale/GetOrderBackDetail.js'    //获取退单详情
  import GetBackOrderLife from '@/api/AfterSale/GetBackOrderLife.js'    //获取操作日志
  import GetExpressListByPage from '@/api/AfterSale/GetExpressListByPage.js'  //获取物流方式列表


  import RefundRequest from '@/api/AfterSale/RefundRequest.js'    //同意/拒绝退单申请
  import CompensateGoodsApply from '@/api/AfterSale/CompensateGoodsApply.js'    //同意/拒绝补发货
  import RefundConfirm from '@/api/AfterSale/RefundConfirm.js'    //同意/拒绝退货退款 （用户是否寄回商品）
  import RefundReceived from '@/api/AfterSale/RefundReceived.js'    //同意/拒绝换货 （用户是否寄回商品）



  export default {
    name: "saleAfter",
    inject:["reload"],
    components:{
      CustomUpload,
      SaleAfterAddress,
    },
    data(){
      let sendCompanyPass=(rule,value,callback)=>{
        if(value === '' || value === null){
          callback(new Error('请选择物流公司'));
        }else{
          callback();
        }
      };
      let sendPostCodePass=(rule,value,callback)=>{
        if(value === ''){
          callback(new Error('请输入快递单号'));
        }else{
          callback();
        }
      };
      return{
        pageType:'换货',  //换货  补发货  仅退款  退货退款  维修
        state:'',
        isA:{show:false,disabled:false,step:1},   //是否同意换货
        isB:{show:false,disabled:false,step:2},   //买家寄货地址
        isC:{show:false,disabled:false,step:2},   //是否确认收到买家寄回商品
        isD:{show:false,disabled:false,step:2},    //卖家寄货
        isE:{show:false,disabled:false,step:2},    //问题描述
        isF:{show:false,disabled:false,step:2},    //平台介入处理
        isG:{show:false,disabled:false,step:2},     //已退款
        isH:{show:false,disabled:false,step:2},     //添加维修按钮

        rightList:[],   //右边展示的
        detailsImg:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/fHommAZzcbc.jpg',
        isRadio:'0',    // 0同意换货  1不同意
        returnsRemark:'',   //退货说明
        sellerAddr:{},      //买家寄货地址
        sendRadio:'0',  // 0 确认收到买家寄回商品 1收货有问题
        sendWayRadio:'0', //0快递物流  1商家自送
        ruleFormLogistics:{
          sendCompany:'',   //卖家寄货物流公司
          sendPostCode:'',  //卖家寄货快递单号
        },
        rulesLogistics:{
          sendCompany:[{validator:sendCompanyPass, trigger: 'change'}],
          sendPostCode:[{validator:sendPostCodePass, message: '请输入物流单号', trigger: 'blur'}],
        },
        expressList: [],    //物流列表


        reasonExplain:'',  //收货有问题 问题描述   换货不同意理由说明
        uploadImg:{      //收货有问题 问题描述图片  换货不同意
          idName:'aaa',
          limit:5,
          imgArr:[],
        },

        ruleFormSend:{
          phone:'',
          name:'',
          date:'',
          startTime:'',
          endTime:'',
        },
        rulesSend:{
          phone:[{required: true, message: '请输入送货人联系电话', trigger: 'blur' }],
          name:[{required: true, message: '请输入送货人姓名', trigger: 'blur' }],
          date:[{required: true, message: '请选择送达时间', trigger: 'blur' }],
          startTime:[{required: true, message: '请选择送达时间段', trigger: 'blur' }],
          endTime:[{required: true, message: '请选择送达时间段', trigger: 'blur' }],
        },
        dialog:{dialogVisible:false,},

        refundDialogVisible:false,   //确认退款弹框
        leftWidth:0,  //详情左边标题宽度
        leftHeight:0, //详情左边高度
        lookMoreDialogVisible:false,  //查看更多商品框
        allData:false,     //所有的数据
        sellerAddr:{
          consignee:'',
          mobile:'',
          address:'',
          postCode:'',
        },    //买家寄货地址
        status:0,       //状态 （重要）
        operationLog:[],   //
        isAgreeReturnPost:{},  //同意/拒绝换货申请要上传的数据

        sendGoodsPost:{},   //卖家补发货要上传的数据

      }
    },
    computed:{
      remind() {
        if(this.pageType === '换货'){
            if(this.sendRadio === '1'){   //换货-收货有问题
              return {reasonTitle:'问题描述',reasonRemind:'收货有问题的提交后由平台协商处理',placeholder:'请准确真实的描述收货问题',disputeTitle:'收货有问题'}
            }
            if(this.isRadio === '1'){     //换货-不同意换货
              return {reasonTitle:'理由说明',reasonRemind:'不同意换货的提交后由平台协商处理',placeholder:'请说明不同意换货的相关理由',disputeTitle:'不同意换货'}
            }
        }else if(this.pageType === '补发货'){
          if(this.isRadio === '1'){
            return {reasonTitle:'理由说明',reasonRemind:'不同意补发货的提交后由平台协商处理',placeholder:'请说明不同意补发货的相关理由',disputeTitle:'不同意补发货'}
          }
        }else if(this.pageType === '仅退款'){
          return {reasonTitle:'理由说明',reasonRemind:'不同意退款的提交后由平台协商处理',placeholder:'请说明不同意退款的相关理由',disputeTitle:'不同意退款'}
        }else if(this.pageType === '退货退款'){
          // if(this.sendRadio === '1'){   //退货退款-收货有问题
          //   return {reasonTitle:'问题描述',reasonRemind:'收货有问题的提交后由平台协商处理',placeholder:'请准确真实的描述收货问题',disputeTitle:'收货有问题'}
          // }
          // if(this.isRadio === '1'){     //退货退款不同意换货
          // }
          return {reasonTitle:'理由说明',reasonRemind:'不同意退货退款的提交后由平台协商处理',placeholder:'请说明不同意退货退款的相关理由',disputeTitle:'不同意退货退款'}

        }else if(this.pageType === '维修'){
          if(this.isRadio === '0'){
            return {reasonTitle:'添加维修记录',reasonRemind:'添加维修各个关键节点的记录，方便用户知晓',placeholder:'请输入维修记录 如：已收到用户寄回维修商品；商品返厂维修中',disputeTitle:'不同意退货退款'}
          }else if(this.isRadio === '1'){
            return {reasonTitle:'问题描述',reasonRemind:'不同意维修的提交后由平台协商处理',placeholder:'请说明不同意维修的相关理由',disputeTitle:'不同意维修'}
          }
        }
      },

    },
    methods:{
      //只能输入数字限制
      numRule(obj,param) {
        this[obj][param]=this[obj][param].replace(/[^\.\d]/g,'');
        this[obj][param]=this[obj][param].replace('.','');
      },
      //联系买家
      chat() {
        console.log('ddddd')
        let routeUrl = this.$router.resolve({
          name: "zhiXunGuanLi",
        });
        window.open(routeUrl .href, '_blank');
      },
      //是否同意   aaa
      aaa:async function() {
        this.isA.disabled=true;
        if(this.pageType === '换货' || this.pageType === '维修'){
          if(this.isRadio === '0'){
            this.isB=Object.assign(this.isB,{show:true, disabled:false, step:2});
          }else if(this.isRadio === '1'){
            this.isE=Object.assign(this.isE,{show:true, disabled:false, step:2});
          }
        }else if(this.pageType === '退货退款'){
          if(this.isRadio === '0'){
            this.isB=Object.assign(this.isB,{show:true, disabled:false, step:2});
            this.rightList.push('卖家寄货');
          }else if(this.isRadio === '1'){
            this.isE=Object.assign(this.isE,{show:true, disabled:false, step:2});
            this.rightList.push('理由说明');
          }
        }else if(this.pageType === '补发货'){
          if(this.isRadio === '0'){
            this.expressList=await this.getExpressList();
            this.rightList.push('卖家寄货');
            this.isD=Object.assign(this.isD,{show:true, disabled:false, step:2});
          }else if(this.isRadio === '1'){
            this.isE=Object.assign(this.isE,{show:true, disabled:false, step:2});
            this.rightList.push('理由说明');
          }
        }else if(this.pageType === '仅退款'){
          if(this.isRadio === '0'){
            this.refundDialogVisible=true;
            this.isA.disabled=false;
          }else if(this.isRadio === '1'){
            this.isE=Object.assign(this.isE,{show:true, disabled:false, step:2});
            this.rightList.push('不同意理由');
          }
        }


      },
      //同意换货的申请的之后的按钮  bbb
      isAgreeReturn() {
        this.refundRequest();
        // if(this.pageType === '维修'){
        //   this.isH=Object.assign(this.isH,{show:true, disabled:false, step:3});
        // }else {
        //   this.isC=Object.assign(this.isC,{show:true, disabled:false, step:3});
        // }
        this.isB.disabled=true;
      },
      //接受更换的退货地址
      acceptAddress(val) {
        this.sellerAddr.consignee=val.name;
        this.sellerAddr.mobile=val.mobile;
        this.sellerAddr.postCode=val.zipCode;
        this.sellerAddr.address=`${val.fullAddress.split(',').join('')}${val.address}`;
      },
      //换货同意/不同意上传数据的接口  (仅退款,退货退款)
      refundRequest() {
        this.isAgreeReturnPost={};
        this.isAgreeReturnPost.backNo=this.allData.backNo;
        this.isAgreeReturnPost.rowver=this.allData.rowver;
        // this.isAgreeReturnPost.orderType=this.allData.orderType;
        this.isAgreeReturnPost.clientTimespan=this.$Tool.formatDate(new Date());

        this.isRadio === '0'?this.isAgreeReturnTrue():this.isAgreeReturnFalse();

        RefundRequest.call(this,this.isAgreeReturnPost).then(async (res)=>{
          if(res.data.code === 1){
            // this.operationLog=await this.getOperationLog();   //获取操作日志
            this.$message({
              message: '处理成功',
              type: 'success'
            });
            this.reload();
          }
          console.log('同意拒绝退款申请上传',this.pageType,res)
        });

        // console.log(this.isAgreeReturnPost);
        console.log('ok',this.isAgreeReturnPost);

      },

      //同意换货申请要上传的数据
      isAgreeReturnTrue() {
        let params={};
        params.isAgree=1;
        if(this.pageType === '换货' || this.pageType === '退货退款'){
          params.returnsRemark=this.returnsRemark;
          params.address=this.sellerAddr;
        }else if(this.pageType === '仅退款'){

        }

        if(this.pageType === '退货退款' && this.status === 20){
          delete params.returnsRemark;
          delete params.address;
        }

        this.isAgreeReturnPost=Object.assign(this.isAgreeReturnPost,params);
      },
      //拒绝换货申请要上传的数据
      isAgreeReturnFalse() {
        let params={};
        params.isAgree=0;
        params.reason=this.reasonExplain;
        params.picture=this.uploadImg.imgArr;
        this.isAgreeReturnPost=Object.assign(this.isAgreeReturnPost,params);
      },
      //是否同意收到买家寄回的东西  ccc
      ccc:async function() {
        this.isC.disabled=true;
        if(this.pageType === '退货退款'){
          if(this.sendRadio === '0'){
            this.refundDialogVisible=true;
            this.isC.disabled=false;
          }else if(this.sendRadio === '1'){
            this.rightList.push('理由说明')
            this.isE=Object.assign(this.isE,{show:true, disabled:false, step:2});
          }
        }else if(this.pageType === '换货'){
          if(this.sendRadio === '0'){
            this.expressList=await this.getExpressList();
            this.isD=Object.assign(this.isD,{show:true, disabled:false, step:2});
            this.rightList.push('买家寄货');
          }else if(this.sendRadio === '1'){
            this.rightList.push('理由说明')
            this.isE=Object.assign(this.isE,{show:true, disabled:false, step:2});
          }
        }
        // else{
        //   if(this.sendRadio === '0'){
        //     this.isD=Object.assign(this.isD,{show:true, disabled:false, step:4});
        //   }else if(this.sendRadio === '1'){
        //     this.isE=Object.assign(this.isE,{show:true, disabled:false, step:4});
        //   }
        // }

      },

      //卖家寄货的物流填写 商家自送  ddd
      ddd() {
        let formName=this.sendWayRadio === '0'?'ruleFormLogistics':'ruleFormSend';
        console.log(formName)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.pageType === '换货'){
              this.refundReceived();
            }else if(this.pageType === '补发货'){
              this.compensateGoodsApply();
            }
            this.isD.disabled=true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // if(this.sendWayRadio==='1'){
        //
        // }
        // else{
        //   this.isD.disabled=true;
        // }
      },
      //换货 同意/拒绝 收到寄回的商品的接口
      refundReceived() {
        this.sendGoodsPost={};
        this.sendGoodsPost.backNo=this.allData.backNo;
        this.sendGoodsPost.rowver=this.allData.rowver;
        this.sendGoodsPost.clientTimespan=this.$Tool.formatDate(new Date());
        this.sendRadio=== '0'?this.expressageLogisticsTrue():this.expressageLogisticsFalse();
        console.log(this.sendGoodsPost);
        RefundReceived.call(this,this.sendGoodsPost).then(async (res)=>{
          if(res.data.code === 1){
            // this.operationLog=await this.getOperationLog();   //获取操作日志
            this.$message({
              message: '处理成功',
              type: 'success'
            });
            this.reload();
          }
          console.log('换货成功',res)
        })
      },

      //同意/拒绝补发货的数据接口
      compensateGoodsApply() {
        this.sendGoodsPost={};
        this.sendGoodsPost.backNo=this.allData.backNo;
        this.sendGoodsPost.rowver=this.allData.rowver;
        this.sendGoodsPost.clientTimespan=this.$Tool.formatDate(new Date());
        this.isRadio === '0'?this.expressageLogisticsTrue():this.expressageLogisticsFalse();
        console.log(this.sendGoodsPost);
        CompensateGoodsApply.call(this,this.sendGoodsPost).then(async (res)=>{
          console.log('补发货成功',res)
          if(res.data.code === 1){
            // this.operationLog=await this.getOperationLog();   //获取操作日志
            this.$message({
                    message: '处理成功',
                    type: 'success'
                  });
            this.reload();
          }
        })
      },
      //同意补发货快递物流 要上传的信息
      expressageLogisticsTrue() {
        let params={};
        params.isAgree=1;
        if(this.sendWayRadio === '0'){  //物流快递
          params.expressId =this.ruleFormLogistics.sendCompany;
          params.expressNo=this.ruleFormLogistics.sendPostCode;
        }else if(this.sendWayRadio === '1'){  //商家自送
          params.expressId =-1;
          params.linkMan=this.ruleFormSend.name;
          params.linkMobile =this.ruleFormSend.phone;
          params.minEstimatedTime=`${this.ruleFormSend.date} ${this.ruleFormSend.startTime}:00`;
          params.maxEstimatedTime =`${this.ruleFormSend.date} ${this.ruleFormSend.endTime}:00`;
        };
        this.sendGoodsPost=Object.assign(this.sendGoodsPost,params);
      },
      //不同意补发货 要上传的信息
      expressageLogisticsFalse() {
        let params={};
        params.isAgree=0;
        params.reason=this.reasonExplain;
        params.picture=this.uploadImg.imgArr;
        this.sendGoodsPost=Object.assign(this.sendGoodsPost,params);
      },


      //拒绝按钮
      eee() {
        if((this.pageType === '换货' || this.pageType === '仅退款') && this.status === 0){
          this.refundRequest();
        }else if(this.pageType === '换货' && this.status === 20){
          this.refundReceived();
        }else if(this.pageType === '补发货'){
          this.compensateGoodsApply();
        }else if(this.pageType === '退货退款'){
          this.refundConfirm();
        }

        this.isF=Object.assign(this.isF,{show:true, disabled:false, step:3});
        console.log(this.remind.disputeTitle)
        this.rightList.push(`${this.remind.disputeTitle}-平台介入处理`);
        this.isE.disabled=true;
        // if(this.pageType === '维修' && this.isRadio === '0'){
        //   return
        // }
        // this.isF=Object.assign(this.isF,{show:true, disabled:false, step:this.isE.step+1});
      },
      eeeCancel() {
        this.isA.disabled=false;
        if(this.pageType === '退货退款'){
          this.isC.disabled=false;
        }
        this.isE=Object.assign(this.isE,{show:false, disabled:false, step:2});
        this.rightList.pop();
      },

      fff() {
        // this.isF.disabled=true;
        this.$message('该功能正在开发中');
      },


      //是否收到买家寄回商品接口（退货退款）
      refundConfirm() {
        this.isAgreeReturnPost={};
        this.isAgreeReturnPost.backOrderId =this.allData.backOrderId ;
        this.isAgreeReturnPost.rowver=this.allData.rowver;
        this.isAgreeReturnPost.clientTimespan=this.$Tool.formatDate(new Date());

        this.sendRadio === '0'?this.isAgreeReturnTrue():this.isAgreeReturnFalse();

        RefundConfirm.call(this,this.isAgreeReturnPost).then(async (res)=>{
          if(res.data.code === 1){
            // this.operationLog=await this.getOperationLog();   //获取操作日志
            this.$message.success('处理成功');
            this.reload();
          }
          console.log('是否收到商品',this.pageType,res)
        });

        // console.log(this.isAgreeReturnPost);
        console.log('ok','退货退款',this.isAgreeReturnPost);
      },


      //退款弹框的确定
      refundSure() {
        if(this.pageType === '仅退款'){
          this.refundRequest();
        }
        if(this.pageType === '退货退款'){
          this.refundConfirm();
          this.isC.disabled=true;
        }else{
          this.isA.disabled=true;
        }

        this.refundDialogVisible=false;
        this.rightList.push('已退款');
        this.isG=Object.assign(this.isG,{show:true, disabled:false, step:2});

      },
      hhh() {
        this.isH.disabled=true;
        this.isE=Object.assign(this.isE,{show:true, disabled:false, step:4});

      },


      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //获取操作日志
      getOperationLog() {
        let backNo=this.$route.query.backNo;
        let orderType=this.$route.query.orderType;
        return new Promise(resolve => {
          GetBackOrderLife.call(this,`?backNo=${backNo}&orderType=${orderType}&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
            console.log('日志',res)
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })

      },
      //获取所有数据
      getAllData() {
        let backNo=this.$route.query.backNo;
        let orderType=this.$route.query.orderType;
        return new Promise(resolve => {
          GetOrderBackDetail.call(this,`?backNo=${backNo}&orderType=${orderType}&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
            console.log('99',res);
            console.log(res.data.data.status)
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },
      getStatus:async function() {
        this.allData=await this.getAllData();
        this.pageType=this.allData.typeDesc;
        this.$nextTick(()=>{
          this.leftWidth=document.getElementsByClassName('getWidth')[0].offsetWidth;
        })
        setTimeout(()=>{
          this.leftHeight=document.getElementById('aabc').offsetHeight;
          console.log('高1111',this.leftHeight);
        },0)

        this.status=this.allData.status;
        if((this.pageType === '换货' || this.pageType === '退货退款') && (this.status === 30 || this.status === 50)){
          this.isA.show=false;
          this.isRadio = '1';
          this.isF=Object.assign(this.isF,{show:true, disabled:false, step:1});
          this.rightList.push('不同意换货-平台介入处理');
          return
        }else if((this.pageType === '仅退款' || this.pageType === '补发货') && this.status === 20){
          this.isF=Object.assign(this.isF,{show:true, disabled:false, step:1});
          this.rightList.push(`不同意${this.pageType}-平台介入处理`);
        }else if((this.pageType === '换货' || this.pageType === '退货退款')  && this.status === 20){
          this.isC=Object.assign(this.isC,{show:true, disabled:false, step:1});
          this.rightList.push('是否确认收到买家寄回商品');
        }else if((this.pageType === '换货' || this.pageType === '退货退款')  && this.status === 10){
          this.isC=Object.assign(this.isC,{show:true, disabled:false, step:1});
          this.rightList.push('是否确认收到买家寄回商品');
        }else if(this.status === 777){
          this.isF=Object.assign(this.isF,{show:true, disabled:false, step:1});
          if(this.pageType === '换货'){
            this.isRadio='1';
            this.rightList.push('不同意换货-平台介入处理');
          }else if(this.pageType === '退货退款'){
            this.rightList.push('不同意退货退款-平台介入处理');
          }
        }else if(this.status === 0){
          this.isA.show=true;
          this.rightList.push(`是否同意${this.pageType}`);
        }
        this.sellerAddr.consignee=this.allData.sellerAddr.name;
        this.sellerAddr.mobile=this.allData.sellerAddr.mobile;
        this.sellerAddr.address=this.allData.sellerAddr.address;
      },
      //获取物流公司
      getExpressList() {
        return new Promise(resolve => {
          GetExpressListByPage.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
            console.log('物流',res)
            if(res.data.code === 1){
              resolve(res.data.data.list);
            }
          })
        })
      },
    },
    created:async function() {
      await this.getStatus();   //获取所有数据 判断状态
      this.operationLog=await this.getOperationLog();   //获取操作日志

    },
    mounted:async function() {

    },

  }
</script>

<style lang="less" scoped>
  @import "less/saleAfter.less";
</style>
