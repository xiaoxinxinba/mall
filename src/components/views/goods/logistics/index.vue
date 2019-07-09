<template>
  <div class="container">
    <ul>
      <li v-for="(item,index) in title" :key="index" :class="name===item?'choose':''" @click="skip(item)">{{item}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        title:['运费设置','配送安装费用设置','地址管理'],
        name:'运费设置'
      }
    },
    methods:{
      change(val){
        this.name=val;
      },
      skip(val){
        if(val==='运费设置'){this.$router.push({name:'LogisticsList'})}
        else if(val==='配送安装费用设置'){this.$router.push({name:'DispatchList'})}
        else if(val==='地址管理'){this.$router.push({name:'AreaManage'})}
      },
    },
    created(){

    },
    watch:{

    }
  }
</script>

<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  ul{
    font-size: 0px;
    li{
      display: inline-block;
      width: 130px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      color: #333333;
      margin-right: 5px;
      background: #d5d5d5;
      cursor: pointer;
    }
    .choose{
      background: #00a2ff;
      color: #ffffff;
    }
  }
</style>
