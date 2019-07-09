<template>
  <!--商家自送-->
  <div class="container">
    <div class="title"><span></span>新增运费模板</div>
    <div class="remind"><i class="el-icon-warning"></i>请查看参考运费设置运费，以免运费过高影响到您店铺商品的销售</div>
    <div class="main">
      <ul>
        <li>
          <div class="main-title">生鲜、水果、零食、生活急需备用品</div>
          <ul class="main-box">
            <li><span class="main-label">配送距离：</span><span class="main-content">10公里</span><span class="main-redact" @click="redact">编辑</span></li>
            <li><span class="main-label">配送时效：</span><span class="main-content">2小时</span></li>
            <li><span class="main-label">配送时间：</span><span class="main-content">9:00 - 22:00</span></li>
            <li><span class="main-label">配送费：</span>
              <span v-show="isRedact" class="main-content">5元</span>
              <el-input v-show="!isRedact" class="cost" v-model="cost" placeholder="请输入内容"></el-input>
            </li>
            <li v-show="!isRedact" class="main-btn"><el-button type="primary" @click="save">保存</el-button></li>
          </ul>
        </li>

        <li>
          <div class="main-title">体积不大，不重、不需要安装等产品</div>
          <ul class="main-box">
            <li><span class="main-label">配送距离：</span><span class="main-content">10公里</span><span class="main-redact" @click="redact">编辑</span></li>
            <li><span class="main-label">配送时效：</span><span class="main-content">2小时</span></li>
            <li><span class="main-label">配送时间：</span><span class="main-content">9:00 - 22:00</span></li>
            <li><span class="main-label">配送费：</span>
              <span v-show="isRedact" class="main-content">5元</span>
              <el-input v-show="!isRedact" class="cost" v-model="cost" placeholder="请输入内容"></el-input>
            </li>
            <li v-show="!isRedact" class="main-btn"><el-button type="primary" @click="save">保存</el-button></li>
          </ul>
        </li>


        <li>
          <div class="main-title">体积大、太重、需要安装</div>
          <ul class="main-box">
            <li><span class="main-label">配送距离：</span><span class="main-content">10公里</span><span class="main-redact" @click="redact">编辑</span></li>
            <li><span class="main-label">配送时效：</span><span class="main-content">2小时</span></li>
            <li><span class="main-label">配送时间：</span><span class="main-content">9:00 - 22:00</span></li>
            <li><span class="main-label">配送费：</span>
              <span v-show="isRedact" class="main-content">5元</span>
              <el-input v-show="!isRedact" class="cost" v-model="cost" placeholder="请输入内容"></el-input>
            </li>
            <li v-show="!isRedact" class="main-btn"><el-button type="primary" @click="save">保存</el-button></li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="title"><span></span>提示</div>
    <div class="hint">
      <ul>
        <div>送达时效：</div>
        <li>1，生鲜、水果、零食、生活急需用品必须在2小时内送达 </li>
        <li>2，体积不大、不重、不需要安装的商品必须在4小时内送达 。</li>
        <li>3，体积大、较重、需要安装的商品必须在24小时内送达 。</li>
      </ul>
      <ul>
        <div>配送费：</div>
        <li>1，10公里运费不超过2元 。</li>
        <li>2，20公里运费不超过4元 。</li>
        <li>3，60公里免运费 。</li>
      </ul>
      <ul>
        <div>配送方式：</div>
        <li>1，可由商家自送或委托配送公司 。</li>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    name: "merchantSend",
    data(){
      return{
        isRedact:true,
        cost:'',

      }
    },
    methods:{
      //编辑
      redact(){
        this.isRedact=false;
      },
      //保存
      save(){
        this.isRedact=true;
      },
    },
    created(){
      this.$parent.change('商家自送');
    }
  }
</script>

<style lang="less" scoped>
  @import "less/merchantSend.less";
</style>
