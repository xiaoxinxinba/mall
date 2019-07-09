<template>
  <!--物流设置收费-->
  <div class="container">

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


    <div class="charge-name">
      <span class="title">收费标准名称：</span>
      <el-input v-model="tableData.name" placeholder="请输入收费标准名称（仅商家可见）"></el-input>
    </div>

    <div class="valuation">
      <span class="title"><i>*</i>计价方式：</span>
      <div class="valuation-right">
        <el-radio v-model="radio" label='0'>按重量</el-radio>
        <el-radio v-model="radio" label='3'>按体积</el-radio>
        <el-radio v-model="radio" label='2' v-show="type === '快递'">按件数</el-radio>
        <div class="remind-one">大件商品，如家具等建议用“按体积”计价方式</div>
        <div  class="remind-two">温馨提示：物流公司重量折体积为：200kg=[长*宽*高/6000]m³</div>
        <div class="norm">
          <div class="norn-left" v-show="radio === '3'">
            收费标准：<div><input type="text" v-model.number="defaultCount" @change="checkNum(0,0,defaultCount)"/><span v-show="validNum[0][0]">请输入数字</span></div>m³内，
            <div><input type="text" v-model.number="defaultMoney" @change="checkNum(0,1,defaultMoney)"/><span v-show="validNum[0][1]">请输入数字</span></div>元，
            每增加<div><input type="text" v-model.number="defaultAddCount" @change="checkNum(0,2,defaultAddCount)" /><span v-show="validNum[0][2]">请输入数字</span></div>m³，
            增加运费<div><input type="text" v-model.number="defaultAddMoney" @change="checkNum(0,3,defaultAddMoney)"/><span v-show="validNum[0][3]">请输入数字</span></div>元
          </div>
          <div class="norn-left" v-show="radio === '0'">
            收费标准：<div><input type="text" v-model.number="defaultCount" @change="checkNum(0,0,defaultCount)"/><span v-show="validNum[0][0]">请输入数字</span></div>kg内，
            <div><input type="text" v-model.number="defaultMoney"  @change="checkNum(0,1,defaultMoney)"/><span v-show="validNum[0][1]">请输入数字</span></div>元，
            每增加<div><input type="text" v-model.number="defaultAddCount" @change="checkNum(0,2,defaultAddCount)"/><span v-show="validNum[0][2]">请输入数字</span></div>kg，
            增加运费<div><input type="text" v-model.number="defaultAddMoney" @change="checkNum(0,3,defaultAddMoney)"/><span v-show="validNum[0][3]">请输入数字</span></div>元
          </div>
          <div class="norn-left" v-show="radio === '2'">
            收费标准：<div><input type="text" v-model.number="defaultCount" @change="checkNum(0,0,defaultCount)"/><span v-show="validNum[0][0]">请输入数字</span></div>件内，
            <div><input type="text" v-model.number="defaultMoney"  @change="checkNum(0,1,defaultMoney)"/><span v-show="validNum[0][1]">请输入数字</span></div>元，
            每增加<div><input type="text" v-model.number="defaultAddCount" @change="checkNum(0,2,defaultAddCount)"/> <span v-show="validNum[0][2]">请输入数字</span></div>件，
            增加运费<div><input type="text" v-model.number="defaultAddMoney" @change="checkNum(0,3,defaultAddMoney)"/> <span v-show="validNum[0][3]">请输入数字</span></div>元
          </div>
          <ul class="norn-right">
            <li>1、此收费为物流公司参考标准，仅作参考，请咨询就近物流网点后再确认收费标准</li>
            <li>2、设置的收费标准原则上不高于平台参考标准，以免造成商品运费过高，影响店铺销售保存</li>
            <li>3、除指定地区外，其余地区的运费默认采用此“收费标准”</li>
            <li>4、运费设置为“0”表示免运费；增加运费设置为“0”时表示超体积不加价</li>
          </ul>
        </div>

        <div class="charge-add" @click="handleAdd">+为指定地区设置运费</div>

        <div class="table">
          <el-table :data="tableDataList" style="width: 100%" :border="true">
            <el-table-column label="运送到">
              <template slot-scope="scope">
                <div  class="area-add">
                  <span>{{scope.row.area}}</span>
                  <i class="area-add-icon" @click="changeParam(scope.row.areaCode,scope.$index)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="radio==='0'?'首重（kg）':radio==='2'?'首件':radio==='3'?'首体积(m³)':''">
              <template slot-scope="scope">
                <div  class="table-input">
                  <div>
                    <input type="text" v-model.number="scope.row.firstCount" @change="checkNum(scope.$index+1,0,scope.row.firstCount)">
                    <span v-show="validNum[scope.$index+1][0]">请输入数字</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="首费(元)">
              <template slot-scope="scope">
                <div  class="table-input">
                  <div>
                    <input type="text" v-model.number="scope.row.firstMoney" @change="checkNum(scope.$index+1,1,scope.row.firstMoney)">
                    <span v-show="validNum[scope.$index+1][1]">请输入数字</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="radio==='0'?'续重（kg）':radio==='2'?'续件':radio==='3'?'续体积(m³)':''">
              <template slot-scope="scope">
                <div  class="table-input">
                  <div>
                    <input type="text" v-model.number="scope.row.addCount" @change="checkNum(scope.$index+1,2,scope.row.addCount)">
                    <span v-show="validNum[scope.$index+1][2]">请输入数字</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="续费(元)">
              <template slot-scope="scope">
                <div  class="table-input">
                  <div>
                    <input type="text" v-model.number="scope.row.addMoney" @change="checkNum(scope.$index+1,3,scope.row.addMoney)">
                    <span v-show="validNum[scope.$index+1][3]">请输入数字</span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="delete" @click="handleDelete(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="btn">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="info" @click="goBack">取消</el-button>
        </div>
      </div>

    </div>

    <ChooseArea :dialog="childData" @checkedCode="getCheckedCoe"></ChooseArea>
  </div>
