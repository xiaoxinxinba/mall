<template>
  <!--用户自提-->
  <div class="container">
    <h2>新增自提地点</h2>
    <div class="main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="收费标准名称：" prop="title" >
          <el-input v-model="ruleForm.title" placeholder="请输入收费标准名称（仅商家可见）"></el-input>
        </el-form-item>

        <el-form-item label="自提地点：" required>
          <div class="area-select">
            <el-form-item label="" prop="province">
              <el-select v-model="ruleForm.province" placeholder="请选择省" @change="checkProvince">
                <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="area-select">
            <el-form-item label="" prop="city">
              <el-select v-model="ruleForm.city" placeholder="请选择市" @change="checkCity">
                <el-option v-for="item in filterCityOptions" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="area-select">
            <el-form-item label="" prop="region">
              <el-select v-model="ruleForm.region" placeholder="请选择区县" @change="checkCounty">
                <el-option v-for="item in filterCountyOptions" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
<!--          <div class="area-select">-->
<!--            <el-form-item label="" prop="street">-->
<!--              <el-select v-model="ruleForm.street" placeholder="请选择街道">-->
<!--                <el-option v-for="item in filterStreetOptions" :key="item.id" :label="item.name" :value="item.code"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </div>-->
          <span class="default">使用默认发货地址</span>
        </el-form-item>


        <el-form-item  prop="particular" >
          <div>
            <el-input type="textarea" :autosize="{ minRows: 1}" resize="none" placeholder="请输入内容" v-model="ruleForm.particular" @change="searchOption"></el-input>
            <span class="remind-right">与顾客来店导航有关，请详细填写</span>
          </div>
        </el-form-item>


<!--        <el-form-item label="地图选点："  prop="particular">-->
        <el-form-item label="地图选点：" class="map">
