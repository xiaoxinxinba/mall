<template>
  <!--物流设置免费-->
  <div class="container">
    <div class="remind">
      <div><span>重要提醒：</span>通常免配送费会增加商品成交量，但设置了免费配送的请按用户要求进行免费配送，否则会影响店铺信誉，且因商品运费造成的用户纠纷由商家自行负责， 请设置前咨询当地物流公司后慎重考虑<el-button type="primary" size="mini">确定</el-button></div>
    </div>
    <div class="main">
      <div class="free-postage"  v-show="type === '快递'">我要包邮</div>

      <div v-show="type === '物流'">
        <div class="stage">
          <span class="title">物流配送阶段指示图：</span>
          <ul class="stage-ul">
            <li></li>
            <span style="left: -6px;"></span>
            <li class="now" style="left: -12px;"></li>
            <span style="left: -18px;"></span>
            <li class="wait" style="left: -24px;"></li>
            <span style="left: -30px;"></span>
            <li class="last"  style="left: -36px;"></li>
            <span style="left: -42px;"></span>
            <li class="last" style="left: -48px;"></li>
          </ul>
        </div>
        <ul class="stage-content">
          <li>卖家发货</li>
          <li class="cur-stage" style="margin-left: 30px;">买家所在城市市区</li>
          <li style="margin-left: 35px;">送货到楼下</li>
          <li style="margin-left: 60px;">上楼</li>
          <li style="margin-left: 85px;">安装</li>
        </ul>
      </div>


      <div class="free">
        <span class="title">{{type === '快递'?'请选择包邮地区：':'我要免费配送：'}}</span>
        <div class="free-btn"><el-button type="primary" icon="el-icon-circle-plus-outline" @click="addArea">{{type === '快递'?'添加地区':'新增地区'}} </el-button></div>

        <div class="free-right">
          <div class="free-area">
            <div class="free-area-title">指定免费配送地区：</div>
            <div class="free-area-content">{{freeAreaString}}</div>
          </div>
          <div class="free-remind">
            <div class="free-remind-left" @click="freightSet = true">+为非指定地区设置运费</div>
            <div class="free-remind-right">温馨提示：物流公司重量折体积为：200kg=[长*宽*高/6000]m³</div>
          </div>
        </div>
      </div>
      <div class="valuation" v-show="freightSet">
        <span class="title"><i>*</i>计价方式：</span>
        <el-radio v-model="radio" label='0'>按重量</el-radio>
        <el-radio v-model="radio" label='3'>按体积</el-radio>
        <el-radio v-model="radio" label='2' v-show="type === '快递'">按件数</el-radio>
      </div>
<!--      <div class="freight-set">-->
<!--        <span class="title"><i>*</i>设置运费：</span>-->
<!--        <div class="freight-set-right" v-show="radio === '3'">-->
<!--          <span>首体积</span><input type="text" v-model="start"><span>m³，首费</span><input type="text" v-model="startPrice">-->
<!--          <span>元，续体积</span><input type="text" v-model="augment"><span>m³，续费</span><input type="text" v-model="augmentPrice"><span>元</span>-->
<!--        </div>-->
<!--        <div class="freight-set-right" v-show="radio === '0'">-->
<!--          <span>首重量</span><input type="text" v-model="start"><span>kg，首费</span><input type="text" v-model="startPrice">-->
<!--          <span>元，续重量</span><input type="text" v-model="augment"><span>kg，续费</span><input type="text" v-model="augmentPrice"><span>元</span>-->
<!--        </div>-->
<!--        <div class="freight-set-right" v-show="radio === '2'" >-->
<!--          <span>首件数</span><input type="text" v-model="start"><span>件，首费</span><input type="text" v-model="startPrice">-->
<!--          <span>元，续件数</span><input type="text" v-model="augment"><span>件，续费</span><input type="text" v-model="augmentPrice"><span>元</span>-->
<!--        </div>-->

