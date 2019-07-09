<template>
  <!--消息中心-->
  <div class="container">
    <ul class="title_btn">
      <li v-for="(item,index) in titleList" :key="index" @click="skip(index)" :class="curIndex === index?'choose':''"><span>{{item}}</span></li>
    </ul>
    <div class="filtrate">
      <div><el-checkbox v-model="checked">全选</el-checkbox></div>
      <div><el-select v-model="condition" clearable  placeholder="请选择"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></div>
      <div><div class="filtrate_btn">删除</div></div>
      <div><p>站内信保存时间为3个月，系统会自动删除过期信件。</p></div>
    </div>

    <div class="main">

      <div class="list" v-for="item in 5">
        <div class="list_title"><el-checkbox v-model="check1">新订单接单</el-checkbox><div><span>2017-08-09 17:31:05</span><i class="el-icon-close"></i></div></div>
        <div class="list_content">
          亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询！
          <div class="look_details"><span>查看详情></span></div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: "infoCenter",
    data() {
      return {
        titleList:['全部信件','审核回执','交易提醒','售后提醒','商品提醒','纠纷提醒','其他','财务','平台通知'],
        curIndex:0,
        checked:false,
        options: [{value: '全部', label: '全部'},
          {value: '已读', label: '已读'},
          {value: '未读', label: '未读'},],
        condition: '',
        check1:false,
      };
    },
    methods: {
      skip(index) {
        this.curIndex=index;
      },
    }
  }
</script>

<style lang="less" scoped>
@import "less/infoCenter.less";
</style>
