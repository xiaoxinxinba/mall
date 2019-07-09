<template>
    <div class="integral">
       <ul class="title"><li @click="member">会员体系</li><li>店铺积分</li></ul>
  <el-tabs v-model="activeName2" type="card">
    <el-tab-pane label="积分发放" name="first"><Integralpayment/></el-tab-pane>
    <el-tab-pane label="积分兑换" name="second"><Exchange/></el-tab-pane>
  </el-tabs>
    </div>
</template>

<script>
import Integralpayment from './integral/integralpayment'
import Exchange from './integral/exchange'
export default {
data(){
    return {
      activeName2:'first'
    }
},
methods: {
    member(){
        this.$router.push({name:'memberindex'});
      }
},
components:{
Integralpayment,
Exchange
}
}
</script>

<style lang="less" scoped>
.integral{
   .title{
  li{
    display: inline-block;
    width: 120px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #d5d5d5;
    margin-right: 10px;
    cursor: pointer;
  }
  li:nth-of-type(2){
    color: #ffffff;
    background: #00a2ff;
  }
  }

}


</style>
