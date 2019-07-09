<template>
  <!--接单-->
  <div class="container">
    <div class="main">
      <div class="head-remind">
        <ul>
          <span>重要提醒：</span>
          <li>一、1小时未接单，系统提醒经办人；</li>
          <li>二、2小时未接单，系统提醒负责人；</li>
          <li>三、3小时未接单，客服提醒经办人、负责人；</li>
          <li>四、4小时未接单，系统自动取消订单并退款</li>
        </ul>
      </div>

      <div class="table">
        <el-table :data="fatherSource.goods"
                  style="width: 100%">
          <el-table-column
            label="商品"
            width="480">
            <template slot-scope="scope">
              <div class="goods">
                <img :src="scope.row.image" alt="">
                <div>{{scope.row.title}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="规格">
            <template slot-scope="scope">
              <div class="specification">
                <div>颜色分类：{{scope.row.spec}}</div>
                <div>商品编号：{{scope.row.goodsNo }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数量">
            <template slot-scope="scope">
              <div class="number">{{scope.row.quantity }}件</div>
            </template>
          </el-table-column>
          <el-table-column
            label="金额">
            <template slot-scope="scope">
              <div class="money">{{(scope.row.quantity *(parseFloat(scope.row.sellPrice))).toFixed(2)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <div class="operation">
                <ul>
                  <li class="btnone choose" @click="handleOne(scope.$index,scope.row,scope)">立即接单</li>
                  <li class="btntwo" @click="handleTwo(scope.$index,scope.row,scope)">无货退款</li>
                  <li class="btnthree hide" @click="handleThree(scope.$index,scope.row,scope)">延迟发货</li>
                  <li class="btnfour hide" @click="handleFour(scope.$index,scope.row,scope)">暂时无货</li>
                  <li class="btnfive hide" @click="handleFive(scope.$index,scope.row,scope)">永久无货</li>
                </ul>
              </div>

            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="foot">
        <ul class="foot-left">
          <li v-if="fatherSource.invoiceTitle"><span>发票抬头：</span>{{fatherSource.invoiceTitle }}</li>
          <li v-if="fatherSource.invoiceCode"><span>纳税人识别号：</span>{{fatherSource.invoiceCode }}</li>
          <li v-if="fatherSource.invoiceType"><span>发票类型：</span>{{fatherSource.invoiceType }}</li>
          <!--<li><span>发票内容：</span>{{fatherSource.invoiceTitle }}</li>-->
          <li v-if="validTime(fatherSource.createAt)"><span>下单时间：</span>{{fatherSource.createAt}}</li>
          <li v-if="validTime(fatherSource.payAt)"><span>支付时间：</span>{{fatherSource.payAt}}</li>
        </ul>

        <ul class="foot-right">
          <li>商品总数：{{fatherSource.goods.length}}个</li>
          <li>商品总价：<span></span> ¥ {{ (fatherSource.payment.sellMoney).toFixed(2) }}</li>
          <li>修改价格：<span>-</span> ¥ {{ (fatherSource.payment.shopChangeMoney).toFixed(2) }}</li>
          <li>商品优惠：<span>-</span> ¥ {{ (fatherSource.payment.shopDiscount ).toFixed(2) }}</li>
          <li>店铺优惠：<span>-</span> ¥ {{ (fatherSource.payment.shopCouponMoney ).toFixed(2) }}</li>
          <li>平台优惠：¥ {{ (fatherSource.payment.platActivityMoney ).toFixed(2) }}</li>
          <li>运费: <span>-</span> ¥ {{ (fatherSource.payment.realFreight ).toFixed(2) }}</li>
          <li>订单总额：¥ {{ (fatherSource.payment.realMoney ).toFixed(2) }}</li>
          <li>应收款：<span style="color:#ff6600;">¥  {{ (fatherSource.payment.payMoney + fatherSource.payment.beanMoney + fatherSource.payment.voucherMoney ).toFixed(2) }}</span>
          </li>
        </ul>
      </div>
      <div class="btn">
        <el-button type="primary" v-on:click="AcceptOrder">确认</el-button>
      </div>
    </div>
    <!--弹框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFlag"
      width="400"
      center>
      <!--延迟发货-->
      <div class="delay" v-if="dialogShowType==='delay'">
        <span>重要提醒：</span>
        <p>1、仅能延迟发货1次</p>
        <p>2、延迟发货时间最长为<span>4天</span></p>
        <p>3、<span>12小时</span>内买家不同意则取消订单</p>
        <div class="delay-day"><span class="delay-title">延迟天数：</span>
          <el-select v-model.number="delayDaySelected" id="delayDay" v-on:change="delayDayChange">
            <el-option
              v-for="item in delayDay"
              :key="item.day"
              :label="item.txt"
              :value="item.txt">
            </el-option>
          </el-select>
        </div>
        <div class="delay-date"><span class="delay-title">延迟发货时间：</span>{{delayDayTime}}</div>
      </div>

      <!--暂时无货-->
      <div class="wait" v-if="dialogShowType==='wait'">
        <span>重要提醒：</span>
        <p>1、商品暂时无货请填写无货起止时间（不超过<span>30天</span>）</p>
        <p>2、暂时无货库存清零,用户无法继续购买</p>
        <p>3、到货后商品自动上架</p>
        <div class="wait-date">
          <el-select v-model.number="waitDaySelected" id="waitDayList" v-on:change="waitDayChange">
            <el-option
              v-for="item in waitDayList"
              :key="item.day"
              :label="item.text"
              :value="item.text">
            </el-option>
          </el-select>
        </div>
        <div class="delay-date"><span class="delay-title">到货时间：</span>{{waitDayTime}}</div>
      </div>

      <!--下架审核-->
      <div class="sell" v-if="dialogShowType==='sell'">
        <div class="sell_infor">
          <div class="sell_title"><i>*</i>请选择永久无货的原因及理由：</div>
          <div class="sell_radio">
            <el-radio v-model="sellRadio" label="不经营此商品">不经营此商品</el-radio>
            <el-radio v-model="sellRadio" label="过季，商品下架">过季，商品下架</el-radio>
            <el-radio v-model="sellRadio" label="店面暂停营业">店面暂停营业</el-radio>
            <el-radio v-model="sellRadio" label="生产厂家停产">生产厂家停产</el-radio>
            <el-radio v-model="sellRadio" label="其他">其他</el-radio>
          </div>
          <div class="sell_title"><i>*</i>必须填写下架理由：</div>
          <el-input type="textarea" v-model="sellReason" resize="none" autosize maxlength="50" :autosize="{ minRows: 3}"
                    placeholder="50字以内"></el-input>
          <div class="sell_remind">注：商品下架前平台客服将48小时内通过023-67909399与负责人联系，请保持电话畅通，还可拨打客服热线：400-6766-999</div>
        </div>
      </div>

      <!--其他弹框-->
      <div v-if="dialogShowType==='public'">
        <div style="text-align: center" v-html="dialogValue"></div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="query">确 定</el-button>
        <el-button @click="dialogFlag=false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import _ from 'underscore';
  import GetAcceptOrder from '../../../api/Order/GetAcceptOrder';
  import GetBatchArticleSoldOut from '../../../api/Order/GetBatchArticleSoldOut';
  import GetCancelOrder from '../../../api/Order/GetCancelOrder';
  import ShopReceipt from '../../../api/Order/ShopReceipt';
  import moment from 'moment';

  export default {
    name: "receiveOrder",
    props: ['fatherSource'],
    data() {
      return {
        orderInfo: [], //订单信息
        dialogFlag: false,
        dialogShowType: '',
        dialogTitle: '提示',   //弹框标题
        delayDaySelected: 1,//选中
        delayDayTime: '',
        goodsId: 0,
        delayDay: [
          {day: 0, txt: '请选择'},
          {day: 1, txt: '1'},
          {day: 2, txt: '2'},
          {day: 3, txt: '3'},
          {day: 4, txt: '4'}
        ],
        waitDaySelected: 5,
        waitDayTime: '', //暂时无货时间
        sellSrc: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',   //下架src
        sellRadio: '',
        sellReason: '',  //下架理由
        dialogValue: ``,

      }
    },
    computed: {
      /**
       * 加载暂时无货天数
       */
      waitDayList() {
        let obj = [];
        for (let i = 5; i <= 30; i++) {
          obj.push({day: i, text: i});
        }
        return obj;
      },
    },
    methods: {
      /**
       * 确认订单
       */
      query() {
        /**
         * 延迟发货
         */
        if (this.dialogShowType == "delay") {
          let taskDate = this.delayDaySelected;
          if (taskDate == "请选择") {
            this.$message({showClose: true, message: "请选择延迟天数", type: 'error'});
          } else {
            this.setorderInof(this.goodsId, 2, taskDate);//设置属性
            this.dialogFlag = false;
          }
        }
        /**
         * 暂时无货
         */
        if (this.dialogShowType == "wait") {
          let remindDate = this.waitDayTime;
          if (remindDate == '') {
            this.$message({showClose: true, message: "请选择无货天数", type: 'error'});
          } else {
            this.setorderInof(this.goodsId, 3, 0, '', '', remindDate);//设置属性
            this.dialogFlag = false;
          }
        }
        /**
         * 下架审核
         */
        if (this.dialogShowType == "sell") {
          if (this.sellRadio == '' || this.sellReason == '') {
            this.$message({showClose: true, message: "请选择永久无货的原因及理由", type: 'error'});
          }  else {
            this.setorderInof(this.goodsId, 4, 0, this.sellRadio, this.sellReason);//设置属性
            this.dialogFlag = false;
          }

        }
        /**
         * 确定接单
         */
        if (this.dialogShowType == "public") {
          let date = new Date().toString();
          this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
          let isshow = true;//是否刷新页面
          let orderInfos = [];
            _.forEach(this.orderInfo, item => {
              orderInfos.push({
                articleId: item.articleId,
                goodsId:item.goodsId,
                type: item.index,
                reason: item.reason,
                remindDate: item.remindDate,
                day: item.ycday
              })
            });

            let obj ={
              orderId:this.fatherSource.orderId,
              rowver:this.fatherSource.rowVer,
              orderInfos:orderInfos,
              clientTimespan:this.time
            };
          ShopReceipt.call(this, obj).then(response => {
                if (response.status === 200 && response.data.code === 1) {
                  isshow = true;
                } else {
                  isshow = false;
                  this.$message({showClose: true, message: response.data.desc, type: 'error'});
                }
           });

          if (isshow) {
            this.dialogFlag = false;//关闭弹出框
            this.$message({message: '接单成功', type: 'success'});
            setInterval(() => {
                    window.location.reload();
                  }, 2000);
          }
        }
      },
      /**
       * 根据选择延迟发货天数自动计算出发货的时间
       */
      delayDayChange(goodsId) {
        let time = moment();
        if (this.fatherSource.state === 250 && this.validTime(this.fatherSource.latestTaskDate)) {
          time = new moment(this.fatherSource.latestTaskDate);
        }
        let taskDate = this.delayDaySelected;
        if (this.fatherSource.state === 200) {
          //是否全球购商品
          let isGlobalType = this.fatherSource.goods[0].isGlobalType;
          //默认任务时间
          let defaultDate = isGlobalType ? 5 : 2;
          taskDate += defaultDate;
        }
        this.delayDayTime = time.add(taskDate, "day").format("YYYY-MM-DD HH:mm:ss");
      },
      /**
       * 根据选择暂时无货天数自动计算出无货的时间
       */
      waitDayChange() {
        let time = moment();
        let taskDate = this.waitDaySelected;
        this.waitDayTime = time.add(taskDate, "day").format("YYYY-MM-DD HH:mm:ss");
      },
      /**
       *时间判断
       */
      validTime(date) {
        return date && date !== "1900-01-01 00:00:00";
      },

      /**
       * 立即接单
       * @param index
       * @param row
       * @param scope
       */
      handleOne(index, row, scope) {
        this.goodsId = row.goodsId;
        this.setorderInof(row.goodsId, 1, index);//设置属性
        this.setBtnCss(index, 'btnone');
      },
      /**
       * 无货退款
       * @param index
       * @param row
       * @param scope
       */
      handleTwo(index, row, scope) {
        document.getElementsByClassName('btntwo')[index].classList.add('hide');
        document.getElementsByClassName('btnthree')[index].classList.remove('hide');
        document.getElementsByClassName('btnfour')[index].classList.remove('hide');
        document.getElementsByClassName('btnfive')[index].classList.remove('hide');
      },
      /**
       * 延迟发货
       * @param index
       * @param row
       * @param scope
       */
      handleThree(index, row, scope) {
        this.goodsId = row.goodsId;//设置选中的商品
        this.setBtnCss(index, 'btnthree');//设置选中状态
        this.delayDayChange(row.goodsId);//设置默认延迟时间
        this.setorderInof(row.goodsId,2);//延迟发货
        this.dialogTitle = '延迟发货';
        this.dialogShowType = 'delay';
        this.dialogFlag = true;
      },
      /**
       * 暂时无货  wait
       * @param index
       * @param row
       * @param scope
       */
      handleFour(index, row, scope) {
        this.goodsId = row.goodsId;
        this.waitDayChange();
        this.setBtnCss(index, 'btnfour');//设置选中状态
        this.setorderInof(row.goodsId, 3);//暂时无货
        this.dialogTitle = '暂时无货';
        this.dialogShowType = 'wait';
        this.dialogFlag = true;
      },
      /**
       * 永久无货  sell
       * @param index
       * @param row
       * @param scope
       */
      handleFive(index, row, scope) {
        this.sellRadio = '';
        this.sellReason = '';
        this.goodsId = row.goodsId;
        this.setBtnCss(index, 'btnfive');//设置选中状态
        this.setorderInof(row.goodsId, 4);//永久无货
        this.dialogTitle = '下架审核';
        this.dialogShowType = 'sell';
        this.dialogFlag = true;
      },

      /**
       * 设置选中状态
       * @param index
       * @param type  按钮名称
       */
      setBtnCss(index, type) {
        this.clearState(index);
        document.getElementsByClassName(type)[index].classList.add('choose');//添加选中效果
      },
      /**
       * 设置都没选中
       * @param index
       */
      clearState(index) {
        document.getElementsByClassName('btnone')[index].classList.remove('choose');
        document.getElementsByClassName('btnthree')[index].classList.remove('choose');
        document.getElementsByClassName('btnfour')[index].classList.remove('choose');
        document.getElementsByClassName('btnfive')[index].classList.remove('choose');
      },
      /**
       * 设置属性
       * @param articleId
       * @param goodsId
       * @param index
       */
      setorderInof(goodsId, index, day, cause, reason, remindDate) {
        if (this.orderInfo.length > 0) {
          for (let i = 0; i < this.orderInfo.length; i++) {
            if (this.orderInfo[i]["goodsId"] == goodsId) {
              this.orderInfo[i]["index"] = index;
              if (day != null && day != '') {
                this.orderInfo[i]["ycday"] = day;
              } else {
                this.orderInfo[i]["ycday"] = 0;
              }
              if (cause != null && cause != '') {
                this.orderInfo[i]["cause"] = cause;
              } else {
                this.orderInfo[i]["cause"] = '';
              }
              if (reason != null && reason != '') {
                this.orderInfo[i]["reason"] = reason;
              } else {
                this.orderInfo[i]["reason"] = '';
              }
              if (remindDate != null && remindDate != '') {
                this.orderInfo[i]["remindDate"] = remindDate;
              } else {
                this.orderInfo[i]["remindDate"] = '';
              }
            }
          }
        }
      },
      /**
       * 确认接单
       * @constructor
       */
      AcceptOrder() {
        let noselectCount = _.chain(this.orderInfo).select(x => x.index == 0).value().length;//未选择数量
        if (noselectCount > 0) {
          this.$message({showClose: true, message: "请选择需要接单的商品", type: 'error'});
        } else {
          let source = _.chain(this.orderInfo).select(x => x.index == 4).value();//永久无货
          if (source !=null && source.length>0)
          {
            for (let i = 0; i < source.length; i++) {
              if (source[i]["reason"] =='' || source[i]["cause"] =='')
              {
                let number = source[i]["number"];
                this.$message({showClose: true, message: "第"+number+"个商品，请选择永久无货的原因及理由", type: 'error'});
                return false;
              }
            }
          }
          let Orderdelayvalue = _.chain(this.orderInfo).select(x => x.index == 2).value();//延迟发货商品
          if (Orderdelayvalue !=null && Orderdelayvalue.length>0)
          {

            for (let i =0;i< Orderdelayvalue.length;i++)
            {
              if (Orderdelayvalue[i]["ycday"] =="0")
              {
                let number = Orderdelayvalue[i]["number"];
                this.$message({showClose: true, message: "第"+number+"个商品，请选择延迟天数,并点击确定按钮。", type: 'error'});
                return false;
              }
            }
          }
          let temporaryvalue = _.chain(this.orderInfo).select(x => x.index == 3).value();//暂时无货商品数量
          if (temporaryvalue !=null && temporaryvalue.length>0)
          {
            for (let i =0;i< temporaryvalue.length;i++)
            {
              if (temporaryvalue[i]["remindDate"] =='')
              {
                let number = temporaryvalue[i]["number"];
                this.$message({showClose: true, message: "第"+number+"个商品，请设置上架提醒时间,并点击确定按钮。", type: 'error'});
                return false;
              }
            }
          }
          let ReceiveCount = _.chain(this.orderInfo).select(x => x.index == 1).value().length;//接单商品数量
          let delayCount = _.chain(this.orderInfo).select(x => x.index == 2).value().length;//延迟发货商品数量
          let temporaryCount = _.chain(this.orderInfo).select(x => x.index == 3).value().length;//暂时无货商品数量
          let permanentCount = _.chain(this.orderInfo).select(x => x.index == 4).value().length;//永久无货商品数量
          let str = '';
          if (ReceiveCount > 0) {
            str += ReceiveCount + "个商品立即接单,";
          }
          if (delayCount > 0) {
            str += delayCount + "个商品延迟发货,";
          }
          if (temporaryCount > 0) {
            str += temporaryCount + "个商品暂时无货,";
          }
          if (permanentCount > 0) {
            str += permanentCount + "个商品永久无货,";
          }
          this.dialogValue = str + "请确认";
          this.dialogTitle = '您已选择';
          this.dialogShowType = 'public';
          this.dialogFlag = true;
        }
      }
    },
    created() {
      //处理商品列表
      let number =0;
      _.forEach(this.fatherSource.goods, item => {
        number++;
        this.orderInfo.push({
          number :number,
          articleId: item.articleId,
          goodsId: item.goodsId,
          index: 1,
          remindDate: '',//上架提醒时间
          ycday: 0,//延迟天数
          cause: '',//原因
          reason: '' //理由
        })
      });
    }
  }
</script>

<style lang="less" scoped>
  @import "less/receiveOrder.less";
</style>