<!--          <el-input type="text" placeholder="请输入内容" v-model="ruleForm.particular"></el-input>-->
          <div class="amap-page-container">
            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" style="border-color: red"></el-amap-search-box>
            <el-amap vid="amap" :events="events" :zoom="zoom" :plugin="plugin" style="height: 400px;width: 650px;" :center="centers">
              <el-amap-marker v-if="lat !== 0 && lng !== 0" vid="component-marker" :position="[lng,lat]" :label="label"></el-amap-marker>
              <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker" :events="events" :vid="index"> </el-amap-marker>
            </el-amap>
          </div>

        </el-form-item>

        <el-form-item label="营业时间："   required>
          <div class="business-box">
            <div  class="business-date">
              <el-form-item prop="startData">
                <el-time-select v-model="ruleForm.startData" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}" placeholder="选择时间"></el-time-select>
              </el-form-item>
            </div>
            <div class="business-middle">—</div>
            <div  class="business-date">
              <el-form-item prop="endData">
                <el-time-select v-model="ruleForm.endData" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}" placeholder="选择时间"></el-time-select>
              </el-form-item>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="贵宾专线：" prop="phone"  required>
          <el-input v-model="ruleForm.phone" placeholder="请输入联系方式"></el-input>
        </el-form-item>

        <el-form-item label="自提说明：" > <!-- prop="explain" required-->
          <el-input type="textarea" :autosize="{ minRows: 4}" resize="none" placeholder="自提点收取的定金分别为20%或100%，自提时支付余额" v-model="ruleForm.explain"></el-input>
        </el-form-item>


        <el-form-item>
          <div class="btn">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </div>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
  import cityList from '@/api/base/cityList';
  import countyList from '@/api/base/countyList';
  import provinceList from '@/api/base/provinceList';
  import streetList from '@/api/base/GetStreetList';
  import AddOrUpdateOneselfPack from '@/api/goods/logistics/AddOrUpdateOneselfPack';
  import GetOneselfPackInfo from '@/api/goods/logistics/GetOneselfPackInfo';
  export default {
    name: "userReceiveAdd",
    data(){
      let self = this;
      let checkPhone = (rule, value, callback) => {
        if(!value){
          return callback(new Error("请输入联系方式"));
        }
        let reg_a = /^\d{3,4}-\d{7,8}$/;
        let reg_b = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
        if (!reg_a.test(value) && ! reg_b.test(value)) {
          return callback(new Error('联系方式不合法'));
        }
        return callback();
      };
      return{
        ruleForm: {
          title: '',
          province:'',
          city:'',
          region:'',
          street:'',
          particular:'',
          startData:'',
          endData:'',
          phone:'',
          explain:'',
        },
        rules:{
          province:[{required: true, message: '请选择省', trigger: 'blur' }],
          city:[{required: true, message: '请选择市', trigger: 'blur' }],
          region:[{required: true, message: '请选择区县', trigger: 'blur' }],
          street:[{required: true, message: '请选择街道', trigger: 'blur' }],
          particular:[{required: true, message: '请输入道路、门牌号码、楼层和房间号等信息', trigger: 'blur' }],
          startData:[{required: true, message: '请选择开始营业时间', trigger: 'blur' }],
          endData:[{required: true, message: '请选择结束营业时间', trigger: 'blur' }],
          phone:[{validator: checkPhone, trigger: 'blur'}],
          // explain: [{required: true, message: '请输入自提说明', trigger: 'blur'}]
        },

        provinceOptions: [],//省
        filterCityOptions: [],//过滤后的市
        cityOptions:[],//市
        filterCountyOptions: [],//过滤后的区县
        countyOptions: [], //区
        filterStreetOptions: [],//过滤后的街道
        streetOptions: [],//街道

        id: this.$route.query.id,
        plugin: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例'
              if (self.id==='' || typeof(self.id)=="undefined") {
                o.getCurrentPosition((status, result) => {
                  if (status === 'complete' && result.info === 'SUCCESS') {
                    if (result && result.position) {
                      self.centers[0] = result.position.lng
                      self.centers[1] = result.position.lat
                    }
                  }
                })
              }
            }
          }
        }],
        events: {
          click (e) {
            let {lng, lat} = e.lnglat
            // console.log(lng, lat, '坐标')
            self.lng = lng
            self.lat = lat
            // 这里通过高德 SDK 完成。
            let geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all'
            })
            geocoder.getAddress([lng, lat], function (status, result) {
              console.log('status result=====>>>', status, result)
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  console.log(self,'a');
                  self.label.content = result.regeocode.formattedAddress
                  self.label = {...self.label}
                  self.ruleForm.particular = result.regeocode.formattedAddress;
                }
              }
            })

            let txt = '地铁';
            AMap.service(["AMap.PlaceSearch"], function () {
              let placeSearch = new AMap.PlaceSearch({
                //构造地点查询类
                pageSize: 100,
                pageIndex: 1,
                city: '', //城市
                cityLimit: 'true',
                //panel: 'temp'//搜索结果的展示面板对元素id，不知道为什么一定要有该参数，最终获取的结果才更完整，参数更多跟完整，
                //所以我在页面随便写了一个<div id="temp" style="display:none"></div>
              });
              if(txt.length>0){
                placeSearch.searchNearBy(txt,[lng,lat], 1000, function(status, result1) {
                  if (status == 'complete' && result1.info == 'OK') {
                    self.poisList = result1.poiList.pois;
                  }
                });
              }

            });
          }
        },
        zoom:12,
        lng: 0,
        lat: 0,
        label: {
          content: '',
          offset: [10, 12]
        },
        centers: [0,0],
        searchOption: {
          // city: '上海',
          // citylimit: true
        },
        markers: [],
      }
    },
    methods:{
      onSearchResult(pois) {
        let latSum = 0;
        let lngSum = 0;
        this.markers = [];
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi;
            console.log(lng,lat);
            lngSum += lng;
            latSum += lat;
            this.markers.push([poi.lng, poi.lat]);
          });
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          };
          this.centers = [center.lng, center.lat];
        };
      },
      //获取地区信息
      getOptions(){
        provinceList.call(this,`?clientVersion=v1&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          if(res.data.code===1){
            this.provinceOptions = res.data.data;
          }
        });
        countyList.call(this,`?clientVersion=v1&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          if(res.data.code===1){
            this.countyOptions = res.data.data;
            this.filterCountyOptions = res.data.data;
          }
        });
        cityList.call(this,`?clientVersion=v1&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          if(res.data.code===1){
            this.cityOptions = res.data.data;
            this.filterCityOptions = res.data.data;
          }
        });
        streetList.call(this,`?clientVersion=v1&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          if(res.data.code===1){
            this.streetOptions = res.data.data;
          }
        });
      },
      //省份变化触发事件
      checkProvince(obj){
        let item = this.provinceOptions.find(items=>{ return items.code === obj});
        this.filterCityOptions = this.cityOptions.filter(items=>{return items.parentId === item.id});
      },
      //市变化触发事件
      checkCity(obj){
        let item = this.cityOptions.find(items=>{ return items.code === obj});
        this.filterCountyOptions = this.countyOptions.filter(items=>{return items.parentId === item.id});
      },
      //区变化触发事件
      checkCounty(obj){
        let item = this.countyOptions.find(items=>{ return items.code === obj});
        this.filterStreetOptions = this.streetOptions.filter(items=>{return items.parentId === item.id});

        this.filterStreetOptions = [{code:111,name:'观音桥街道'}]
      },
      //提交保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              title: this.ruleForm.title,
              areaCode: this.ruleForm.region,
              address: this.ruleForm.particular,
              longitude: this.lng ,
              latitude: this.lat ,
              startTime: this.ruleForm.startData ,
              endTime: this.ruleForm.endData ,
              hotline: this.ruleForm.phone ,
              remark: this.ruleForm.explain,
              clientVersion: 'v1.0',
              clientTimespan: this.$Tool.formatDate(new Date())
            };
            if(this.id){
              param.id = this.id;
            }
            AddOrUpdateOneselfPack.call(this,param).then(res=>{
              if(res.data.code===1){
                this.$message.success(res.data.desc);
                this.$router.push({name:'UserReceiveList'});
              }else{
                this.$message.error(res.data.desc);
              }
            })
          }
        });
      },
      //取消
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.push({name:'UserReceiveList'});
      },
      //查询详情
      getInfo() {
        if (this.id) {
          GetOneselfPackInfo.call(this, `?clientVersion=v1.0&clientTimespan=${this.$Tool.formatDate(new Date())}&oneselfPackId=${this.id}`).then(res => {
            if (res.data.code === 1) {
              this.ruleForm.title = res.data.data.title;
              this.ruleForm.particular = res.data.data.address;
              this.lng = res.data.data.longitude;
              this.lat = res.data.data.latitude;
              this.ruleForm.startData = res.data.data.startTime;
              this.ruleForm.endData = res.data.data.endTime;
              this.ruleForm.phone = res.data.data.hotline;
              this.ruleForm.explain = res.data.data.remark;
              this.ruleForm.province = res.data.data.areaCode.substr(0,2);
              this.ruleForm.city = res.data.data.areaCode.substr(0,4);
              this.ruleForm.region = res.data.data.areaCode;
              this.centers = [res.data.data.longitude,res.data.data.latitude]
              this.centers = [...this.centers]
              this.label.content = this.ruleForm.particular;
            } else {
              this.$message.error(res.data.desc);
            }
          })
        }
      }
    },
    created(){
      this.$parent.change('用户自提');
      this.getOptions();
      // this.getInfo();
    },
    mounted(){
      this.getInfo();
    }
  }
</script>

<style lang="less" scoped>
  @import "less/userReceiveAdd.less";
</style>
