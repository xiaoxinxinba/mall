<template>
  <!--平台优惠列表-->
  <div class="container">
    <ul class="title_btn"><li v-for="(item,index) in titleList" :key="index" @click="skip(index)" :class="curIndex === index?'choose':''">{{item}}</li></ul>
    <div class="line"></div>
    <div class="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="300px">
          <template slot-scope="scope">
            <span>{{ scope.row.activityDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名时间" width="300px">
          <template slot-scope="scope">
            <span>{{ scope.row.applyDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售奖励">
          <template slot-scope="scope">
            <span>{{ scope.row.award }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品类目">
          <template slot-scope="scope">
            <span>{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100px" v-if="curIndex === 0||curIndex === 1">
          <template slot-scope="scope">
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template slot-scope="scope">
            <span class="table_btn" @click="apply(scope.$index, scope.row)" v-show="curIndex === 0">立即报名</span>
            <span class="table_btn" @click="goodsSet(scope.$index, scope.row)" v-show="curIndex === 1 || curIndex=== 2">商品设置</span>
            <span class="table_btn" @click="sellSituation(scope.$index, scope.row)" v-show="curIndex === 2 || curIndex=== 3">销售情况</span>
            <span class="table_btn" @click="publishArticle(scope.$index, scope.row)" v-show="curIndex === 2">发布文章</span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="page">
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
</template>

<script>
  export default {
    name: "discountsList",
    data(){
      return{
        titleList:['正在报名','已报名','进行中','已结束'],
        curIndex:0,
        tableData: [{name: '箱包秒杀惠', activityDate:'2017.04.29 00:00 至 2017.05.01 23:59', applyDate:'2017.04.29 00:00 至 2017.05.01 23:59', award:'有', category:'箱包', state:'审核中',},
          {name: '箱包秒杀惠', activityDate:'2017.04.29 00:00 至 2017.05.01 23:59', applyDate:'2017.04.29 00:00 至 2017.05.01 23:59', award:'有', category:'箱包', state:'审核未通过',},
          {name: '箱包秒杀惠', activityDate:'2017.04.29 00:00 至 2017.05.01 23:59', applyDate:'2017.04.29 00:00 至 2017.05.01 23:59', award:'有', category:'箱包', state:'报名成功',},
        ],
        currentPage4: 4,
      }
    },
    methods:{
      skip(index) {
        this.curIndex=index;
      },

      apply(index, row) {
        this.$router.push({name:'activity'})
      },
      goodsSet(index, row) {
        console.log(index, row);
      },
      sellSituation(index, row) {
        console.log(index, row);
      },
      publishArticle(index, row) {
        console.log(index, row);
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
@import "less/discountsList.less";
</style>
