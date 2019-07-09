<template>
  <!--物流收费列表-->
  <div class="container">

  <div  v-show="type === '物流'">
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








    <div class="btn" :class="type === '快递'?'btn-left':''"><el-button type="primary" icon="el-icon-circle-plus-outline" @click="amend(null,null)">添加收费标准</el-button></div>
<!--    <div class="btn"><el-button type="primary" icon="el-icon-circle-plus-outline" @click="addCharge">添加收费标准</el-button></div>-->

<!--    <div class="free">-->
<!--      <div class="main-title"><span>免费配送</span><ul class="main-title-right"><li>最后编辑时间：2017-05-05 25:20</li><li @click="amend">修改</li></ul></div>-->
<!--      <div class="free-table">-->
<!--        <el-table :data="FreeTableData" style="width: 100%" :border="true">-->
<!--          <el-table-column label="运送方式" width="180">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.way }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column label="运送到">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.area }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="计价方式">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.valuationWay }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="首重（kg）">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.fristWeight }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="首费（元）">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.firstMoney }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="续重(kg)">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.addWeight }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="续件(元)">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.addMoney }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->


<!--        </el-table>-->
<!--      </div>-->
<!--    </div>-->

    <div class="charge" v-for="(item,index) in ChargeTableData" :key="index">
      <div class="main-title"><span>{{item.name}}</span>
        <ul class="main-title-right">
          <li>最后编辑时间：{{item.updateTime}}</li>
          <li  @click="amend(item.mbId,'copy')">复制模板</li>
<!--          v-if="isNotFree.includes(index)"-->
          <li @click="amend(item.mbId,'edit')">修改</li>
          <li @click="delExpress(item.mbId)">删除</li>
        </ul>
      </div>
      <div class="charge-table">
        <el-table :data="item.itemInfo" style="width: 100%" :border="true">
          <el-table-column label="运送方式" width="180">
            <template slot-scope="scope">
              <span>{{ item.carryType===1?'物流':'快递' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运送到">
            <template slot-scope="scope">
<!--              <span>{{((!isNotFree.includes(index) && scope.$index===0)?'指定免费配送地区:':(!isNotFree.includes(index) && scope.$index===1)?'非指定地区:':'')+scope.row.area }}</span>-->
              <span>{{(scope.row.allZero===true ? '指定免费配送地区:' : scope.row.allZero === false ?'非指定地区:':'')+scope.row.area }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计价方式">//0、重量 1、包邮 2、件数 3、体积
            <template slot-scope="scope">
              <span>{{ scope.row.type===0?'重量':scope.row.type===2?'件数':scope.row.type===3?'体积':'' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="item.itemInfo[0].type===0?'首重（kg）':item.itemInfo[0].type===2?'首件':item.itemInfo[0].type===3?'首体积（m³）':''">
            <template slot-scope="scope">
              <span>{{ scope.row.allZero?'---':scope.row.firstCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="首费（元）">
            <template slot-scope="scope">
              <span>{{ scope.row.allZero?'---':scope.row.firstMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="item.itemInfo[0].type===0?'续重（kg）':item.itemInfo[0].type===2?'续件':item.itemInfo[0].type===3?'续体积（m³）':''">
            <template slot-scope="scope">
              <span>{{ scope.row.allZero?'---':scope.row.addCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="续费(元)">
            <template slot-scope="scope">
              <span>{{ scope.row.allZero?'---':scope.row.addMoney }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import getExpressList from '../../../../api/goods/logistics/expressList';
  import delExpressInfo from '../../../../api/goods/logistics/delExpressInfo';
  export default {
    name: "logisticsList",
    data(){     //根据数据显示列表页还是设置收费的页面
      return{

        // FreeTableData: [{way: '物流', area:'重庆；安徽省：芜湖、合肥；天津(所有地区); 浙江省:慈溪、杭州、宁波、舟山、金华、绍兴、瑞安、乐清、湖州、义乌、余姚、温州、嘉兴',valuationWay:'按重量',fristWeight:'10',firstMoney:'10',addWeight:'0.00',addMoney:'0.20'}],

        // ChargeTableData:[{way:'物流',area:'重庆；安徽省：芜湖、合肥；天津(所有地区)',valuationWay:'按重量',fristWeight:'10',firstMoney:'10',addWeight:'0.00',addMoney:'0.20'}],
        // type:this.$route.query.type,
        ChargeTableData: [],
        isNotFree:[],
      }
    },
    computed:{
      type(){
        if(this.$route.query.type){
          this.$parent.change(this.$route.query.type);
          return this.$route.query.type;
        }else{
          this.$parent.change('物流');
          return '物流';
        }
      }
    },
    methods:{
      //设置包邮页面
      addCharge(){
        this.$router.push({name:'LogisticsFree',query:{type:this.$route.query.type}});
      },
      //新增模板或修改，复制
      amend(val_1,val_2){
        this.$router.push({name:'LogisticsCharge',query:{type:this.$route.query.type,mbId:val_1,editOrCopy:val_2}});
      },
      getTableData(){
        getExpressList.call(this,`?carryType=${this.$route.query.type==='快递'?0:1}&clientTimespan=${new Date()}`).then(res=>{
          console.log('111',res)
          if(res.data.code === 1){
            this.isNotFree = [];
            this.ChargeTableData = res.data.data.data;
            this.ChargeTableData.map((item,index)=>{
              item.itemInfo.map((items,_index)=>{
                if(items.firstCount===0 && items.firstMoney===0 && items.addCount===0 && items.addMoney===0){
                  let tmp = item.itemInfo[0];
                  item.itemInfo[0] = items;
                  item.itemInfo[_index] = tmp;
                  item.haveAllZero = true;
                  items.allZero = true;
                }
              });

              if(item.haveAllZero){
                item.itemInfo.map((items,_index)=>{
                  if(!items.allZero){
                    items.allZero = false;
                  }
                });
              }

              if(item.itemInfo[0].firstCount!=0 || item.itemInfo[0].firstMoney!=0 || item.itemInfo[0].addCount!=0 ||item.itemInfo[0].addMoney!=0){
                this.isNotFree.push(index);
              }
            })
            console.log(this.ChargeTableData);
            // this.addCharge();
            if(!res.data.data.data || res.data.data.data.length === 0){//没有模板跳转设置包邮模板界面
              this.addCharge();
            }
          }else{
            this.$message.error(res.data.desc);
          }
        })
      },
      //删除模板信息
      delExpress(val){
        this.$confirm('确认删除？').then(_r =>{
          let param= {
            id: val,
            clientVersion: "v1.0",
            clientTimespan: this.$Tool.formatDate(new Date())
          }

          delExpressInfo.call(this,param).then(res=>{
            if(res.data.code===1){
              this.getTableData();
              this.$message.success('删除成功!');
            }else{
              this.$message.error(res.data.desc);
            }
          })
        }).catch(_r => {

        });
      }
    },
    created() {
      this.getTableData();
      // console.log(this.$route)
      // this.$parent.change('快递');  //传给父组件
      //
      // if(this.$route.query.type){
      //   console.log('5555')
      //   this.$parent.change(this.$route.query.type);
      // }
    },
    watch: {
      type: function (val) {
        this.getTableData();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "less/logisticsList.less";
</style>
