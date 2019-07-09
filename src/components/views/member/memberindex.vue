<template>
    <div class="memberindex">
     <ul class="title"><li>会员体系</li><li @click="member">店铺积分</li></ul>
    <System/>
    </div>
    
</template>

<script>
import Integral from './integral'
import System from './assembly/system'
import Systems from '../../../api/Member/System.js'
export default {
   data(){
       return {
     activeName: 'first',
     clientTimespan:new Date().toLocaleString(),
     clientVersion:1
       }
   },
   components:{
       Integral,
       System
   },
   methods: {
        member(){
        this.$router.push({name:'integral'});
      }
   },
   created() {
     
   },
  
}
</script>

<style lang="less" scoped>
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
  li:nth-of-type(1){
    color: #ffffff;
    background: #00a2ff;
  }
}
.active{
    background: skyblue;
}
.navheader{
    display: flex;
    .nav{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 40px;
        background: #ccc;
        margin-right: 10px;
        &:hover{
            cursor: pointer;
        }
    }
}
.el-tabs{
    .el-tabs__header{
        .el-tabs__nav-wrap{
            .el-tabs__nav-scroll{
                width: 100%;
            }
        }
    }
}
</style>
