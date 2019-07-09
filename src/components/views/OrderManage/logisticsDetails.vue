<template>
  <!--查看物流详情-->
  <div class="container">
    <div class="main">
      <ul class="ul_title">
        <li>订单编号： {{query.orderNo}}</li>
        <li> 运单号：{{ packageInfo.expressNo}} </li>
        <li>物流公司：{{ packageInfo.expressName}}</li>
        <el-button type="primary" @click="dialogVisible = true">修改物流</el-button>
      </ul>
      <ul class="btn" v-show="this.packages.length >= 1">
        <li @click="currentPackage=index" :class="{ click: index === currentPackage }"  v-for="(item,index) in dataSource.packages">包裹{{index + 1}}</li>
      </ul>
      <div class="line"></div>
      <div class="list">
        <ul>
          <li v-for="(item,i) in packageInfo.expressContextList">
            <em v-if="i === packageInfo.expressContextList.length - 1"></em>
            <i class="node-icon"></i>
            <div>
              <span>{{item.time}}</span>
              <div>{{item.content}}</div>
            </div>
          </li>
        </ul>

      </div>
      <ul class="info">
        <li>收货信息：<span>{{dataSource.address}}</span> <span>,{{dataSource.postCode}},{{dataSource.acceptName}}</span></li>
        <li v-if="addr.sendAddr">发货信息：<span>{{addr.sendAddr.address}} </span><span>{{addr.sendAddr.zipCode}} </span><span>{{addr.sendAddr.name}}  </span><span>{{addr.sendAddr.mobile}} </span></li>
        <li  v-if="addr.returnAddr">退货信息：<span>{{addr.returnAddr.address}} </span><span>{{addr.returnAddr.zipCode}}</span><span>{{addr.returnAddr.name}}  </span><span>{{addr.returnAddr.mobile}} </span></li>
      </ul>

      <ul class="show">
        <li v-for="item in packageInfo.goods">
          <img :src="item.goodsImage" />
          <div>{{item.goodsTitle}}</div>
          <span>{{item.quantity}}件</span>
        </li>
      </ul>
    </div>


    <el-dialog
      title="修改物流"
      :visible.sync="dialogVisible"
      width="440px"
      class="dialogVisible-demo"
    >
      <div class="dialogVisible-amend">
        <ul>
          <li>
            <span>物流公司：</span>

            <div style="margin-left: -4px;">
              <el-cascader style="width: 280px;"
                v-model="logisticsAmendForm.company"
                placeholder="请选择快递公司"
                :options="optionsList"
                :show-all-levels="false"
              ></el-cascader>
            </div>
          </li>
          <li><span>物流单号：</span><div><el-input style="width: 280px;" v-model="logisticsAmendForm.code" placeholder="请填写物流单号"></el-input></div></li>
          <div class="explain">*注：商品订单在发货后的12小时内可修改，超时不予修改，物流单号仅限修改一次</div>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="dlogisticsAmendSure()">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import GetExpressInfo from '../../../api/Order/GetExpressInfo';//获取物流
  import GetDefaultAddress from '../../../api/goods/goodsPublish/GetDefaultAddress';
  import GetExpressCompanyList from '../../../api/Order/GetExpressCompanyList' //获取商家支持的物流
  import ModifyLogisticsInfo from '../../../api/Order/ModifyLogisticsInfo'
  import moment from 'moment';
  export default {
    name: "logisticsDetails",
    data(){
      return {
        dataSource:{
          address:'',
          postCode:'',
          acceptName:''
        },
        addr: {},
        currentPackage: 0,
        packages:[],
        query: {
          orderNo: this.$route.query.orderNo,
          type: this.$route.query.type
        },
        dialogVisible:false,
        logisticsCode:'',
        optionsList: [],
        value: '',
        logisticsAmendForm: {
          code: '',
          company: [],
        },
        packageId:0,
      }
    },
    methods:{
      initData(){
        let date = new Date().toString();
        this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
        GetExpressInfo.call(this,`?input.orderNo=${this.query.orderNo}&input.orderType=${this.query.type}&input.clientTimespan=${this.time}`).then(res=> {
          if (res.status === 200 && res.data.code === 1) {
            this.dataSource = res.data.data;
            this.packages =this.dataSource.packages;
            if(this.packages[0]!==null){
              this.packageId = this.packages[0].packageId
            }
          } else {
            this.$message({showClose: true, message: "加载数据失败", type: 'error'});
          }
        })

        let d = new Date().toString();
        let time = moment(d).format("yyyy-MM-dd HH:mm:ss");
        GetExpressCompanyList.call(this,`?input.clientVersion=v1&input.clientTimespan=${time}`).then(res=>
        {
          if(res.data.code === 1){
            let data = res.data.data
            this.optionsList = data
          }else{
            this.$message.error(res.data.desc);
          }
        });
      },
      dlogisticsAmendSure(){
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
        if(this.packageId === 0){
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
          "orderNo": this.query.orderNo,
          "packages": [
            {
              "packageId": this.packageId,
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
      },
      //加载商家发货地址
      initDefaultAddr() {
        let date = new Date().toString();
        this.time = moment(date).format("YYYY-MM-DD HH:mm:ss");
        GetDefaultAddress.call(this,`?input.clientTimespan=${this.time}`).then(res=> {
          if (res.status === 200 && res.data.code === 1) {
            this.addr = res.data.data;
          } else {
            this.$message({showClose: true, message: "加载数据失败", type: 'error'});
          }
        });
      }
    },
    computed: {
      packageInfo() {
        return this.packages[this.currentPackage];
      }
    },
    mounted() {
      console.log('68674684684')
      this.initData();
      this.initDefaultAddr();
    },
  }
</script>

<style lang="less" scoped>
  @import "less/logisticsDetails.less";
</style>
