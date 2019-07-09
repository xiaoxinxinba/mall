<template>
  <!--同城配送费用设置-->
  <div class="container">

    <div class="charge-name" v-show="pageType==='同城配送费用'||pageType==='搬楼费用'"><span class="title"><i>*</i>收费标准名称：</span><el-input v-model="title" placeholder="请输入收费标准名称(仅商家可见)"></el-input></div>
    <div class="valuation" v-show="pageType==='同城配送费用'||pageType==='搬楼费用'"><span class="title"><i>*</i>计价方式：</span><el-radio v-model="pricingManner" label="0">按重量</el-radio><el-radio v-model="pricingManner" label="1">按体积</el-radio></div>

    <div class="stage">
      <span class="title">物流配送阶段指示图：</span>
      <ul class="stage-ul">
        <li></li>
        <span style="left: -6px;"></span>
        <li class="ok" style="left: -12px;"></li>
        <span style="left: -18px;"></span>
        <li :class="pageVal.active !== 3?pageVal.active>3?'ok':'wait':'now'" style="left: -24px;"></li>
        <span style="left: -30px;"></span>
        <li  :class="pageVal.active !== 4?pageVal.active>4?'ok':'wait':'now'" style="left: -36px;"></li>
        <span style="left: -42px;"></span>
        <li :class="pageVal.active === 5?'last-ok':'last'" style="left: -48px;"></li>
      </ul>
    </div>
    <ul class="stage-content">
      <li>卖家发货</li>
      <li style="margin-left: 30px;">买家所在城市市区</li>
      <li style="margin-left: 35px;" :class="pageVal.active === 3?'cur-stage':''">送货到楼下</li>
      <li style="margin-left: 60px;" :class="pageVal.active === 4?'cur-stage':''">上楼</li>
      <li style="margin-left: 85px;" :class="pageVal.active === 5?'cur-stage':''">安装</li>
    </ul>





    <div class="remind" v-show="pageType==='同城配送费用'||pageType==='安装费用'">{{pageVal.remind}}</div>

    <div class="charge-name" v-show="pageType==='安装费用'"><span class="title"><i>*</i>安装收费名称：</span><el-input v-model="title" placeholder="请输入收费标准名称(仅商家可见)"></el-input></div>
    <div class="category" v-show="pageType==='安装费用'">
      <span class="title"><i>*</i>选择安装类目：</span>
      <el-select v-model="valueOne" placeholder="请选择" @change="changeOne"><el-option v-for="item in optionsOne" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
      <el-select v-model="valueTwo" placeholder="请选择" @change="changeTwo"><el-option v-for="item in optionsArr(valueOne)" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
      <el-select v-model="valueThree" placeholder="请选择"><el-option v-for="item in optionsArr(valueTwo)" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
    </div>



    <div class="main">
      <div class="add-btn" v-if="!isShowList"><el-button type="primary" icon="el-icon-circle-plus-outline" @click="fristAddarea">添加城市</el-button></div>
      <div v-show="isShowList">
        <div class="remind-right" v-show="pageType==='同城配送费用'||pageType==='搬楼费用'">温馨提示：物流公司重量折体积为：200kg=[长*宽*高/6000]m³</div>
        <div class="table" v-if="pageType !== '安装费用'">
          <el-table :data="tableData" style="width: 100%" :border="true">
            <el-table-column :label="pageVal.labelTitle">
              <template slot-scope="scope">
                <div  class="area-add">
                  <span>{{scope.row.areaName }}</span><i class="area-add-icon" @click="redact(scope.$index)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="pricingManner === '0'?'首重（kg）':'首体积(m³)'">
              <template slot-scope="scope">
                <div  class="table-input">
                  <input type="text" v-model="scope.row.firstUnit"  @keyup="numRule(scope.$index,'firstUnit')">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="首费(元)">
              <template slot-scope="scope">
                <div  class="table-input">
                  <input type="text"  v-model="scope.row.firstPrice" @keyup="numRule(scope.$index,'firstPrice')">
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="pricingManner === '0'?'续重(kg)':'续体积(m³)'">
              <template slot-scope="scope">
                <div  class="table-input">
                  <input type="text" v-model="scope.row.addUnit" @keyup="numRule(scope.$index,'addUnit')">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="续费(元)">
              <template slot-scope="scope">
                <div  class="table-input">
                  <input type="text" v-model="scope.row.addPrice"  @keyup="numRule(scope.$index,'addPrice')">
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="delete" @click="del(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div  >

        <div class="table" v-if="pageType === '安装费用'">
          <el-table :data="tableData" style="width: 100%" :border="true">
            <el-table-column :label="pageVal.labelTitle">
              <template slot-scope="scope">
                <div  class="area-add">
                  <span>{{scope.row.areaName }}</span><i class="area-add-icon" @click="redact(scope.$index)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="安装费（元/件）">
              <template slot-scope="scope">
                <div  class="table-input">
                  <input type="text" v-model.number="scope.row.price">
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="delete" @click="del(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>


        <div class="add-set" @click="addArea">+继续为其他地区设置同城配送运费</div>
        <div class="footer-btn"><el-button type="primary" @click="save">保存</el-button><el-button @click="goBack">取消</el-button></div>
      </div>



    </div>

    <ChooseArea :dialog="childData" @checkedCode="getCheckedCoe"></ChooseArea>

  </div>
