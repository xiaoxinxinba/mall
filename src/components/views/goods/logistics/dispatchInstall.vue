<template>
  <div class="container">
    <ul>
      <li v-for="(item,index) in title" :key="index" :class="item===name?'choose':''" @click="aaa(item)">{{item}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "dispatchInstall",
    data(){
      return{
        title:['同城配送费用','搬楼费用','安装费用'],
        name:'同城配送费用',
        abc:[],
        pageType:'同城配送费用',
      }
    },
    methods:{
      change(val){
        this.name=val
      },
      aaa(item){
        if(item==='同城配送费用'){
          // this.abc=[0,1];
          this.pageType='同城配送费用';
        }else if(item==='搬楼费用'){
          // this.abc=[1,1];
          this.pageType='搬楼费用';
        }else if(item==='安装费用'){
          // this.abc=[2,1];
          this.pageType='安装费用';
        }

        this.$router.push({name:'DispatchList',query:{pageType:this.pageType}});
      },
    },
    created(){
      this.$parent.change('配送安装费用设置');


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
