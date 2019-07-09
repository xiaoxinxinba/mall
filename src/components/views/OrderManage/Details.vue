<template>
  <div>
    <ul class="title" v-if="!orderProgress.cancel">
      <li>
        1.买家提交订单
      </li>
      <li :class="{ choose: orderProgress.create }">
        2.买家付款
      </li>
      <li :class="{ choose: orderProgress.payment }">
        3.商家接单
      </li>
      <li :class="{ choose: orderProgress.accept }">
        4.商家发货
      </li>
      <li :class="{ choose: orderProgress.shipped }">
        5.买家确认收货
      </li>
      <li :class="{ choose: orderProgress.receive || orderProgress.settle }">
        6.订单结算
      </li>
    </ul>

    <keep-alive>
      <component :is="currentTabComponent" :fatherSource="dataSource"></component>
    </keep-alive>
    <!--买家留言-->
    <div class="public" v-show="currentTabComponent != 'ReceiveOrder'">
      <div class="buyer">
        <div class="buyer-remark">
          <p><span>买家留言：</span>{{dataSource.message || "- - -"}}</p>
          <div><span>发票信息：</span>{{dataSource.invoiceTitle || "- - -"}} | 纳税人识别号：{{dataSource.invoiceCode || "- - -"}}
            <span class="invoice" @click="invoiceRule=true">发票开具规则</span></div>
        </div>
        <div class="buyer-infor">
          <h2>买家信息</h2>
          <div><span>买家： {{dataSource.buyer.name}} </span><i class="chat" @click="goZiXunGuanLi(dataSource.buyer.id)"></i> </div>
        </div>
        <div class="receive">
          <h2>收货信息</h2>
          <ul>
            <li>收货人： {{dataSource.recipient.name}}<i v-if="dataSource.recipient.legalNumber">（身份证号：{{dataSource.recipient.legalNumber
              }}）</i></li>
            <li>收货电话：{{dataSource.recipient.mobile}}</li>
            <li>邮政编码：{{dataSource.recipient.postCode }}</li>
            <li>收货地址：{{dataSource.recipient.address }}</li>
            <div
              v-if="dataSource.packages.length && !dataSource.isSomeShipped && dataSource.packages[0].expressId !== -1">
              <li>快递单号：{{dataSource.packages[0].expressNo || "- - -" }} <span class="logistics-btn"
                                                                              v-if="logisticsAmend"
                                                                              @click="logisticsAmendShow">修改物流</span><span
                class="logistics-btn" @click="logisticsLook">查看物流详情</span></li>
              <li>快递公司：{{dataSource.packages[0].expressName || "- - -" }}</li>

            </div>
            <li></li>
            <div v-if="dataSource.packages.length && dataSource.isSomeShipped">
              <li>快递单号： 拆包发货 <span class="logistics-btn" @click="logisticsLook">查看物流详情</span></li>
              <li>快递公司： ---</li>

            </div>
            <div
              v-if="dataSource.packages.length && !dataSource.isSomeShipped && dataSource.packages[0].expressId === -1">
              <li>商家自送：{{zsDesc()}} <span class="logistics-btn" @click="dialogContact = true">修改联系信息</span></li>
            </div>
          </ul>
        </div>
      </div>


      <div class="good-box">
        <!--购买商品-->
        <div class="goods">
          <div class="goods-title"><span>商品信息</span><span>订单号：{{dataSource.orderNo}} </span><span class="print-order"
                                                                                                  @click="print">打印发货单</span>
          </div>
          <div class="goods-table">
            <el-table :data="goodsList" style="width: 100%" border>
              <el-table-column
                align="center"
                label="商品"
                width="400">
                <template slot-scope="scope">
                  <div class="goods-img">
                    <img :src="scope.row.image" alt="">
                    <div>{{scope.row.title }}</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="规格">
                <template slot-scope="scope">
                  <span class="goods-specification">{{scope.row.spec }}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="单价"
                width="140">
                <template slot-scope="scope">
                  <div class="goods-price">
                    <p>¥{{scope.row.sellPrice}}</p>
                    <p v-if="scope.row.sellPrice != scope.row.marketPrice">¥{{scope.row.marketPrice}}</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="数量"
              >
                <template slot-scope="scope">
                  <span class="goods-num">{{scope.row.quantity }}</span>
                </template>
              </el-table-column>


              <el-table-column
                align="center"
                label="合计"
              >
                <template slot-scope="scope">
                  <div class="goods-total">
                    <p> ¥ {{(scope.row.quantity * scope.row.sellPrice).toFixed(2)}}</p>
                    <p class="tagred" v-if="scope.row.backOrderId && scope.row.backOrderCreateRole">无货退款</p>
                    <p class="orange" v-else-if="scope.row.gift">赠品</p>
                    <p class="orange" v-else>{{scope.row.backOrderStatusText}}</p>
                  </div>
                </template>
              </el-table-column>

            </el-table>

          </div>

        </div>
        <!--付款金额-->
        <div class="compute" style="padding: 0;">
          <div class="compute-main">
            <div class="compute-left">
              <ul>
                <li v-if="validTime(dataSource.createAt)"><label>下单时间：</label><span>{{dataSource.createAt}}</span></li>
                <li v-if="validTime(dataSource.payAt)"><label>支付时间：</label><span>{{dataSource.payAt}}</span></li>
                <li v-if="validTime(dataSource.acceptAt)"><label>接单时间：</label><span>{{dataSource.acceptAt}}</span></li>
                <li v-if="validTime(dataSource.shipAt)"><label>发货时间：</label><span>{{dataSource.shipAt}}</span></li>
                <li v-if="validTime(dataSource.completeAt)"><label>收货时间：</label><span>{{dataSource.completeAt}}</span>
                </li>
                <li v-if="validTime(dataSource.cancelAt)"><label>取消时间：</label><span>{{dataSource.cancelAt}}</span></li>
              </ul>
            </div>
            <div class="compute-right">
              <ul>
                <li>商品总价：￥ {{ parseFloat(dataSource.payment.sellMoney).toFixed(2) }}</li>
                <li>运费：￥ {{ parseFloat(dataSource.payment.realFreight).toFixed(2) }}</li>
                <li v-show="dataSource.payment.shopDiscount.length > 0">商品优惠： <span>-</span>￥ {{
                  dataSource.payment.shopDiscount }}
                  <div class="tooltip">
                    <el-tooltip class="item" effect="light" content="限时折扣,满折优惠金额" placement="bottom-end"><i
                      class="el-icon-warning"></i></el-tooltip>
                  </div>
                </li>
                <li>店铺优惠券：<span>-</span> ￥{{ dataSource.payment.shopCouponMoney }}</li>
                <li>订单总额：￥ {{ dataSource.payment.realMoney + dataSource.payment.realFreight }}</li>
                <li v-if="dataSource.isAmountChanged">修改价格：商品 {{ dataSource.payment.shopChangeMoney | editPriceFormat
                  }}，运费 {{ dataSource.payment.expressChangeMoney | editPriceFormat }}
                  <div class="tooltip">
                    <el-tooltip class="item" effect="light" :content="changeAmountRemark" placement="bottom-end"><i
                      class="el-icon-warning"></i></el-tooltip>
                  </div>
                </li>
                <li>应收款：￥{{dataSource.payment.payMoney + dataSource.payment.beanMoney + dataSource.payment.voucherMoney
                  + dataSource.payment.platformDiscount }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="btn">
          <el-button class="btn-ok" type="primary" v-if="goodsSendDialogVisibleShow" @click="goodsSendDialogVisible = true">确认商品送达</el-button>
          <el-button @click="BackPrePage">返 回</el-button>
          <p style="color: red" v-show="orderBtns.shippedOrder === true || this.orderProgress.accept == true">重要提醒：商品送达后请务必点击"确认送达"并提醒用户收货，否则订单将无法完成结算</p>
        </div>
      </div>





        <!--开具发票规则-->
        <el-dialog class="invoice-rule"
                   title=""
                   :visible.sync="invoiceRule"
                   width="600px"
        >
          <span slot="title" class="dialog-title"></span>
          <div class="dialog-main">
            <h2>满集商城发票开具规则（scfp-1.0.0）</h2>
            <ul>
              <span>一、开具发票的条件及流程</span>
              <li>1、买家购买的商品必须是通过满集网线上交易；</li>
              <li>2、买家在下订单时，应在“发票信息”栏目中注明开票信息；</li>
              <li>3、若买家在提交的订单未提及提供发票且商品未发货，可通过“满集聊天”向商家说明情况，商家应承诺为买家开具发票并与商品一并邮寄；</li>
              <li>4、若买家在提交的订单未提及提供发票且商品已发货，买家可在15天内通过“满集聊天”向商家说明情况，商家应为买家补开发票；</li>
            </ul>
            <ul>
              <span>二、商家义务及违规处理</span>
              <li>
                1、无论购买金额大小，商家应该无条件给买家开具发票，不得以任何理由拒绝给买家开发票，若出现提供虚假发票或不提供发票，每次信誉值扣20分，情况严重者，则关闭店铺；涉及违反国家税法等规定的，将上报当地危机公关处理。
              </li>
              <li>2、若属于特价商品、活动商品，明确低于正常价格30%—50%的且事前公示不能开具发票的，此类商品可不予提供发票；</li>
              <li>3、商家为买家开具的发票应合法合规，并保证按照国家相关规定自行承担相应税费。</li>
              <li>4、商品发货之前买家已明确需开发票，而商家并未同时寄出的，商家应通过“满集聊天”向买家说明情况同时承担寄送发票的运费；</li>
              <li>5、买家可在商品发货之后15天内通过“满集聊天”向商家申请补开发票，但买家应承担寄送发票的运费；</li>
              <li>6、若因商家发票开具错误、未开具发票或者其他发票问题引起的纠纷，均由商家承担相应的法律责任，如造成满集网损失的，商家应予以赔偿。</li>
              <li>7、若因买家提供的发票信息错误导致重新开具发票的，产生的费用包括但不限于邮费等均由买家承担。</li>
              <li>8、若商品产生退货退款，无论部分退款还是全额退款，发票均应退还至商家；若属于部分退款，原发票退还后商家应重新开具未退还商品的发票，邮寄发票产生费用根据退款原因判定责任方承担相应费用。</li>
              <li>9、电子发票和纸质发票具有同等效力，可以作为合法的交易凭证和保修凭证。</li>
            </ul>
          </div>

        </el-dialog>

        <!--修改物流-->
        <el-dialog
          class="logistics-amend"
          title="修改物流信息"
          :visible.sync="islogisticsAmend"
          width="520px"
        >
          <el-form :model="logisticsAmendForm" :rules="logisticsAmendRules" ref="logisticsAmendForm" label-width="120px"
                   class="demo-logisticsAmend">
            <el-form-item label="请输入快递单号" prop="code">
              <el-input v-model="logisticsAmendForm.code"></el-input>
            </el-form-item>

            <el-form-item label="快递公司" prop="company">
              <!--<el-input v-model="logisticsAmendForm.company"></el-input>-->
              <el-cascader
                v-model="logisticsAmendForm.company"
                placeholder="请选择快递公司"
                :options="expressCompany"
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="logisticsAmendSure('logisticsAmendForm')">确定</el-button>
              <el-button @click="islogisticsAmend = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>


        <!--修改联系信息-->
        <el-dialog class="logistics"
                   title="修改联系信息"
                   :visible.sync="dialogContact"
                   width="540px"
        >
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="联系电话：" prop="name">
              <el-input style="width: 340px;" v-model="ruleForm.phone" maxlength="12" ></el-input>
            </el-form-item>
            <el-form-item label="联系人姓名：" prop="name">
              <el-input style="width: 340px;" v-model="ruleForm.name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="预计送达时间：" prop="date">
              <el-date-picker style="width: 340px;" v-model="ruleForm.date" type="date" :picker-options="pickerOptions"
                              placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="送达时间段：" required>
              <div class="delivery_date_main">
                <div class="delivery_date">
                  <el-form-item prop="startDate">
                    <el-select v-model="ruleForm.startDate" placeholder="请选择时间"><el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
                  </el-form-item>
                </div>
                <div class="delivery_date">至</div>
                <div class="delivery_date">
                  <el-form-item prop="endDate">
                    <el-select v-model="ruleForm.endDate" placeholder="请选择时间"><el-option v-for="item in timeList" :disabled="ruleForm.startDate>item.value" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="contact-btn">
                <el-button type="primary" @click="contactSure('ruleForm')">确定</el-button>
                <el-button @click="dialogContact = false">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>


        <!--确认商品是否送达-->
        <el-dialog
          title="提示"
          :visible.sync="goodsSendDialogVisible"
          width="440px"
          class="goods-send">
          <div class="goods-send-main">商品是否已送达，提醒用户确认</div>
          <div slot="footer" class="dialog-footer">
            <div>
              <el-button type="primary"  @click="goodsSendDialog()">确定</el-button>
              <el-button @click="goodsSendDialogVisible = false">取消</el-button>
            </div>
          </div>
        </el-dialog>


    </div>













  </div>
</template>

<script>
  import GetOrderDetial from '../../../api/Order/GetOrderDetial';//获取订单详情
  import WaitPayOrder from './waitPayOrder'; //待付款,待接单
  import WaitDeliverGoods from './waitDeliverGoods';  //待发货
  import AlreadyDeliverGoods from './alreadyDeliverGoods'; //已发货
  import OrderResult from './orderResult';  //已结算，买家已收货，已取消
  import ReceiveOrder from './receiveOrder'; //接单
  import _ from 'underscore';
  import moment from 'moment'
  import GetExpressCompanyList from '../../../api/Order/GetExpressCompanyList' //获取商家支持的物流
  import ModifyLogisticsInfo from '../../../api/Order/ModifyLogisticsInfo'
  import ConfirmDelivery from '../../../api/Order/ConfirmDelivery'

  let timeArr=[];
  for(let i=0;i<25;i++){
    if(i<10){
      timeArr.push({value:`0${i}:00`,label:`0${i}:00`});
    }else{
      timeArr.push({value:`${i}:00`,label:`${i}:00`});
    }
  }
  timeArr[timeArr.length-1].label=`23:59`;
  export default {
    name: "Details",

    components: {
      ReceiveOrder,
      WaitPayOrder,
      WaitDeliverGoods,
      AlreadyDeliverGoods,
      OrderResult
    },
    data() {
      return {
        express: {},//运费
        changeAmountRemark: '',//改价说明
        dataSource: {
          buyer: {},//购买人信息
          recipient: {},//收件人信息
          packages: {expressNo: '', expressName: ''},//包裹
          payment: {},//付款人信息
          goods: [],//购买的商品
          promotion: [] //活动优惠信息
        },//活动数据
        goodsList: [], //购买的商品
        invoiceRule: false,    //是否显示发票框
        logistics: false,      //是否显示物流详情
        logisticsAmend: false,
        currentTabComponent: 'OrderResult',//加载什么页面
        logisticsAmendForm: {
          code: '',
          company: [],
        },
        logisticsAmendRules: {
          code: [{required: true, message: '至少输入5位数的运单号', trigger: 'blur'}]
        },
        expressCompany: [
          /*{value: 'A', label: 'A', children: [{value: '安能物流1', label: '安能物流',}, {value: '澳世速递1', label: '澳世速递',}]},
          {value: 'A', label: 'B', children: [{value: '百世快通', label: '百世快通',}, {value: '百世快递', label: '百世快递',}]},*/
        ],
        parmeter: {
          orderNo: this.$route.query.orderNo,
          type: this.$route.query.type,
          status: this.$route.query.status,
        },
        dialogContact: false,  //修改联系信息
        ruleForm: {
          phone: '',
          name: '',
          date: '',
          startDate: '',
          endDate: '',

        },
        rules: {
          phone: [
            {required: true, message: '请输入联系人电话', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入联系人电话', trigger: 'blur'},
          ],
          date: [
            {required: true, message: '请选择预计到期时间', trigger: 'change'},
          ],
          startDate: [
            {required: true, message: '请选择送达时间段', trigger: 'change'},
          ],
          endDate: [
            {required: true, message: '请选择送达时间段', trigger: 'change'},
          ],

        },
        timeList:timeArr,
        islogisticsAmend:false,
        pickerOptions: {
          disabledDate(time) {
            let tiem=60*60*24*1000;
            let timeEnd=60*60*24*7*1000;
            return (time.getTime() < Date.now() - tiem)||(time.getTime() > Date.now() + timeEnd);
          }
        },
        goodsSendDialogVisible:false,   //确认是否送达
        goodsSendDialogVisibleShow:false
      }
    },
    mounted() {
      this.initData();
    },
    watch: {
      dataSource: function () {
        //处理商品列表
        _.forEach(this.dataSource.goods, item => {
          this.$set(item, "buyGoods", true);
          this.$set(item, "checked", true);
          this.goodsList.push(item);
          let gift = this.goodsGift(item.goodsId);
          if (gift) {
            _.forEach(gift, el => {
              this.goodsList.push({
                image: el.img_url,
                title: el.title,
                quantity: el.quantity,
                realPrice: el.sell_price,
                sellPrice: el.market_price,
                spec: "",
                state: 0,
                gift: true
              });
            });
          }
        });

        //获取订单赠品
        if (this.dataSource.promotion && this.dataSource.promotion.gifts && this.dataSource.promotion.gifts.length > 0) {
          _.forEach(this.dataSource.promotion.gifts, item => {
            this.goodsList.push({
              image: item.img_url,
              title: item.title,
              quantity: item.quantity,
              realPrice: item.sell_price,
              sellPrice: item.market_price,
              spec: "",
              state: 0,
              gift: true
            });
          });
        }

      }
    },
    computed: {
      /**
       * 订单按钮
       * */
      orderBtns() {
        return {
          //修改价格
          editPrice: _.any(this.dataSource.buttons, item => item.id === 2000),
          //接单
          acceptOrder: _.any(this.dataSource.buttons, item => item.id === 2001),
          //发货
          shippedOrder: _.any(this.dataSource.buttons, item => item.id === 2005),
          //延迟发货
          delayShippedOrder: _.any(this.dataSource.buttons, item => item.id === 2006)
        };
      },
      goodsSendDialog(){
        let date = new Date().toString();
        let time = moment(date).format("YYYY-MM-DD HH:mm:ss");
        var data = {
          "orderNo": this.parmeter.orderNo,
          "clientVersion": "v1",
          "clientTimespan": time
        }
        ConfirmDelivery.call(this,data).then(res=>{
           if(res.data.code === 1){
             this.$message({
               message: res.data.desc,
               type: 'success'
             });
             this.goodsSendDialogVisible = false
             this.$router.go(0)
           }else{
             this.$message.error(res.data.desc);
             this.goodsSendDialogVisible = false
           }
        })
      },
      orderProgress() {
        return {
          //用户下单
          create: this.dataSource.state === 100 || this.dataSource.state === 101,
          //用户付款
          payment: this.dataSource.state === 200,
          //商家接单、延迟发货之后
          accept: _.contains([250, 201, 350, 251], this.dataSource.state) && _.contains([1, 6], this.dataSource.globalState),
          //商家发货
          shipped: _.contains([300], this.dataSource.state) && _.contains([1, 6], this.dataSource.globalState),
          //用户确认收货
          receive: _.contains([601, 600], this.dataSource.state) && _.contains([1, 6], this.dataSource.globalState),
          //结算
          settle: this.dataSource.globalState === 666666,
          //取消
          cancel: _.contains([403, 404, 402, 401, 400], this.dataSource.state),
          //交易关闭
          close: !_.contains([403, 404, 402, 401, 400], this.dataSource.state) && _.contains([5], this.dataSource.globalState)
        };
      },
    },
    filters: {
      //显示改价 （商品价和运费）
      editPriceFormat(val) {
        if (val > 0) {
          return `+￥${val}`;
        } else if (val < 0) {
          return `-￥${-val}`;
        }
        return `￥${val}`;
      }
    },
    methods: {
      /**
       * 跳转到咨询管理页面
       */
      goZiXunGuanLi( buyerUserId ) {
        this.$router.push({
          path: '/OrderManage/zhiXunGuanLi',
          query: { buyerUserId: buyerUserId }
        });
      },
      /**
       * 返回上一页
       */
      BackPrePage() {
        history.back(-1);
      },
      /**
       * 跳转物流详情
       */
      logisticsLook() {
        this.$router.push({
          name: 'LogisticsDetails',
          query: {'orderNo': this.parmeter.orderNo, type: this.parmeter.type}
        });
      },
      logisticsAmendShow(){
        this.islogisticsAmend = true
      },
      /**
       * 初始化加载
       * */
      initData() {
        let date = new Date().toString();
        this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
        GetOrderDetial.call(this, `?input.orderNo=${this.parmeter.orderNo}&input.orderType=${this.parmeter.type}&input.clientTimespan=${this.time}`).then(res => {
          if (res.status === 200 && res.data.code === 1) {
            this.dataSource = res.data.data;
            this.changeAmountRemark = this.dataSource.changeAmountRemark;
            this.jumpPage();//跳转页面和传参
          } else {
            this.$message({showClose: true, message: res.data.desc, type: 'error'});
          }
        })
      },
      //自送信息
      zsDesc() {
        let desc = JSON.parse(this.dataSource.packages[0].expressDesc);

        return `联系电话（${desc.telephone}），联系人（${desc.linkman}），预计送达时间：${desc.deliveryDate} ${desc.minDeliveryTime}-${desc.deliveryDate} ${desc.maxDeliveryTime}`;
      },
      /**
       *  跳转页面传参
       * */
      jumpPage() {
        if (this.orderBtns.editPrice == true || this.orderBtns.acceptOrder == true)  //待结单和待付款页面
        {
          this.dataSource["editPrice"] = this.orderBtns.editPrice;
          this.dataSource["acceptOrder"] = this.orderBtns.acceptOrder;
          if (this.parmeter.status ==1 && this.orderBtns.acceptOrder ==true)
          {
            this.changePage('ReceiveOrder');
          }
          else
          {
            this.changePage('WaitPayOrder');
          }
        }
        if (this.orderProgress.shipped == true) //商家发货
        {
          this.dataSource["shipped"] = this.orderProgress.shipped;
          this.changePage('AlreadyDeliverGoods');
          this.logisticsAmend = true
          let date = new Date().toString();
          let time = moment(date).format("yyyy-MM-dd HH:mm:ss");
          GetExpressCompanyList.call(this,`?input.clientVersion=v1&input.clientTimespan=${time}`).then(res=>
          {
            if(res.data.code === 1){
              let data = res.data.data
              this.expressCompany = data
            }else{
              this.$message.error(res.data.desc);
            }
          });
          if(this.dataSource.packages != null){
             if(this.dataSource.packages[0].expressId === -1){
               this.goodsSendDialogVisibleShow = true
             }
          }
        }
        if (this.orderProgress.cancel == true || this.orderProgress.settle == true || this.orderProgress.receive == true) {
          let stateName = '';
          if (this.orderProgress.cancel == true) {
            stateName = "已取消";
          }
          if (this.orderProgress.settle == true) {
            stateName = "已结算";
          }
          if (this.orderProgress.receive == true) {
            stateName = "买家已收货";
          }
          this.dataSource["stateName"] = stateName;
          this.dataSource["cancel"] = this.orderProgress.cancel;
          this.dataSource["receive"] = this.orderProgress.receive;
          this.dataSource["settle"] = this.orderProgress.settle;
          this.changePage('OrderResult');
        }
        if (this.orderBtns.shippedOrder == true || this.orderProgress.accept == true) //待发货
        {
          this.changePage('WaitDeliverGoods');
          this.dataSource["shippedOrder"] = this.orderBtns.shippedOrder;//发货
          this.dataSource["delayShippedOrder"] = this.orderBtns.delayShippedOrder;//延迟发货
        }

      },
      /**
       * 跳转页面
       * val 页面
       * */
      changePage(val) {
        this.currentTabComponent = val;
      },
      validTime(date) {
        return date && date !== "1900-01-01 00:00:00";
      },
      /**
       * 打印发货单
       */
      print() {
        this.$router.push({path: 'Printer', query: {orderNo: this.parmeter.orderNo, type: this.parmeter.type}})
      },
      /**
       * 获取当前商品的赠品
       * @param {Int32Array} goodsId 商品id
       * @returns {Array} 当前商品赠品
       */
      goodsGift(goodsId) {
        let giftMatch = this.dataSource.promotion && this.dataSource.promotion.articlegifts && this.dataSource.promotion.articlegifts.length && _.chain(this.dataSource.promotion.articlegifts).find(item => item.goods_id === goodsId).value();
        return giftMatch && giftMatch.gifts;
      },
      logisticsAmendSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.logisticsAmendForm.company === null && this.logisticsAmendForm.company === []){
              this.$message({
                message: '请选择物流信息',
                type: 'warning'
              });
              return
            }
            if(this.logisticsAmendForm.code === ''){
              this.$message({
                message: '请填写物流单号',
                type: 'warning'
              });
              return
            }
            let packageId = 0
            if(this.dataSource.packages !== null && this.dataSource.packages !== []){
              packageId = this.dataSource.packages[0].id
            }
            if(packageId === 0){
              this.$message({
                message: '包裹信息有误',
                type: 'warning'
              });
              return
            }
            let expressId=this.logisticsAmendForm.company[1]
            let date = new Date().toString();
            let time = moment(date).format("YYYY-MM-DD HH:mm:ss");
            var data = {
              "orderNo": this.parmeter.orderNo,
              "packages": [
                {
                  "packageId": packageId,
                  "expressNo": this.logisticsAmendForm.code,
                  "expressId": expressId,
                  "linkman": "",
                  "telephone": "",
                  "minDeliveryDate": "",
                  "maxDeliveryDate": ""
                }
              ],
              "clientVersion": "v1",
              "clientTimespan": time
            }

            ModifyLogisticsInfo.call(this,data).then(res=>{
              if(res.data.code === 1){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.$router.go(0)
              }else{
                this.$message.error(res.data.desc)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      logisticsAmendCancel(formName) {
        this.$refs[formName].resetFields();
      },

      //送达时间段开始
      startDateChange() {
        this.ruleForm.endDate = '';
        this.endDate.start = this.ruleForm.startDate;
      },
      selectStartMonth() {
        this.startMonthOption = {
          disabledDate: (time) => {
            return new Date(this.ruleForm.date).getTime() - (86400000 * 6);
          }
        };
        this.calculatingTime();
      },
      contactSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //alert('submit!');
            if(this.ruleForm.phone === ''){
              this.$message({
                message: '请填写联系电话',
                type: 'success'
              });
              return
            }
            var myreg=/^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
            if (!myreg.test(this.ruleForm.phone)) {
              this.$message({
                message: '请正确联系电话',
                type: 'warning'
              });
              return
            }
            if(this.ruleForm.name === ''){
              this.$message({
                message: '请填写联系人姓名',
                type: 'warning'
              });
              return
            }
            if(this.ruleForm.startDate === '' || this.ruleForm.endDate === ''){
              this.$message({
                message: '请选择送达时间段',
                type: 'warning'
              });
              return
            }
            let estimate = moment(this.ruleForm.date).format("YYYY-MM-DD")
            let start = this.ruleForm.startDate
            let end = this.ruleForm.endDate
            let date = new Date().toString();
            let time = moment(date).format("YYYY-MM-DD HH:mm:ss");
            let packageId = 0
            if(this.dataSource.packages !== null && this.dataSource.packages !== []){
              packageId = this.dataSource.packages[0].id
            }
            if(packageId === 0){
              this.$message({
                message: '包裹信息有误',
                type: 'warning'
              });
              return
            }
            var data = {
              "orderNo": this.parmeter.orderNo,
              "packages": [
                {
                  "packageId": packageId,
                  "expressNo": '',
                  "expressId": -1,
                  "linkman": this.ruleForm.name,
                  "telephone": this.ruleForm.phone,
                  "minDeliveryDate": `${estimate} ${start}`,
                  "maxDeliveryDate": `${estimate} ${end}`
                }
              ],
              "clientVersion": "v1",
              "clientTimespan": time
            }

            ModifyLogisticsInfo.call(this,data).then(res=>{
              if(res.data.code === 1){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.$router.go(0)
              }else{
                this.$message.error(res.data.desc)
              }
            })


          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      contactCancel(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./less/deal.less";
</style>
