<template>
  <div class="ship">
    <div class="block">
      <div class="title">
        <strong>第一步：确认交易详情</strong>
      </div>
      <div class="main">
        <div style="margin-bottom: 10px;color: #666">
          <span style="margin-right: 30px">订单号：{{table_data.order_no}}</span>
          <span>创建时间：{{table_data.add_time}}</span>
        </div>
        <div class="tips">
          <strong>快递：</strong>
          买家选择【快递】运送方式，在不影响送达时间的情况下，可视情况自行调整运送方式
        </div>
        <el-table
          border
          :data="table_data.expressGoods"
          :header-cell-style="{backgroundColor: '#f1f1f3', color: '#000', textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="product"
            label="商品">
            <template slot-scope="scope">
              <div style="text-align: left;">
                <img :src="scope.row.img_url" alt="" style="vertical-align: middle; margin-right: 10px;" width="100">
                <span>{{scope.row.goods_title}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="guige"
            label="规格"
            width="250">
            <template slot-scope="scope">
              <div>颜色分类：{{scope.row.spec_text}}</div>
              <div style="font-size: 0.8em; color: #999">商品编码：{{scope.row.goods_no}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="real_price"
            label="单价"
            width="250">

          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            width="250">

          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="合计"
            width="250">

          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block">
      <div class="title">
        <strong>第二步：确认发票信息</strong>
      </div>
      <div class="main">
        <el-row class="invoice" v-if="table_data.isInvoice">
          <el-col span="6" v-if="table_data.invoiceType == 2 ">
            <div style="padding: 0 10%">
              <el-form label-width="100px" label-position="right">
                <el-form-item label="发票类型：">
                  <span class="s-color">个人</span>
                </el-form-item>
                <el-form-item label="发票内容：">
                  <span class="s-color">{{ table_data.invoiceTitle }}</span>
                </el-form-item>
                <!--<el-form-item label="邮箱：">-->
                <!--<span class="s-color">644456451@qqcom</span>-->
                <!--</el-form-item>-->
                <el-form-item label="手机：">
                  <span class="s-color">{{ table_data.mobile  }}</span>
                </el-form-item>
                <el-form-item label="">
                  <!--<el-button type="primary" size="medium" @click="submit('1')">确认开票</el-button>-->
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col span="6">
            <div style="padding: 0 10%; " v-if="table_data.invoiceType == 1 ">
              <el-form label-width="120px" label-position="right" class="invoice">
                <el-form-item label="发票类型：">
                  <span class="s-color">企业</span>
                </el-form-item>
                <el-form-item label="发票内容：">
                  <span class="s-color">{{table_data.invoiceTitle }}</span>
                </el-form-item>
                <el-form-item label="纳税人识别号：">
                  <span class="s-color">{{table_data.invoiceCode }}</span>
                </el-form-item>
                <el-form-item label="公司：">
                  <span class="s-color">满集网</span>
                </el-form-item>
                <el-form-item label="">
                  <!--<el-button type="primary" size="medium" @click="submit('2')">确认开票</el-button>-->
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <!--<el-col span="6">-->
          <!--<div style="padding: 0 10%">-->
          <!--<el-form label-width="120px" label-position="right" class="invoice">-->
          <!--<el-form-item label="发票类型：">-->
          <!--<span class="s-color">企业</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="发票内容：">-->
          <!--<span class="s-color">商品明细</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="纳税人识别号：">-->
          <!--<span class="s-color">644456451@qqcom</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="单位名称：">-->
          <!--<span class="s-color">满集网</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="">-->
          <!--<el-button type="primary" size="medium" @click="submit('3')">确认发货</el-button>-->
          <!--</el-form-item>-->
          <!--</el-form>-->
          <!--</div>-->
          <!--</el-col>-->
          <!--<el-col span="6">-->
          <!--<div style="padding: 0 10%">-->
          <!--<el-form label-width="100px" label-position="right">-->
          <!--<el-form-item label="收件人：">-->
          <!--<span class="s-color">张三</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="收货地址：">-->
          <!--<span class="s-color">重庆市重庆市重庆市重庆市重庆市</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="联系方式：">-->
          <!--<span class="s-color">123456789</span>-->
          <!--</el-form-item>-->
          <!--</el-form>-->
          <!--</div>-->
          <!--</el-col>-->
        </el-row>

        <el-row class="invoice" v-else>
          <strong>暂无发票信息</strong>
        </el-row>
      </div>
    </div>
    <div class="block">
      <div class="title">
        <strong>第三步：确认收货信息</strong>
      </div>
      <div class="main">
        <strong class="strong-title">收货信息</strong>
        <div>收货人：<span class="s-color">{{table_data.accept_name}}</span></div>
        <div>收货电话：<span class="s-color">{{table_data.mobile}}</span></div>
        <div>收货地址：<span class="s-color">{{table_data.address}}</span></div>
      </div>
    </div>
    <div class="block">
      <div class="title">
        <strong>第四步：确认物流服务</strong>
      </div>
      <div class="main">
        <el-radio-group v-model="delivery_type">
          <el-radio label="1">快递</el-radio>
          <el-radio label="2">物流</el-radio>
          <el-radio label="3">商家自送</el-radio>
        </el-radio-group>
        <div style="margin-top: 20px;">
          <el-form label-width="150px" v-show="delivery_type === '1'">
            <el-form-item label="选择快递公司：" class="custom-require">
              <el-select placeholder="请选择快递公司" style="width: 250px;" v-model="expressCompanyId"
                         @change="changeExpress()">
                <el-option v-for="(item,i) in expressCompany" :key="i" :value="item.id" :label="item.title"
                           ref="expressItem">
                  {{item.title}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="填写运单编号：" class="custom-require">
              <el-input placeholder="请填写运单编号" style="width: 250px;" v-model="expressCode"></el-input>
            </el-form-item>
          </el-form>
          <el-form v-show="delivery_type === '2'" label-width="150px">
            <el-form-item label="选择物流公司：" class="custom-require">
              <el-select placeholder="请选择物流公司" style="width: 250px;" v-model="logisticsCompanyId"
                         @change="changeLogistics()">
                <el-option v-for="(item,i) in expressCompany" :key="i" :value="item.id" :label="item.title">
                  {{item.title}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="填写运单编号：" class="custom-require">
              <el-input placeholder="请填写运单编号" style="width: 250px;" v-model="logisticsCode"></el-input>
            </el-form-item>
          </el-form>
          <el-form v-show="delivery_type === '3'" label-width="150px">
            <el-form-item :rules="{ type: 'number', message: '请输入正确联系方式'}" label="送货人电话：" class="custom-require">
              <el-input placeholder="请输入送货人联系电话" style="width: 250px;" v-model="sendByshop.contact" ></el-input>
            </el-form-item>
            <el-form-item label="送货人姓名：" class="custom-require">
              <el-input placeholder="请输入送货人姓名" style="width: 250px;" v-model="sendByshop.contactName"></el-input>
            </el-form-item>
            <el-form-item label="预计送达时间：" class="custom-require">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 250px;"
                placeholder="请选择送达时间"
                v-model="sendByshop.arriveTime"
                @change="dateChange()"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="送达时间段：" class="custom-require">
              <el-time-select
                style="width: 120px;"
                placeholder="起始时间"
                v-model="sendByshop.startTime" :picker-options="{ minTime: sendByshop.startTime }">
              </el-time-select>
              <el-time-select
                style="width: 120px;"
                placeholder="结束时间"
                v-model="sendByshop.endTime"
                :picker-options="{
                  minTime: sendByshop.startTime
                }">
              </el-time-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="block">
      <el-button type="primary" size="medium" @click="submitForm(delivery_type)">发货</el-button>
      <!--<el-button type="primary" size="medium" @click="delayGoods()">延迟发货</el-button>-->
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
    </div>
    <!--    弹出层-->
    <!--    快递-->
    <el-dialog
      title="请核对快递信息"
      :visible.sync="delivery_dialog1"
      width="500px">
      <div>
        <el-form label-width="120px;" class="invoice" style="width: 300px;margin: 0 auto;">
          <el-form-item label="快递公司：">
            <div style="font-size: 14px;">{{expressCompanyName}}</div>
          </el-form-item>
          <el-form-item label="快递单号：">
            <div style="font-size: 14px;">{{expressCode}}</div>
          </el-form-item>
          <!--<el-form-item label="发票快递公司：">-->
          <!--<div style="font-size: 1.2em;">中通快递</div>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="发票快递单号：">-->
          <!--<div style="font-size: 1.2em;">4546546546546</div>-->
          <!--</el-form-item>-->
        </el-form>
        <div style="margin-top: 20px;">注：若有易碎商品请务必包装后进行发货，以免商品运输过程中导致损坏</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delivery_dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="sendGoods(expressCompanyId,expressCode)">确 定</el-button>
      </span>
    </el-dialog>
    <!--    物流-->
    <el-dialog
      title="请核对物流信息"
      :visible.sync="delivery_dialog2"
      width="500px">
      <div>
        <el-form label-width="120px;" class="invoice" style="width: 300px;margin: 0 auto;">
          <el-form-item label="物流公司：">
            <div style="font-size: 14px;">{{logisticsCompanyName}}</div>
          </el-form-item>
          <el-form-item label="物流单号：">
            <div style="font-size: 14px;">{{logisticsCode}}</div>
          </el-form-item>
          <!--<el-form-item label="发票快递公司：">-->
          <!--<div style="font-size: 1.2em;">中通快递</div>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="发票快递单号：">-->
          <!--<div style="font-size: 1.2em;">4546546546546</div>-->
          <!--</el-form-item>-->
        </el-form>
        <div style="margin-top: 20px;">注：若有易碎或大件商品请务必包装后进行发货，以免商品运输过程中导致损坏</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delivery_dialog2 = false">取 消</el-button>
        <el-button type="primary" @click="sendGoods(logisticsCompanyId,logisticsCode)">确 定</el-button>
      </span>
    </el-dialog>
    <!--    自送-->
    <el-dialog
      title="提示"
      :visible.sync="delivery_dialog3"
      width="500px">
      <div>
        <el-form label-width="120px;" class="invoice" style="width: 400px;margin: 0 auto;">
          <el-form-item label="配送方式：">
            <div style="font-size: 14px;">商家自送</div>
          </el-form-item>
          <el-form-item label="联系电话：">
            <div style="font-size: 14px;">{{sendByshop.contact}}</div>
          </el-form-item>
          <el-form-item label="预送达时间：">
            <div style="font-size: 14px;">{{sendByshop.arriveTime +" "+ sendByshop.startTime}} ~
              {{sendByshop.arriveTime+" "+ sendByshop.endTime}}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delivery_dialog3 = false">取 消</el-button>
        <el-button type="primary" @click="sendGoods(-1,'')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import GetUnshippedGoods from '../../../api/Order/GetUnshippedGoods';//获取待发货详情
  import Shipped from '../../../api/Order/Shipped';//发货
  import moment from 'moment'
  import GetValidExpressCompanyList from '../../../api/Order/GetValidExpressCompanyList';//获取商家已经配置了物流模板的快递公司列表
  import GetExpressListByPage from '../../../api/Order/GetExpressListByPage';//获取物流方式列表


  export default {
    name: "ship",
    data() {
      return {
        multipleSelection: [],
        delivery_dialog1: false,
        delivery_dialog2: false,
        delivery_dialog3: false,
        delivery_type: '1',
        time: '',
        table_data: {
          expressGoods: []
        },
        expressCompany: [],
        parmeter: {
          orderNo: this.$route.query.orderNo,
          type: "goods"
        },
        expressCompanyName: '', //快递公司
        expressCompanyId: '', //快递公司Id
        expressCode: '', //快递单号

        logisticsCompanyName: '', //物流公司
        logisticsCompanyId: '', //物流公司Id
        logisticsCode: '', //物流单号

        sendByshop: {   //商家自送对象
          contact: '',
          contactName: '',
          arriveTime: '',
          startTime: '',
          endTime: ''
        }
      }
    },
    mounted() {
      this.initdata();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      submitForm(type) {
        this.delivery_type = type;
        //验证是否选择配送商品
        if (this.multipleSelection.length === 0) {
          this.$message({
            showClose: true,
            message: '请选择发货商品',
            type: 'error'
          });
          return false;
        }
        //商家自送
        if (this.delivery_type  === '3' ){
          if ( this.sendByshop.contact === '' || this.sendByshop.contactName==='' || this.sendByshop.arriveTime === '' || this.sendByshop.startTime  === ''|| this.sendByshop.endTime === '')
          {
            this.$message({
              showClose: true,
              message: '请填写完整商家配送信息',
              type: 'error'
            });
            return false;
          }
        }
        else if(this.delivery_type  === '1'){
          //快递
       if(this.expressCode === ''  ||  this.expressCompanyId === ''){
          this.$message({
            showClose: true,
            message: '请填写完整快递信息',
            type: 'error'
          });
          return false;
        }
        }
        else if(this.delivery_type  === '2'){
          //物流
       if(this.logisticsCode === ''  ||  this.logisticsCompanyId === ''){
          this.$message({
            showClose: true,
            message: '请填写完整物流信息',
            type: 'error'
          });
          return false;
        }
        }

        switch (type) {
          case "1": //快递
            this.delivery_dialog1 = true;
            break;
          case "2": //物流
            this.delivery_dialog2 = true;
            break;
          case "3": //商家自送
            this.delivery_dialog3 = true;
            break;
        }
      },

      initdata() {
        let date = new Date().toString();
        this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
        GetUnshippedGoods.call(this, `?orderNo=${this.parmeter.orderNo}&orderType=${this.parmeter.type}&clientTimespan=${this.time}`).then(res => {
          if (res.data.code === 1) {
            this.table_data = res.data.data;
          }
        });

        GetExpressListByPage.call(this, `?clientTimespan=${this.time}`).then(res => {
          if (res.data.code === 1) {
            this.expressCompany = res.data.data.list;
          }
        })
      },
      changeExpress() {
        this.expressCompanyName = this.expressCompany.find(i => i.id == this.expressCompanyId).title;
      },
      changeLogistics() {
        this.logisticsCompanyName = this.expressCompany.find(i => i.id == this.logisticsCompanyId).title;
      },
      // 发货
      sendGoods(expressId, expressCode) {
        let selectGoods = [];
        for (let j = 0; j < this.multipleSelection.length; j++) {
          selectGoods.push(this.multipleSelection[j].goods_id)
        }
        let date = new Date().toString();
        let sendtime = moment(date).format("YYYY-MM-DD HH:mm:ss");

        let model = {
          expressId: expressId,
          expressNo: expressCode,
          linkman: this.sendByshop.contactName,
          telephone: this.sendByshop.contact,
          minDeliveryDate: this.sendByshop.arriveTime == "" ? sendtime : this.sendByshop.arriveTime + " " + this.sendByshop.startTime,
          maxDeliveryDate: this.sendByshop.arriveTime == "" ? sendtime : this.sendByshop.arriveTime + " " + this.sendByshop.endTime,
          orderNo: this.parmeter.orderNo,
          orderGoodsId: selectGoods,
          orderType: this.parmeter.type,
          rowver: this.table_data.rowVer,
          clientVersion: "v1",
          clientTimespan: this.time
        };
        console.log(model);
        Shipped.call(this, model).then(res => {
          if (res.data.code === 1) {
            this.$message({
              showClose: true,
              message: '商品发货成功，请及时跟踪快递/物流信息',
              type: 'success'
            });
            this.$router.push({path: 'OrderList'})
          }
          else {
            this.$confirm("请确认发货信息无误", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
          }
        })
      },
      dateChange(){
        this.sendByshop.startTime = '';
        let selectTime = this.sendByshop.arriveTime;
        let nowTime = moment(new Date()).format("YYYY-MM-DD")
        if(selectTime === nowTime){
          this.sendByshop.startTime =  moment(new Date()).format('HH:mm');
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .ship {
    .block {
      margin-bottom: 20px;

      .title {
        border-bottom: 1px solid #00a2ff;

        strong {
          display: inline-block;
          padding: 10px;
          background-color: #00a2ff;
          color: #fff;
          border-radius: 5px 5px 0 0;
        }
      }

      .main {
        background-color: #fff;
        overflow: auto;
        padding: 15px;

        .s-color {
          color: #666;
        }

        .tips {
          padding: 10px;
          background-color: #fef8f2;
          color: #ff6600;
        }

        .strong-title {
          width: 100%;
          display: inline-block;
          margin-bottom: 10px;
          border-bottom: 1px solid #c1c1c1;
          padding: 10px 0;
          font-size: 1.2em;
        }
      }
    }

    .invoice .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
<style lang="less">
  .custom-require label.el-form-item__label {
    position: relative;

    &:before {
      content: "*";
      position: relative;
      color: red;
      font-size: 1.5em;
      right: 5px;
      top: 7px;
    }
  }
</style>