</template>

<script>
  import ChooseArea from  './chooseArea';
  import AddOrUpdateDeliveryDispatchingTemplate from '@/api/goods/logistics/AddOrUpdateDeliveryDispatchingTemplate.js';   //添加同城配送列表信息
  import AddOrUpdateDeliveryMovingFloorTemplate from '@/api/goods/logistics/AddOrUpdateDeliveryMovingFloorTemplate.js';   //添加搬楼列表信息
  import AddOrUpdateDeliveryInstallationTemplate from '@/api/goods/logistics/AddOrUpdateDeliveryInstallationTemplate.js';   //添加安装列表信息


  import GetCategory from '@/api/goods/logistics/GetCategory.js';   //获取安装类目
  import GetDeliveryDispatchingTemplate from '@/api/goods/logistics/GetDeliveryDispatchingTemplate.js';   //要修改的配送信息
  import GetDeliveryMovingFloorTemplate from '@/api/goods/logistics/GetDeliveryMovingFloorTemplate.js';   //要修改的搬楼信息
  import GetDeliveryInstallationTemplate from '@/api/goods/logistics/GetDeliveryInstallationTemplate.js';   //要修改的安装信息

  export default {
    props:['aaa'],
    name: "dispatchSet",
    components:{
      ChooseArea,
    },
    data(){
      return{
        pageType:'同城配送费用',   //同城配送费用   搬楼费用    安装费用
        title:'',      //收费标准名称
        pricingManner:'0',      //计价方式 0重量 1体积
        tableData: [],  //{areaName :'未添加地区',areaCode:'',firstUnit:'',firstPrice:'',addUnit:'',addPrice:'',isDefault:0,}
        dialogFlag:false,
        optionsOne: [{value:'请选择',label:'请选择'}],
        valueOne:'',
        valueTwo:'',
        valueThree:'',

        isShowList:false,
        childData:{
          flag:false,
          isHead:4,
          areaTitle:'配送到以下城区：',
          currentInfo:{},
          pricingManner:'',
          codes:[],
          page:'',
        },
        redactIndex:0,   //要编辑的ID
        classifyList:[],  //分类的总数据
        postName:'',
        amendPostName:'',


      }
    },
    computed:{
      pageVal() {
        if(this.pageType==='同城配送费用'){return {active:3,remind:'亲，请认真填写模版，至少设置10个区域，你的商品更容易被搜索到！',labelTitle:'配送到'}}
        else if(this.pageType==='搬楼费用'){return {active:4,remind:'',labelTitle:'搬楼区域'}}
        else if(this.pageType==='安装费用'){return {active:5,remind:'亲，请认真填写模版，至少设置10个区域，你的商品更容易被搜索到！',labelTitle:'安装区域'}}
      },
      amendId() {
        return this.$route.query.amendId
      },
      page() {
        return this.$route.query.pageType
      },


    },
    methods:{
      numRule(index,param) {
        console.log(index,param)
        this.tableData[index][param]=this.tableData[index][param].replace(/[^\.\d]/g,'');
        this.tableData[index][param]=this.tableData[index][param].replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        this.tableData[index][param]= this.tableData[index][param].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        this.tableData[index][param]= this.tableData[index][param].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
      },


      optionsArr(val) {
        let arr=[];
        this.classifyList.map(item=>{
          if(item.id === Number(val)){
            item.cateogryChildren.map(items=>{
              arr.push({value:items.id,label:items.title});
            })
          }else{
            item.cateogryChildren.map(items=>{
              if(items.id === Number(val)){
                items.cateogryChildren.map(its=>{
                  arr.push({value:its.id,label:its.title})
                })
              }
            })
          }
        })
        return arr;
      },
      changeOne() {
        this.valueTwo='';
        this.valueThree='';
      },
      changeTwo() {
        this.valueThree='';
      },


      //第一次添加
      fristAddarea() {
        if(this.pageType === '安装费用'){
          this.childData.isHead=1;
        }
        this.childData.codes=this.tableData[this.redactIndex].areaCode.split(',');
        this.childData.flag=true;
        this.isShowList=true;
        this.childData.currentInfo=this.tableData[this.redactIndex];
        this.childData.pricingManner=this.pricingManner;
        this.childData.page=this.pageType;
      },
      //获得选中区域
      getCheckedCoe(obj) {
        console.log('obj',obj);
        this.tableData[this.redactIndex].areaName=obj.names.join('、');
        this.tableData[this.redactIndex].areaCode=obj.codes.join(',');
      },
      //编辑某一条
      redact(index) {
        this.redactIndex=index;
        this.childData.currentInfo=this.tableData[this.redactIndex];
        this.childData.pricingManner=this.pricingManner;
        this.childData.codes=this.tableData[index].areaCode.split(',');
        this.childData.flag = true;
      },
      //添加列表信息
      addArea() {
        if(this.pageType === '安装费用'){
          this.tableData.push({areaName :'未添加地区',areaCode:'',price:'',});
        }else{
          this.tableData.push({areaName :'未添加地区',areaCode:'',firstUnit:'',firstPrice:'',addUnit:'',addPrice:'',isDefault:0,});
        }
      },
      //删除
      del(index) {
        this.tableData.splice(index,1);
      },



      save() {

        let data={};
        if(this.amendId && this.$route.query.state === '修改'){
          data.id=this.amendId;
        }else{
          data.id=0;
        }
        data.clientTimespan=this.$Tool.formatDate(new Date());
        data.title=this.title;
        data.item=this.tableData;
        if(this.pageType === '同城配送费用'){
          data.pricingManner=Number(this.pricingManner);
        }else if(this.pageType === '搬楼费用'){
          data.pricingManner=Number(this.pricingManner);
        }else if(this.pageType === '安装费用'){
          data.categoryId=Number(this.valueThree);
        }

        console.log(data)
        this.postName.call(this,data).then((res)=>{
          console.log(res)
          if(res.data.code === 1){
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            });
            this.$router.push({name:'DispatchList',query:{pageType:this.pageType}});
          }else{
            this.$message.error(res.data.desc);
          }
        })


      },
      //取消
      goBack() {
        this.$router.go(-1);
      },
      amendIdInfo() {
        if(this.amendId){
          console.log('5566888684486');
          this.amendPostName.call(this,`?templateId=${this.amendId}&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
            console.log('修改',res);
            if(res.data.code === 1){
              if(this.pageType === '安装费用'){
                this.classifyList.map(item=>{
                  item.cateogryChildren.map(items=>{
                    items.cateogryChildren.map(its=>{
                      if(its.id == res.data.data.categoryId){
                        this.valueOne=item.id;
                        this.valueTwo=items.id;
                        this.valueThree=its.id;
                      }
                    })
                  })
                })
              }else{
                this.pricingManner=res.data.data.pricingManner.toString();
              }
              this.title=res.data.data.title;
              this.tableData=res.data.data.item;
              this.isShowList=true;
            }
          })
        }
      },
      getInstallClassify() {
        GetCategory.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          console.log('11',res);
          if(res.data.code === 1){
            this.classifyList=res.data.data;
            this.optionsOne=this.classifyList.map(item=>{
              return {value:item.id,label:item.title}
            })
            console.log('888',this.optionsOne)
            if(this.pageType === '安装费用'){
              this.amendIdInfo();
            }
          }
        });
      },
      changePostName() {
        if(this.pageType === '同城配送费用'){
          this.postName=AddOrUpdateDeliveryDispatchingTemplate;
          this.amendPostName=GetDeliveryDispatchingTemplate;
        }else if(this.pageType === '搬楼费用'){
          this.postName=AddOrUpdateDeliveryMovingFloorTemplate;
          this.amendPostName=GetDeliveryMovingFloorTemplate;
        }else if(this.pageType === '安装费用'){
          this.postName=AddOrUpdateDeliveryInstallationTemplate;
          this.amendPostName=GetDeliveryInstallationTemplate;
        }
      },
    },


    created(){
      if(this.$route.query.pageType){
        this.pageType=this.$route.query.pageType;
        this.$parent.change(this.pageType);
      }else{
        this.$parent.change(this.pageType);
      }
      if(this.pageType === ''){
        this.tableData=[{areaName :'未添加地区',areaCode:'',price:'安装费用'}];
      }else{
        this.tableData=[{areaName :'未添加地区',areaCode:'',firstUnit:'',firstPrice:'',addUnit:'',addPrice:'',isDefault:0,}];
      }
      this.changePostName();
      this.amendIdInfo();
      this.getInstallClassify();

    },
    mounted(){
    },
    watch:{

    }
  }
</script>

<style lang="less" scoped>
  @import "less/dispatchSet.less";
</style>
