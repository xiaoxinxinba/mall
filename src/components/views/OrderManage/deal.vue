<template>
  <!--案发生的-->
  <div class="container">
    <ul class="title" v-if="choose">
      <li v-for="(item,index) in list" :class="choose===(index+1)?'choose':''" :key="index">{{index+1}}.{{item}}</li>
    </ul>
    <div class="remind">
      <div class="remind-title">
        <div>
          <span>待处理提醒</span>
          <i :class="isShow?'el-icon-arrow-down':'el-icon-arrow-up' " @click="handleShow"></i>
        </div>
      </div>
      <div class="main"  :class="isShow?'show':'hide'">
        <ul v-show="isShow">
          <li>【待接单】您有 2 个订单未接单，到手的订单可不要轻易错过哦                         <span>09:00</span> </li>
          <li>【待发货】您有 8 个订单未发货，超过3天未发货订单将自动取消                        <span>26日20:00</span></li>
        </ul>
        <div v-show="!isShow">{{infor[index]}}</div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "details",
    data(){
      return{
        list:['买家提交订单','买家付款','商家接单','商家发货','买家确认收货','订单结算'],
        choose:2,
        isShow:false,
        infor:['1111111','22222222','3333333','44444444'],
        index:0,
      }
    },
    methods:{
      change(val){
        this.choose=val
      },
      handleShow(){
        this.isShow=!this.isShow
      }
    },
    created(){
    },
    mounted(){
      let index=0
      setInterval(()=>{
        if(index>=this.infor.length-1){
          index=-1
        }
        index+=1
        this.index=index
      },2000)
    }
  }
</script>

<style lang="less" scoped>
@import "less/details.less";
</style>
