<template>
  <div class="container">
    <div class="title">
      <div class="btn" @click="map">规则地图</div><div class="btn present">规则众议院</div><div>问题解决不了？联系客服：400-6766-99</div>
    </div>
    <div class="line"></div>
<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="全部" name="first">
      <div class="main">
      <div class="search">
        <el-input v-model="titleName" placeholder="标题名称"></el-input>
      </div>
      <ul class="main-show">
        <li v-for="(item,index) in ulList" :key="index">
          <div class="main-show-img"><img :src="item.imgSrc" alt=""></div>
          <p>{{item.Tilte}}</p>
          <div class="main-show-state"><i class="el-icon-time"></i><span>等待结果公示</span></div>
        </li>
      </ul>
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
    </el-tab-pane>
    <el-tab-pane label="即将开始" name="second">即将开始</el-tab-pane>
    <el-tab-pane label="投票中" name="third">投票中</el-tab-pane>
    <el-tab-pane label="等待结果公布" name="fourth">等待结果公布</el-tab-pane>
    <el-tab-pane label="公示中" name="five">公示中</el-tab-pane>
  </el-tabs>
     
  </div>

</template>

<script>
  export default {
    name: "ruleHouse",
    
    data(){
      return{
        currentPage4:4,
        ulList:[
          {imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',Tilte:'关于新增《可食用类违禁添加技术规范》相关规则公开征求意见'},
          {imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',Tilte:'关于新增《可食用类违禁添加技术规范》相关规则公开征求意见'},
          {imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',Tilte:'关于新增《可食用类违禁添加技术规范》相关规则公开征求意见'},
          {imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',Tilte:'关于新增《可食用类违禁添加技术规范》相关规则公开征求意见'},
          {imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',Tilte:'关于新增《可食用类违禁添加技术规范》相关规则公开征求意见'}
        ],
        titleName:'',   //标题名称
        activeName: 'first',
      }
    },
    methods: {
       handleClick(tab, event) {
        console.log(tab, event);
      },
      map(){
        this.$router.push({name:'Regularmap'})
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

<style lang="less" scoped>
  @import "less/ruleHouse.less";
</style>
