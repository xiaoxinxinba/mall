<template>
  <div class="container">
    <el-dialog
      title="下架审核"
      :visible.sync="dialogFlag"
      width="440px"
      center>
        <div class="goods">
          <img :src="goodsSrc" alt="">
          <div class="goods-infor">
            <p>{{goodsName}}</p>
            <p>颜色分类：<span>{{goodsColor}}</span></p>
            <p>商品编号：<span>{{goodsCode}}</span></p>
          </div>
        </div>
        <div>
        <div class="cause"><span>下架原因</span><el-checkbox v-model="checked">厂家换货</el-checkbox></div>
        <div class="reason">
          <span>下架理由</span>
          <el-input class="reason-textarea" type="textarea" :autosize="{ minRows: 3}" placeholder="请输入下架理由" resize="none" v-model="reason"></el-input>
        </div>
        <div class="password" v-show="!showPassWord">
          <span>登录密码</span>
          <el-input class="password-inp" type="password" v-model="password" placeholder="请输入登录密码"><i @click="handlePassWord(true)" slot="suffix" class="iconfont icon-xianshi"></i></el-input>
        </div>
        <div class="password" v-show="showPassWord">
          <span>登录密码</span>
          <el-input class="password-inp" type="text" v-model="password" placeholder="请输入登录密码"><i @click="handlePassWord(false)" slot="suffix" class="iconfont icon-yincang"></i></el-input>
        </div>
        <div class="remark">
          注：商品下架前平台客服将48小时内通过023-67909399与您联系，请保持电话畅通，还可拨打客服热线：<span>400-6766-999</span>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFlag=false">确定</el-button>
        <el-button  @click="dialogFlag=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "soldOut",
    data(){
      return{
        dialogFlag:true,
        goodsSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
        goodsName:'PMT 一体成型 骑行头盔单车头盔 飞娃发阿尔骑行头盔单车头盔 飞娃发阿尔骑行头盔单车头盔 飞娃发阿尔骑行头盔单车头盔 飞娃发阿尔',
        goodsColor:'黑/红（亚光）',
        goodsCode:'123456648642300',
        checked:true,
        reason:'',    //下架原因
        password:'',  //登录密码
        showPassWord:false,
      }
    },
    methods:{
      handlePassWord(bool){
        this.showPassWord=bool
      },
    },
  }
</script>

<style  lang="less" scoped>
  @import "less/soldOut.less";
</style>