<!--      </div>-->
      <div class="freight-set" v-show="freightSet">

          <span class="title"><i>*</i>收费标准：</span>
          <div class="freight-set-right" v-show="radio === '3'">
            <span>首体积</span><input type="text" v-model="start"><span>m³，首费</span><input type="text" v-model="startPrice">
            <span>元，续体积</span><input type="text" v-model="augment"><span>m³，续费</span><input type="text" v-model="augmentPrice"><span>元</span>
          </div>
          <div class="freight-set-right" v-show="radio === '0'">
            <span>首重量</span><input type="text" v-model="start"><span>kg，首费</span><input type="text" v-model="startPrice">
            <span>元，续重量</span><input type="text" v-model="augment"><span>kg，续费</span><input type="text" v-model="augmentPrice"><span>元</span>
          </div>
          <div class="freight-set-right" v-show="radio === '2'" >
            <span>首件数</span><input type="text" v-model="start"><span>件，首费</span><input type="text" v-model="startPrice">
            <span>元，续件数</span><input type="text" v-model="augment"><span>件，续费</span><input type="text" v-model="augmentPrice"><span>元</span>
          </div>

      </div>
      <div class="footer-btn">
        <el-button type="primary" @click="submitData">保存</el-button>
        <el-button type="info" @click="goBack">取消</el-button>
      </div>
      <div class="skip"><span @click="skip">跳过，我要收费配送</span></div>
    </div>

    <ChooseArea :dialog="childData" @dialogShow="dialogState" @checkedCode="getCheckedCoe"></ChooseArea>
  </div>
</template>

<script>
  import ChooseArea from './chooseArea';
  import saveOrUpdateTemplate from '../../../../api/goods/logistics/addOrUpdateExpressTemplate';
  export default {
    name: "logisticsFree",
    components:{
      ChooseArea,
    },
    data(){
      return{
        radio:'0',
        freightSet:false,
        upDown:false,   //
        curCode:-1,
        isDialog:false,
        childData:{
          flag:false,
          isHead:0,
          areaTitle:'选择免费配送区域',
        },
        type:this.$route.query.type,

        freeAreaString: '',
        freeAreaCode: [],
        start: '',
        startPrice: '',
        augment: '',
        augmentPrice: '',
      }
    },
    rules:{
      start:[{required: true, message: '请输入',trigger: 'blur'}],
    },
    methods:{

      addArea(){
        this.isDialog=true;
        this.childData.flag=true;
      },
      dialogState(val){
        this.isDialog=val;
      },
      skip(){
        this.$router.push({name:'LogisticsCharge',query:{type:this.type}});
      },
      //取消
      goBack() {
        this.$router.push({name:'LogisticsList',query:{type:this.$route.query.type}});
      },
      // save(){
      //   if(this.type === '快递'){
      //     this.$router.push({name:'LogisticsCharge',query:{type:'快递'}});
      //   }else{
      //     this.$router.push({name:'ExpressCharge',query:{type:'物流'}});
      //   }
      // },
      getCheckedCoe(val){
        this.freeAreaString = val.names.join("、");
        this.freeAreaCode = val.codes;
      },

      submitData(){
        console.log(this.type);
        let param={
          name: "免费配送",
          carryType: this.type==='快递'?0:1,
          areaInfo: [
            {//指定包邮区
              isDefault: 0, //是否模板（全国） 0、否 1、是 ,
              type: this.radio,//计价方式： 0、重量 1、包邮 2、件数 3、体积 ,
              areaCode: this.freeAreaCode.join(","),
              start: 0,
              startPrice: 0,
              augment: 0,
              augmentPrice: 0
            }
          ],
          clientTimespan: this.$Tool.formatDate(new Date())
        }
        if(this.freightSet){
          param.areaInfo.push(
            {//非指定包邮区
              isDefault: 1, //是否模板（全国） 0、否 1、是 ,
              type: this.radio,//计价方式： 0、重量 1、包邮 2、件数 3、体积 ,
              areaCode: '',
              start: this.start,
              startPrice: this.startPrice,
              augment: this.augment,
              augmentPrice: this.augmentPrice
            }
          )
        }
        saveOrUpdateTemplate.call(this,param).then(res=>{
          if(res.data.code===1){
            this.$message.success(res.data.desc);
            this.$router.push({name:'LogisticsList'});
            // this.$router.push({name:this.type==='物流'?'LogisticsList':'ExpressList'});
          }else{
            this.$message.error(res.data.desc);
          }
        })
      }
    },
    created(){
      this.$parent.change(this.$route.query.type ? this.$route.query.type:'物流');  //传给父组件
    }
  }
</script>

<style lang="less" scoped>
  @import "less/logisticsFree.less";
</style>
