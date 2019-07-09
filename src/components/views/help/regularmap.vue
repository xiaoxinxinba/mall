<template>
    <div class="regularmap">
        <div class="left">
            <div class="header">常见问题</div>
            
        </div>
   <div class="right">
        <div class="title">
      <div class="btn present">规则地图</div><div class="btn" @click="zongyi">规则众议院</div><div>问题解决不了？联系客服：400-6766-99</div>
    </div>
     <div class="line"></div>
     <div class="content">
         <div class="search">
           <el-input v-model="input" placeholder="输入问题关键词，例如：订单" style="width:400px;"></el-input>
            <el-button type="primary">搜索</el-button>
         </div>
         <div class="text" v-for="(item,index) in listData" :key='index'>
             <p class="title">{{item.title}}</p>
             <p>
                {{item.text}}
             </p>
         </div>
         <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
     </div>
   </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
        currentPage4: 4,    
        input:'',
        listData:[
            {title:'如何修改登陆密码？',text:"您好，您购买的商品都是经过细心挑选的，若不影响您的正常使用，建议您可以正常继续使用"},
            {title:'如何修改登陆密码？',text:"您好，您购买的商品都是经过细心挑选的，若不影响您的正常使用，建议您可以正常继续使用"},
            {title:'如何修改登陆密码？',text:"您好，您购买的商品都是经过细心挑选的，若不影响您的正常使用，建议您可以正常继续使用"},
            {title:'如何修改登陆密码？',text:"您好，您购买的商品都是经过细心挑选的，若不影响您的正常使用，建议您可以正常继续使用"}
        ]
        }
    },
    methods: {
        zongyi(){
            this.$router.push({name:'RuleHouse'})
        },
         handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
}
</script>

<style lang="less">
.regularmap{
    display: flex;
    height: 1000px;
    .left{
        width: 14%;
        height: 80%;
        background: red;
        margin:0 10px 0 25px;
        .header{
            background: #00a2ff;
            height: 40px;
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            line-height: 40px;
        }
    }
    .right{
        width: 83%;
        height: 100%;
    }
    .title{
        >div{
            display: inline-block;
            color: #999999;
            font-size: 12px;
        }
        .btn{
            width: 98px;
            height: 36px;
            color: #333333;
            font-size: 16px;
            line-height: 36px;
            text-align: center;
            margin-right: 10px;
            background: #dcdcdc;
            cursor: pointer;
            }
        .present{
            background: #00a2ff;
            color: #ffffff;
        }    

    }
    .line{
        width: 100%;
        height: 2px;
        background-image: linear-gradient(87deg,
        #21d4fb 2%,
        #21a1fb 31%,
        #21cef5 46%,
        #21fbee 62%,
        #01a3ff 100%),
        linear-gradient(
            #00a2ff,
            #00a2ff);
        background-blend-mode: normal,
        normal;
        }
    .content{
        background:#fff;
        padding: 15px;
        height: 100%;
        .text{
            .title{
                color:#00a2ff;
                font-size: 18px;
                font-weight: bold;
                margin:30px 0 10px 0;
            }
        }
        .block{
            margin-top: 300px;
            text-align: center;
        }
    }    
}
</style>