</template>

<script>
  import ChooseArea from './chooseArea';
  import expressTemplateDetails from '../../../../api/goods/logistics/expressTemplateDetails';
  import addOrUpdateExpressTemplate from '../../../../api/goods/logistics/addOrUpdateExpressTemplate';
  export default {
    name: "logisticsCharge",
    components:{
      ChooseArea,
    },
    data(){
      return{
        chargeName:'',
        radio: '0',
        tableData: {},
        dialogFlag: true,
        upDown: false,   //
        childData: {
          flag: false,
          isHead: 0,
          areaTitle: '',
          codes: [],
          allAreaCode:[],
        },
        type: this.$route.query.type==null?'物流':this.$route.query.type,

        //修改或复制
        mbId: this.$route.query.mbId,
        editOrCopy: this.$route.query.editOrCopy,
        itemIndex: -1,
        oldName: '',
        //收费标准
        defaultCount: 0,
        defaultMoney: 0,
        defaultAddCount: 0,
        defaultAddMoney: 0,

        validNum:[[false,false,false,false]],
        allAreaCode: [],
      }
    },
    computed:{
      tableDataList(){
        return this.tableData.itemInfo && this.tableData.itemInfo.filter((item,index)=>{
          if(item.isDefault !== 1){
            return item
          }
        })
      }
    },
    methods:{
      //验证
      checkNum(index,_index,obj){
        let reg = /^\d+\.?\d?$/;

        this.validNum[index][_index] = !reg.test(obj);
        this.validNum = [...this.validNum]
      },
      //删除
      handleDelete(index, row){
        this.tableData.itemInfo.splice(index,1)
      },
      //添加
      handleAdd(){
        if(this.tableData.itemInfo){
          this.tableData.itemInfo.push({area:'未添加地区',firstCount:0,firstMoney:0,addCount:0,addMoney:0})
        }else {
          this.tableData = {itemInfo: [{area: "未添加地区",firstCount:0,firstMoney:0,addCount:0,addMoney:0}],name:this.tableData.name};
        }
        this.validNum.push([false,false,false,false])
      },
      //保存
      save(){
        if(!this.tableData.name){
          this.$message.error("请输入收费标准名称");
          return;
        }
        let isValid = true;
        this.validNum.map(item=>{
          if(item.includes(true)){
            isValid = false;
          }
        })
        if(!isValid){
          return;
        }

        let param = {};

        param.name = this.tableData.name;
        param.carryType = this.type==='物流'? 1 : 0;
        param.clientTimespan = this.$Tool.formatDate(new Date());
        let areaInfos=[];
        let areaInfo = null;

        if(this.editOrCopy==='edit') {
          param.mbId = this.mbId;
          param.mbNamebeforeEdit = this.oldName;
        }else{
          areaInfo = {};

          areaInfo.start = parseFloat(this.defaultCount);
          areaInfo.startPrice = parseFloat(this.defaultMoney);
          areaInfo.augment = parseFloat(this.defaultAddCount);
          areaInfo.augmentPrice = parseFloat(this.defaultAddMoney);
          areaInfo.isDefault = 1;
          areaInfo.type = this.radio;
          areaInfos.push(areaInfo);
          param.areaInfo = areaInfos;
        }

        if (this.tableData.itemInfo) {
          this.tableData.itemInfo.map(item => {
            areaInfo = {};
            if (item.isDefault === 1) {
              areaInfo.start = parseFloat(this.defaultCount);
              areaInfo.startPrice = parseFloat(this.defaultMoney);
              areaInfo.augment = parseFloat(this.defaultAddCount);
              areaInfo.augmentPrice = parseFloat(this.defaultAddMoney);
            } else {
              areaInfo.start = parseFloat(item.firstCount);
              areaInfo.startPrice = parseFloat(item.firstMoney);
              areaInfo.augment = parseFloat(item.addCount);
              areaInfo.augmentPrice = parseFloat(item.addMoney);
            }
            areaInfo.isDefault = item.isDefault;
            areaInfo.type = this.radio;
            areaInfo.areaCode = item.areaCode?item.areaCode.join(","):"";
            areaInfos.push(areaInfo);
          })
          param.areaInfo = areaInfos;
        } else {
          areaInfo = {};

          areaInfo.start = parseFloat(this.defaultCount);
          areaInfo.startPrice = parseFloat(this.defaultMoney);
          areaInfo.augment = parseFloat(this.defaultAddCount);
          areaInfo.augmentPrice = parseFloat(this.defaultAddMoney);
          areaInfo.isDefault = 1;
          areaInfo.type = this.radio;
          areaInfos.push(areaInfo);
          param.areaInfo = areaInfos;
        }

        addOrUpdateExpressTemplate.call(this, param).then(res => {
          if (res.data.code === 1) {
            if (this.type === '快递') {
              this.$router.push({name: 'LogisticsList', query: {type: '快递'}});
            } else {
              this.$router.push({name: 'LogisticsList', query: {type: '物流'}});
            }
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //取消
      goBack() {
        this.$router.push({name:'LogisticsList',query:{type:this.$route.query.type}});
      },
      //编辑地区时传递code
      changeParam(val,item_index){
        this.childData.flag = true;
        this.childData.codes=val?val:[];
        this.itemIndex = item_index;
        this.childData.allAreaCode = this.allAreaCode;
      },
      //获取地区选择页面返回值
      getCheckedCoe(val){
        let index = this.mbId?this.itemIndex+1:this.itemIndex;
        this.tableData.itemInfo[index].area = val.names.join("、");
        this.tableData.itemInfo[index].areaCode = val.codes;
        this.allAreaCode = [];
        this.tableData.itemInfo.map(f=>{
          this.allAreaCode.push.apply(this.allAreaCode,f.areaCode);
        })
      },
    },
    created(){
      this.$parent.change(this.$route.query.type?this.$route.query.type:'物流');  //传给父组件

      if(this.mbId){
        expressTemplateDetails.call(this,`?clientTimespan=${new Date()}&id=${this.mbId}`).then(res=>{
          if(res.data.code===1){
            this.tableData = res.data.data;
            this.radio = res.data.data.itemInfo[0].type.toString();
            this.validNum = [];
            this.tableData.itemInfo.map(item=>{
              this.validNum.push([false,false,false,false]);
              if(item.isDefault===1){
                this.defaultCount = item.firstCount;
                this.defaultMoney = item.firstMoney;
                this.defaultAddCount = item.addCount;
                this.defaultAddMoney = item.addMoney;
              }
              this.allAreaCode.push.apply(this.allAreaCode,item.areaCode);
            });
            this.oldName = this.tableData.name;
          }else{
            this.$message.error(res.data.desc);
          }
        })
      }
    }
  }
</script>

<style  lang="less" scoped>
  @import "less/logisticsCharge.less";
</style>
