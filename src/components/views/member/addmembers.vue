<template>
    <div class="addmembers">
        <h1>开通会员</h1>
     <ul>
       <li v-for="(item,index) in list" :key="index" :class="Class==index?'active':''" @click="dianji(index)">{{item}}</li>
     </ul>
     <div class="a" v-if="chose==='新增商品'">
       1
     </div>
     <div class="b">
     2
     </div>
     <div class="c">
      3
     </div>
     <div class="b">
    4
     </div>
    </div>
</template>

<script>
export default {
  data() {
      return {
        activeName: 'first',
        list:["新增商品","赠品","优惠","活动"],
        Class:0,
        chose:'新增商品'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      dianji(index){
         this.Class = index;
      }
    }
}
</script>

<style lang="less">
.addmembers{
  ul{
    display: flex;
    li{
      width: 200px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
   
  }
   .active{
      background: yellow;
      color: #fff;
      font-size: 18px;
    }
}
</style>
