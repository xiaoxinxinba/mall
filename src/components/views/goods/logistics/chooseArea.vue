<template>
  <!--选择区域-->
  <div class="container">
    <!--弹框-->
    <!--:close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"-->
    <el-dialog title="提示" :visible.sync="dialog.flag" width="900px" class="dialog-area">
      <div class="freight-set" v-if="dialog.isHead === 1"><span><i>*</i>设置运费：</span><span><input type="text" v-model="dialog.currentInfo.price" @keyup="pieceNum('price')">元/件</span></div>
      <div class="freight-set" v-if="dialog.isHead === 4 && dialog.pricingManner === '0'">
        <span><i>*</i>设置运费：</span><span>首重</span>
        <input type="text" v-model="dialog.currentInfo.firstUnit" @keyup="numRule('firstUnit')">
        <span>kg，首费</span>
        <input type="text" v-model="dialog.currentInfo.firstPrice" @keyup="numRule('firstPrice')">
        <span>元，续重</span>
        <input type="text" v-model="dialog.currentInfo.addUnit" @keyup="numRule('addUnit')">
        <span>kg，续费</span>
        <input type="text" v-model="dialog.currentInfo.addPrice" @keyup="numRule('addPrice')">
        <span>元</span>
      </div>
      <div class="freight-set" v-if="dialog.isHead === 4  && dialog.pricingManner === '1'">
        <span><i>*</i>设置运费：</span><span>首体积</span>
        <input type="text" v-model="dialog.currentInfo.firstUnit" @keyup="numRule('firstUnit')">
        <span>m³，首费</span>
        <input type="text" v-model="dialog.currentInfo.firstPrice" @keyup="numRule('firstPrice')">
        <span>元，续体积</span>
        <input type="text" v-model="dialog.currentInfo.addUnit" @keyup="numRule('addUnit')">
        <span>m³，续费</span>
        <input type="text" v-model="dialog.currentInfo.addPrice" @keyup="numRule('addPrice')">
        <span>元</span>
      </div>

      <div class="area">
        <!--配送到以下城区：-->
        <div class="area-title">{{dialog.areaTitle}}</div>
        <div class="nationwide">
          <el-checkbox v-model="nationwide" @change="nationwideHandler" :indeterminate="allIndeterminate">全国</el-checkbox>
        </div>
        <ul class="area-ul" v-for="(item,index) in list" :key="index">
          <div class="area-ul-title">
            <el-checkbox :indeterminate="item.indeterminate" v-model="item.choose" @change="handleCheck(item,null,null,true)">{{item.area}}</el-checkbox>
          </div>
          <li class="city" v-for="(items,indexs) in item.cityChiled" :key="indexs">
            <el-checkbox :indeterminate="items.indeterminate" v-model="items.choose"  @change="handleCheck(items,item,null,true)" :disabled="items.disab">{{items.name}}</el-checkbox>
            <span>({{(items.checkSize===0)?(items.countSize):(items.checkSize+'/'+items.countSize)}})</span>
            <i @click="handleUpDown(items.code)" :class="curCode===items.code?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            <ul class="county left" v-show="curCode===items.code">
              <li v-for="(content,idx) in items.childList" :key="idx"><el-checkbox v-model="content.choose"
                @change="handleCheck(content,items,item,true)" :disabled="content.disab">{{content.name}}</el-checkbox></li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="move-choose" v-show="isChecked">
        <el-checkbox v-model="checked" @change="changeDefault(checked)">默认{{dialog.page === '搬楼费用'?'同城配送':'搬楼'}}送达区域</el-checkbox>
        <div class="remind">温馨提示：温馨提示：可以对价格相同的省市区进行多选操作</div>
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitArea">确定</el-button>
          <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import expressAreaInfo from '../../../../api/goods/logistics/expressAreaInfo';
  import GetDeliveryDispatchingAreaInfo from '@/api/goods/logistics/GetDeliveryDispatchingAreaInfo';    //获取配送模板选择的所有区域
  import GetDeliveryMovingFloorAreaInfo from '@/api/goods/logistics/GetDeliveryMovingFloorAreaInfo';    //获取搬楼模板选择的所有区域





  export default {
    name: "chooseArea",
    props:['dialog'],
    data(){
      return{
        isDialogFlag:this.dialogFlag,
        list:[
          {area:'全选',choose:false,checkSize:0,indeterminate:false,cityChiled:[{city:'重庆',choose:false,countyChild:[{county:'江北区'},{county:'江北区'},{county:'江北区'},{county:'江北区'},{county:'江北区'}]}]},
          {area:'较偏远地区',choose:false,checkSize:0,indeterminate:false,cityChiled:[{city:'新疆',choose:false,countyChild:[{county:'乌鲁木齐'}]}]},
          {area:'港澳台地区',choose:false,checkSize:0,indeterminate:false,cityChiled:[{city:'台湾',choose:false,countyChild:[{county:'台北市'},]}]},
        ],
        upDown:false,   //
        checked:false,
        curCode:-1,

        provinceList: [],
        closeChild: true,
        checkedCode: [],
        checkedString: [],
        oldCodes:[],
        nationwide:false,   //全国

        allIndeterminate:false,
        defaultCode:[],
      }
    },
    computed:{
      codes() {
        return this.dialog.codes
      },
      allAreaCode(){
        return this.dialog.allAreaCode
      },
      isChecked() {
        if(this.dialog.page === '搬楼费用' || this.dialog.page === '安装费用'){
          return true
        }else{
          return false
        }
      }

    },
    methods:{
      pieceNum(param){
        this.dialog.currentInfo[param]=this.dialog.currentInfo[param].replace(/[^\.\d]/g,'');
        this.dialog.currentInfo[param]=this.dialog.currentInfo[param].replace('.','');
      },
      numRule(param) {
        this.dialog.currentInfo[param]=this.dialog.currentInfo[param].replace(/[^\.\d]/g,'');
        this.dialog.currentInfo[param]=this.dialog.currentInfo[param].replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        this.dialog.currentInfo[param]= this.dialog.currentInfo[param].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        this.dialog.currentInfo[param]= this.dialog.currentInfo[param].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
      },

      //默认配送模板全部区域
      dispatchDefault() {
        return new Promise((resolve,reject)=>{
          GetDeliveryDispatchingAreaInfo.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },
      movingFloorDefault() {
        return new Promise((resolve,reject)=>{
          GetDeliveryMovingFloorAreaInfo.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },


      changeDefault:async function(bool) {
        if(bool){
          if(this.dialog.page === '搬楼费用'){
            this.dialog.codes=await this.dispatchDefault();
          }else if(this.dialog.page === '安装费用'){
            this.dialog.codes=await this.movingFloorDefault();
          }
        }else{
          this.dialog.codes=[];
        }
      },


      //控制市选择div是否显示
      handleUpDown(val){
        if(this.closeChild){
          this.curCode=val;
          this.closeChild = false;
        }else{
          this.curCode = -1;
          this.closeChild = true;
        }
      },
      //控制选中状态
      handleCheck(obj,obj_parent,obj_grandParent,whereCall){
        if(obj.cityChiled){//第一级
          obj.indeterminate = false;
          obj.cityChiled.map(item=>{
            if(!item.disab) {
              item.choose = obj.choose;
              if (item.choose) {
                obj.checkSize++;
              } else {
                obj.checkSize--;
              }
              item.childList.map(items => {
                if(!items.disab) {
                  if (items.choose === false && obj.choose) {
                    item.checkSize++;
                  } else {
                    if (items.choose != obj.choose)
                      item.checkSize--;
                  }
                  items.choose = obj.choose;
                }
              })
              //判断子元素选中个数，设置父元素选中状态
              if (item.checkSize === 0) {
                item.choose = false;
                item.indeterminate = false;
              } else if (item.checkSize === item.countSize) {
                item.choose = true;
                item.indeterminate = false;
              } else {
                item.indeterminate = true;
              }
            }
          })
        }else if(obj.childList){//第二级
          obj.childList.map(item1=>{
            if(!item1.disab) {
              if (item1.choose === false && obj.choose) {
                obj.checkSize++;
              } else {
                if (item1.choose != obj.choose) {
                  obj.checkSize--;
                }
              }
              item1.choose = obj.choose;
            }
          })
          if(obj.checkSize ===0){
            obj.choose = false;
            obj.indeterminate = false;
            obj_parent.checkSize = obj_parent.checkSize>0?obj_parent.checkSize-1:0;
          } else if(obj.checkSize === obj.countSize){
            obj.choose = true;
            obj.indeterminate = false;
            obj_parent.checkSize++;
          }else{
            obj.indeterminate = true;
            obj_parent.checkSize = obj_parent.checkSize>0?obj_parent.checkSize-1:0;
          }

          if(obj_parent.checkSize === 0){
            obj_parent.choose = false;
            obj_parent.indeterminate = false;
          }else if(obj_parent.checkSize === obj_parent.cityChiled.length){
            obj_parent.choose = true;
            obj_parent.indeterminate = false;
          }else{
            obj_parent.indeterminate = true;
          }

        }else{//第三级
          if(obj.choose){
            obj_parent.checkSize++;
          }else{
            obj_parent.checkSize--;
          }
          if(obj_parent.checkSize ===0){
            obj_parent.choose = false;
            obj_parent.indeterminate = false;
            if(!obj.choose && obj_parent.checkSize+1 === obj_parent.countSize){
              obj_grandParent.checkSize = obj_grandParent.checkSize>0?obj_grandParent.checkSize-1:0;
            }
          } else if(obj_parent.checkSize === obj_parent.countSize){
            obj_parent.choose = true;
            obj_parent.indeterminate = false;
            obj_grandParent.checkSize++;
          }else{
            obj_parent.indeterminate = true;
            if(!obj.choose && obj_parent.checkSize+1 === obj_parent.countSize){
              obj_grandParent.checkSize = obj_grandParent.checkSize>0?obj_grandParent.checkSize-1:0;
            }
          }
          if(obj_grandParent.checkSize === 0){
            obj_grandParent.choose = false;
            obj_grandParent.indeterminate = false;
          }else if(obj_grandParent.checkSize === obj_grandParent.cityChiled.length){
            obj_grandParent.choose = true;
            obj_grandParent.indeterminate = false;
          }else{
            obj_grandParent.indeterminate = true;
          }
        }
        //全国状态
       if(whereCall) {
         this.changeNationwide();
       }

        this.list = [...this.list];
      },

      changeNationwide(){
        let ChooseCount = 0;
        this.list.map(item => {
          if (item.indeterminate) {
            this.allIndeterminate = true
          } else if (item.choose) {
            ChooseCount++;
          } else {
            ChooseCount = ChooseCount > 0 ? ChooseCount-- : 0;
          }
        })
        if (ChooseCount === 0) {
          this.nationwide = false;
          this.allIndeterminate = false;
        } else if (ChooseCount === this.list.length) {
          this.nationwide = true;
          this.allIndeterminate = false;
        } else {
          this.nationwide = false;
          this.allIndeterminate = true;
        }
      },


      //全国按钮
      nationwideHandler(){
        this.list.map(item=>{
          this.allIndeterminate = false;
          item.choose = this.nationwide;
          this.handleCheck(item,null,null,null);
        })
      },
      //提交
      submitArea(){
        this.dialog.flag = false;
        this.checkedCode = [];
        this.checkedString = [];
        this.list.map(item_1=>{
          item_1.cityChiled.map(item_2=>{
            if(item_2.checkSize != 0){
              item_2.childList.map(item_3=>{
                if(item_3.choose){
                  this.checkedCode.push(item_3.code);
                }
              })
              this.checkedString.push(item_2.name+"("+item_2.checkSize+"/"+item_2.countSize+")");
            }
          })
          if(this.nationwide){
            this.checkedString=[];
            this.checkedString.push('全国')
          }
        })


        let areaInfo = {};
        areaInfo.codes = this.checkedCode;
        areaInfo.names = this.checkedString;
        this.$emit('checkedCode',areaInfo);
        this.upDown = false;

      },
      cancel(){
        this.dialog.flag  = false;
        if(this.oldCodes){
          this.dialog.codes = JSON.parse(JSON.stringify(this.oldCodes));
        }
      },
    },
    created() {



      let faraway = ['65', '15', '64', '54', '62', '63', '23'];//偏远地区
      let gat = ['71','81','82'];//港澳台
      //获取物流地址省市信息
      expressAreaInfo.call(this,`?clientTimespan=${new Date()}`).then( res => {
        if(res.data.code === 1){
          let mainArea = [];
          let farArea = [];
          let gatArea = [];
          res.data.data.areaInfo.map(item=>{
            item.countSize = item.childList.length;
            item.checkSize = 0;
            item.indeterminate = false;
            item.childList.map(items=>{
              items.choose = false;
            })
            if(item.countSize===item.checkSize){
              item.choose = true;
              item.indeterminate = false;
            }
            if(faraway.includes(item.code)){
              farArea.push(item);
            }else if(gat.includes(item.code)){
              gatArea.push(item);
            }else{
              mainArea.push(item);
            }
          })
          this.list[0].cityChiled = mainArea;
          this.list[1].cityChiled = farArea;
          this.list[2].cityChiled = gatArea;
        }
      })
    },
    watch:{
      dialogFlag(n,o){
        this.isDialogFlag=n;
      },
      isDialogFlag(n,o){
        this.$emit('dialogShow',this.isDialogFlag);
      },
      codes: {
        handler(n,o) {
          this.oldCodes = n;
          if (n) {
            this.list.map(item_1 => {
              item_1.choose = false;
              item_1.indeterminate = false;
              item_1.checkSize = 0;
              let disabCount_1 = 0;
              item_1.cityChiled.map(item_2 => {
                item_2.countSize = item_2.childList.length;
                item_2.checkSize = 0;
                item_2.indeterminate = false;
                item_2.choose = false;
                let disabCount = 0;
                item_2.childList.map(items => {
                  if (n.includes(items.code.toString())) {
                    items.choose = true;
                    item_2.indeterminate = true;
                    item_2.checkSize++;
                    items.disab = false;
                  } else {
                    items.choose = false;
                    items.disab = false;
                    if(this.allAreaCode.includes(items.code.toString())){
                      items.disab = true;
                      disabCount++;
                    }
                  }
                })
                if(disabCount===item_2.countSize){
                  item_2.disab = true;
                  disabCount_1 ++;
                }else{
                  item_2.disab = false;
                }
                if (item_2.countSize === item_2.checkSize) {
                  item_2.choose = true;
                  item_2.indeterminate = false;
                  item_1.checkSize++;
                  item_1.indeterminate = true;
                }
              })
              if(item_1.checkSize === item_1.cityChiled.length){
                item_1.choose = true;
                item_1.indeterminate =false;
              }
              if(disabCount_1==item_1.countSize){
                item_1.disab = true;
              }else{
                item_1.disab = false;
              }
            })
          }else{
            this.list.map(item_1 => {
              item_1.choose = false;
              item_1.indeterminate = false;
              item_1.checkSize = 0;
              let disabCount_1 = 0;
              item_1.cityChiled.map(item_2 => {
                item_2.countSize = item_2.childList.length;
                item_2.checkSize = 0;
                item_2.indeterminate = false;
                item_2.choose = false;
                let disabCount = 0;
                item_2.childList.map(items => {
                  items.choose = false;
                  if(this.allAreaCode.includes(items.code.toString())){
                    items.disab = true;
                    disabCount++;
                  }else{
                    items.disab = false;
                  }
                })
                if(disabCount == item_2.countSize){
                  item_2.disab = true;
                  disabCount_1++;
                }else{
                  item_2.disab = false;
                }
              })
              if(disabCount_1==item_1.countSize){
                item_1.disab = true;
              }else{
                item_1.disab = false;
              }
            })
          }
          this.changeNationwide();
        },

      }
    },
  }
</script>

<style lang="less" type="text/less" scoped>
  *{
    box-sizing: border-box;
  }
  //弹框选择区域
  .freight-set{
       width: 852px;
       font-size: 14px;
       color: #333333;
       span{
         display: inline-block;
       }
       input{
         width: 80px;
         height: 40px;
         text-align: center;
         line-height: 40px;
         margin: 0px 5px;
       }
       i{
         color: #e60012;
         margin-right: 5px;
       }

     }


  .dialog-area{
    ///deep/ .el-dialog__body{
    //  padding-bottom: 0px;
    //  height: 340px;
    //  overflow-y: auto;
    //}
    /deep/ .el-dialog__footer{
      text-align: center;
      button{
        margin: 0px 20px;
        padding: 0px;
        width: 86px;
        height: 32px;
      }
    }
  }

  .area{
    margin-top: 20px;
    width: 852px;
    //height: 150px;
    //overflow-y: auto;
    padding-top: 10px;
    padding-bottom: 20px;
    border: solid 1px #cccccc;
    display: inline-block;
    position: relative;
  }
  .nationwide{
    padding-left: 15px;
    margin-bottom: 10px;
  }

  .area-title{
    font-size: 14px;
    color: #333333;
    padding-left: 15px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .area-ul{
    margin-bottom: 20px;
    font-size: 0px;
    .area-ul-title{
      height: 34px;
      line-height: 34px;
      background: #ecf4fa;
      padding-left: 15px;
      /deep/ .el-checkbox__label{
        color: #333333;
        font-weight: 600;
      }

    }
    >li{
      //height: 20px;
      //line-height: 20px;
      width: 170px;
      display: inline-block;
      //margin:10px 15px;
      padding: 10px 15px;
      /deep/ .el-checkbox{
        margin-right: 0px;
      }
      /deep/ .el-checkbox__label{
        //font-size: 14px;
        color: #666666;
        width: 52px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: middle;
      }
      >span{
        font-size: 14px;
        color: red;
        margin-right: 5px;
      }
      i{
        font-size: 13px;
        color: #333333;
      }
    }
    .city{
      position: relative;
      .county{
        width: 390px;
        position: absolute;
        top: 100%;
        z-index: 999;
        background: #f0f0f0;
        font-size: 0px;
        li{
          width: 130px;
          display: inline-block;
          font-size: 12px;
          text-align: center;
          margin: 10px 0px;
        }
      }
      .left{
        left: 0;
      }
      .middle{
        left: -100%;
      }
      .right{
        right: 0;
      }
    }
  }

  .remind{
    margin-top: 20px;
    display: inline-block;
    font-size: 12px;
    color: #c5651f;
    padding: 0px 10px;
    height: 32px;
    line-height: 32px;
    background: #fff7e6;
    border:1px solid #ffc79c;
  }

  .move-choose{
    margin-top: 20px;
    .remind{
      display: inline-block;
    }
  }

</style>
