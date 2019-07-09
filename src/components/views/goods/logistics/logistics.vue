<template>
  <div class="container">
    <ul>
      <li v-for="(item,index) in title" :key="index" :class="item===name?'choose':''" @click="skip(item)">{{item}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        title:['物流','快递','用户自提'],//,'商家自送'
        name:'物流',
      }
    },
    methods:{
      change(val){
        this.name=val
      },
      skip(val){
        if(val==='物流'){this.$router.push({name:'LogisticsList',query:{type:'物流'}})}
        else if(val==='快递'){this.$router.push({name:'LogisticsList',query:{type:'快递'}})}
        else if(val==='商家自送'){this.$router.push({name:'MerchantSend'})}
        else if(val==='用户自提'){this.$router.push({name:'UserReceiveList'})}
      }
    },
    created(){
      this.$parent.change('运费设置');
    },

  }
</script>

<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  ul{
    margin-top: 10px;
    font-size: 0px;
    background: #ffffff;
    border-bottom: 1px solid #e5e5e5;
  }
  li{
    display: inline-block;
    padding: 20px 10px 5px;
    margin: 0px 20px;
    font-size: 14px;
    cursor: pointer;
    position: relative;
  }
  .choose{
    color: #00a2ff;
    &::after{
      content: '';
      display: block;
      width: 100%;
      position: absolute;
      bottom: -1px;
      left: 0px;
      border-bottom: 2px solid #00a2ff;
    }
  }

</style>
