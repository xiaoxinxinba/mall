<template>
  <!--同城配送费用列表-->
  <div class="container">
    <div class="add-btn"><el-button type="primary" icon="el-icon-circle-plus-outline" @click="addChargeNorm">添加收费标准</el-button></div>
    <div class="stage">
      <span class="title">物流配送阶段指示图：</span>
      <ul class="stage-ul">
        <li></li>
        <span style="left: -6px;"></span>
        <li class="ok" style="left: -12px;"></li>
        <span style="left: -18px;"></span>
        <li :class="active !== 3?active>3?'ok':'wait':'now'" style="left: -24px;"></li>
        <span style="left: -30px;"></span>
        <li  :class="active !== 4?active>4?'ok':'wait':'now'" style="left: -36px;"></li>
        <span style="left: -42px;"></span>
        <li :class="active === 5?'last-ok':'last'" style="left: -48px;"></li>
      </ul>
    </div>
    <ul class="stage-content">
      <li>卖家发货</li>
      <li style="margin-left: 30px;">买家所在城市市区</li>
      <li style="margin-left: 35px;" :class="active === 3?'cur-stage':''">送货到楼下</li>
      <li style="margin-left: 60px;" :class="active === 4?'cur-stage':''">上楼</li>
      <li style="margin-left: 85px;" :class="active === 5?'cur-stage':''">安装</li>
    </ul>

    <div class="main">
      <div class="remind">亲，请认真填写模版，至少设置10个区域，您的商品更容易被搜索到！</div>
      <div class="search">
        <el-select v-model="valuation" clearable  :placeholder="pageType === '安装费用'?'安装类目':'全部计价方式'"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
        <el-select v-model="provinceCode" clearable @change="provinceChange(provinceCode)" placeholder="请选择省"><el-option v-for="item in provinceList" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
        <el-select v-model="cityCode" clearable  placeholder="请选择市/区"><el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>


        <el-button type="primary" @click="search">搜索</el-button>
      </div>

      <div v-show="pageType !== '安装费用'">
        <div class="charge" v-for="(item,index) in  chargeTableData" :key="index">
          <div class="charge-title"><span>{{item.title }}</span><ul class="charge-title-right"><li>最后编辑时间：{{item.updateTime }}</li><li @click="amend(index,'复制')">复制模板</li><li @click="amend(index,'修改')">修改</li><li @click="del(index)">删除</li></ul></div>
          <div class="charge-table">
            <el-table :data="item.item" style="width: 100%" :border="true">
              <el-table-column label="配送区域" width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.areaName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="计价方式">
                <template slot-scope="scope">
                  <span>{{chargeTableData[index].pricingManner === 0?'按重量':'按体积'}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="chargeTableData[index].pricingManner === 0?'首重（kg）':'首体积（m³）'">
                <template slot-scope="scope">
                  <span>{{ scope.row.firstUnit}}</span>
                </template>
              </el-table-column>
              <el-table-column label="首费（元）">
                <template slot-scope="scope">
                  <span>{{ scope.row.firstPrice}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="chargeTableData[index].pricingManner === 0?'续重(kg)':'续体积(m³)'">
                <template slot-scope="scope">
                  <span>{{ scope.row.addUnit}}</span>
                </template>
              </el-table-column>
              <el-table-column label="续件(元)">
                <template slot-scope="scope">
                  <span>{{ scope.row.addPrice}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div v-show="pageType === '安装费用'">
        <div class="charge" v-for="(item,index) in  chargeTableData" :key="index">
          <div class="charge-title"><span>{{item.title }}</span><ul class="charge-title-right"><li>最后编辑时间：{{item.updateTime }}</li><li @click="amend(index,'复制')">复制模板</li><li @click="amend(index,'修改')">修改</li><li @click="del(index)">删除</li></ul></div>
          <div class="charge-table">
            <el-table :data="item.item" style="width: 100%" :border="true">
              <el-table-column label="配送区域" width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.areaName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="安装类目">
                <template slot-scope="scope">
                  <span>{{item.categoryName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="安装费（元/件）">
                <template slot-scope="scope">
                  <span>{{ scope.row.price}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>





    </div>

  </div>
</template>

<script>
  import GetDeliveryDispatchingTemplateList from '@/api/goods/logistics/GetDeliveryDispatchingTemplateList.js';    //获取配送模板列表数据
  import GetDeliveryMovingFloorTemplateList from '@/api/goods/logistics/GetDeliveryMovingFloorTemplateList.js';    //获取搬楼模板列表数据
  import GetDeliveryInstallationTemplateList from '@/api/goods/logistics/GetDeliveryInstallationTemplateList.js';    //获取安装模板列表数据


  import expressAreaInfo from '@/api/goods/logistics/expressAreaInfo.js';   //地址信息

  import DelDeliveryTemplate from '@/api/goods/logistics/DelDeliveryTemplate.js';   //删除


  export default {
    props:['aaa'],
    name: "dispatchList",
    data(){
      return{
        pageType:'同城配送费用',      //同城配送费用设置   搬楼费用设置
        provinceCode:'',    //省份code
        provinceList:[],
        cityCode:'',      //城市code
        cityList:[],
        areaList:[],
        valuation:'',
        options: [{value:-1,label:'全部'},{value: 1, label: '按体积'}, {value: 0, label: '按重量'}],
        chargeTableData:[],
        postName:'',
      }
    },
    computed:{
      page() {
        return this.$route.query.pageType
      },
      active() {
        if(this.pageType === '同城配送费用'){
          return 3
        }else if(this.pageType === '搬楼费用'){
          return 4
        }else if(this.pageType === '安装费用'){
          return 5
        }
      },

    },
    methods:{



      addChargeNorm() {
       this.$router.push({name:'DispatchSet',query:{pageType:this.pageType}});
      },
      //搜索
      search() {
        (this.cityCode === null) && (this.cityCode='');
        (this.provinceCode === null) && (this.provinceCode='');
        let name;
        if(this.pageType === '安装费用'){
          if(this.valuation === '' || this.valuation === null){
            name='';
          }else{
            name=`&categoryId=${this.valuation}`;
          }
        }else{
          if(this.valuation === '' || this.valuation === null){
            this.valuation=-1;
          }
          name=`&pricingManner=${this.valuation}`;
        }
        //  name=this.pageType === '安装费用'?'categoryId':'pricingManner';
        // if(this.pageType === '安装费用' && this.valuation)


        this.postName.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&cityCode=${this.cityCode}&provinceCode=${this.provinceCode}${name}`).then(res=>{
          console.log('aaaaaaaa',res);
          if(res.data.code === 1){
            if(this.pageType === '安装费用'){
              this.chargeTableData=res.data.data.deliveryInstallations;
            }else{
              this.chargeTableData=res.data.data;
            }
            this.cityCode='';
            this.valuation='';
            this.cityList=[];
            this.provinceCode='';
          }
        })
      },
      //修改
      amend(index,val) {
        let state='';
        val === '修改'?state='修改':state='复制';
        this.$router.push({name:'DispatchSet',query:{amendId:this.chargeTableData[index].id,state,pageType:this.pageType}});
      },

      //删除
      del(index){
        let data={};
        data.templateId=this.chargeTableData[index].id;
        data.clientTimespan=this.$Tool.formatDate(new Date());
        DelDeliveryTemplate.call(this,data).then(res=>{
          if(res.data.code === 1){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.chargeTableData.splice(index,1);
          }
        });
      },


      getList() {

        if(this.pageType !== '安装费用'){
          (this.valuation === '')&&(this.valuation = -1);
        }
        let pname=this.pageType !== '安装费用'?`&pricingManner=${this.valuation}`:'';
        this.postName.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}${pname}`).then((res)=>{
          this.valuation = '';
          if(res.data.code === 1){
            if(this.pageType === '安装费用'){
              this.chargeTableData=res.data.data.deliveryInstallations;
              this.options=this.chargeTableData.map(item=>{
                return {value:item.categoryId,label:item.categoryName.split('-').reverse()[0]}
              })
            }else{
              this.chargeTableData=res.data.data;
              this.options=[{value:'-1',label:'全部'},{value: '1', label: '按体积'}, {value: '0', label: '按重量'}];
            }
          }
        })
      },
      postWay() {
        if(this.pageType === '同城配送费用'){
          this.postName=GetDeliveryDispatchingTemplateList;
        }else if(this.pageType === '搬楼费用'){
          this.postName=GetDeliveryMovingFloorTemplateList;
        }else if(this.pageType === '安装费用'){
          this.postName=GetDeliveryInstallationTemplateList;
        }
      },
      getAreaInfo() {
        expressAreaInfo.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          console.log(res)
          if(res.data.code === 1){
            this.areaList=res.data.data.areaInfo;
            this.provinceList=this.areaList.map(item=>{
              return {value:item.code,label:item.name}
            })
          }
        })
      },
      provinceChange(code) {
        this.cityCode='';
        if(code === null){
          return
        }else{
          this.cityList=this.areaList.find(item=>{
            return item.code===code
          }).childList.map(item=>{
            return {value:item.code,label:item.name}
          })
        }
      },
    },

    created() {
      if(this.page){
        this.$parent.change(this.page);
        this.pageType=this.page;
      }else{
        this.$parent.change(this.pageType);
      }
      this.postWay();
      this.getList();
      this.getAreaInfo();

    },
    watch:{
      page(n,o) {
        this.pageType=n;
        this.postWay();
        this.valuation='';
        this.getList();
        this.$parent.change(n);
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "less/dispatchList.less";
</style>
