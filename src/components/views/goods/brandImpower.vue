<template>
  <!--品牌授权-->
  <div class="container">
    <h2>
      <div></div>
      <span>品牌授权</span></h2>

    <div class="main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <el-form-item label="请选择您的品牌：" prop="brand" class="brand-choose">
          <el-input v-model="ruleForm.brand" @change="ruleForm.brandId = 0"></el-input>
          <el-button type="primary" @click="search">搜索</el-button>
          <div class="brand-choose-content">未找到需要的品牌？<span @click="applyFor">点此申请新品牌</span></div>
        </el-form-item>

        <el-form-item label="授权到期时间：" prop="date">
          <el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期"
                          :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

        <el-form-item label="商标注册证/品牌授权书：" prop="brandImg" class="brand-img">
          <!--<el-upload-->
          <!--class="avatar-uploader brand-uploader"-->
          <!--action="https://jsonplaceholder.typicode.com/posts/"-->
          <!--:show-file-list="false"-->
          <!--&gt;-->
          <!--<img v-if="ruleForm.brandImg" :src="ruleForm.brandImg" class="avatar">-->
          <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</el-upload>-->
          <CustomUpload :img="brandImage"></CustomUpload>
        </el-form-item>

        <ul class="standard">
          <li>1、如果您是品牌所有者，请上传商标注册证</li>
          <li>2、如果您是经销商/代理商，请上传品牌授权书</li>
          <li>3、请上传加盖了公章的彩色扫描件，支持jpg、png、jpeg格式 <span @click="dialogExample=true">查看示例</span></li>
        </ul>

        <el-form-item class="foot-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">提交审核</el-button>
          <el-button @click="resetForm('ruleForm')">返回</el-button>
        </el-form-item>

      </el-form>
    </div>


    <!--选择品牌弹框-->
    <el-dialog class="dialog-brand" :visible.sync="dialogBrand" width="680px">
      <div slot="title" class="dialog-brand-title">
        <span>选择品牌</span>
        <el-button type="primary" @click="ruleForm.brand,dialogBrand=false">确定</el-button>
        <el-button @click="dialogBrand=false">关闭</el-button>
      </div>
      <ul class="dialog-brand-main">
        <li v-for="(item,index) in brandImgList" :key="index" @click="brandChoose(index,item)"><img
          :src="item.logo" alt="">
          <div class="ico" v-show="chooseIndex===index"><i class="el-icon-check"></i></div>
        </li>
      </ul>
    </el-dialog>

    <!--未找到品牌弹框-->
    <el-dialog class="found" title="提示" :visible.sync="dialogFound" width="610px" center>
      <div class="found-main">
        <p>未找到“奥术大师”</p>
        <p>未找到需要的品牌？<span @click="applyFor">点此申请新品牌</span></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFound = false">确定</el-button>
      </span>
    </el-dialog>


    <!--查看示例弹框-->

    <el-dialog class="example" title="示例" :visible.sync="dialogExample" width="610px" center>
      <ul>
        <li><img :src="exampleLeft" alt="">
          <p>商标注册证</p></li>
        <li><img :src="exampleRight" alt="">
          <p>授权书</p></li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogExample = false">关闭</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import GetBrandByfuzzyName from '../../../../src/api/ShopBrand/GetBrandByfuzzyName'
  import AddOldBrand from '../../../../src/api/ShopBrand/AddOldBrand'
  import UpdateBrand from '../../../../src/api/ShopBrand/UpdateBrand'
  import GetShopBrandDetails from '../../../../src/api/ShopBrand/GetShopBrandDetails'
  import ExistsMyBrand from '../../../../src/api/ShopBrand/ExistsMyBrand'
  import CustomUpload from '@/components/public/customUpload'

  export default {
    name: "brandImpower",
    components: {
      // upload,
      CustomUpload
    },
    data() {
      return {
        brandImage: {idName: 'brandImage', limit: 1, imgArr: []},
        ruleForm: {
          editId: 0,  //默认为0，如果是编辑品牌的话这个字段才有值。
          brandId: 0, //选择后品牌ID字段赋值
          brand: '',
          date: '',
          brandImg: '', //临时写一个默认图片
        },
        rules: {
          brand: [{required: true, message: '请选择品牌', trigger: 'change'}],
          date: [{required: true, message: '请选择授权时间', trigger: 'change'}],
          brandImage: [{required: true, message: '请上传商标注册证/品牌授权书', trigger: 'change'}],
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;  //如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
        dialogBrand: false,     //控制是否显示选择品牌弹框
        brandImgList: [],
        chooseIndex: -1,   //用户选中的下标
        dialogFound: false,  //控制是否显示用户未找到该品牌的弹框
        dialogExample: false,  //控制是否显示查看弹框
        exampleLeft: require('./img/example-left.png'),
        exampleRight: require('./img/example-right.png'),
        sessionId: sessionStorage.getItem('sessionId'),
        time: new Date().toLocaleString(),
        loginType: "PC",
        clientVersion: "1",
        editBrandInfo: this.$route.query.brandInfo,   // 接收编辑对象
        doType: 1,// 1：表示新增品牌授权信息、   2 ：编辑品牌授权信息
      }
    },
    mounted() {
      if (this.editBrandInfo != null || this.editBrandInfo != undefined) {   //如果是编辑品牌，默认渲染对象文本框的数据。
        GetShopBrandDetails.call(this, `?sessionId=${this.sessionId}&brandId=${this.editBrandInfo.id}&clientTimespan=${this.time}`).then(res => {
          if (res.data.code === 1) {   //修改品牌对象赋值
            this.ruleForm.brand = res.data.data.name
            this.ruleForm.date = res.data.data.expireDate
            this.ruleForm.brandImg = res.data.data.logo
            this.ruleForm.brandId = res.data.data.brandId
            this.ruleForm.editId = res.data.data.id
            this.brandImage.imgArr.push(res.data.data.authorizationImg );
            this.doType = 2 //页面操作类型改为修改品牌授权信息。
          }
        })
      }
    },

    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.brandId === 0) {
              this.$message({
                showClose: true,
                message: '请选择品牌！',
                type: 'error'
              });
              return false;
            }
            let model = {
              name: this.ruleForm.brand,
              authorizationImg: this.brandImage.imgArr[0],
              expireDate: this.ruleForm.date,
              sysBrandId: this.ruleForm.brandId,
              sessionId: this.sessionId,
              loginType: this.loginType,
              clientVersion: this.clientVersion,
              clientTimespan: this.time
            };
            if (this.doType == 1) {   //新增品牌授权信息。
              //判断是否存在该品牌
              ExistsMyBrand.call(this, `?brandName=${this.ruleForm.brand}&brandId=${this.ruleForm.brandId}&sessionId=${this.sessionId}&loginType=${this.loginType}&clientVersion=${this.clientVersion}&clientTimespan=${this.time}`).then(res => {
                if (res.data.data === false) {   // 判断是否存在该品牌。不存在该品牌才能新增
                  AddOldBrand.call(this, model).then(res => {
                    if (res.data.code === 1) {
                      this.$message({
                        showClose: true,
                        message: '提交成功，请耐心等待平台审核',
                        type: 'success'
                      });
                      this.$router.push({path: '/goods/brandManage'})
                    }
                  })
                }
                else {
                  this.$confirm("请勿重复提交相同品牌", "提示", {
                    confirmButtonText: "确定",
                    type: "warning"
                  })
                }
              })
            }
            else {   //编辑品牌授权
              model.id = this.ruleForm.editId == 0 ? null : this.ruleForm.editId,
                UpdateBrand.call(this, model).then(res => {
                  if (res.data.code === 1) {
                    this.$message({
                      showClose: true,
                      message: '提交成功，请耐心等待平台审核',
                      type: 'success'
                    });
                    this.$router.push({path: '/goods/brandManage'})
                  }
                })
            }
          } else {
            console.log('error submit!!');
            return;
          }
        });
      },
      resetForm(formName) {   //返回按钮
        this.$refs[formName].resetFields();
        this.$router.go(-1);
      },
      search() {
        if (this.ruleForm.brand === '') {
          this.$message({
            showClose: true,
            message: '请输入品牌名称',
            type: 'error'
          });
          return false;
        }
        GetBrandByfuzzyName.call(this, `?brandName=${this.ruleForm.brand}&sessionId=${this.sessionId }&loginType=${this.loginType}&clientVersion=${this.clientVersion}&clientTimespan=${this.time}`).then(res => {
          if (res.data.code === 1) {
            this.brandImgList = res.data.data;  //品牌列表图片渲染。
            if (this.brandImgList.length === 0)
              this.$confirm("对不起,暂无搜索品牌", "提示", {
                confirmButtonText: "确定",
                type: "warning"
              })
            else
              this.dialogBrand = true
          }
        })
      },
      //选择品牌
      brandChoose(index, obj) {
        this.ruleForm.brandId = obj.id  //选中品牌后品牌对象参数赋值
        this.ruleForm.brand = obj.name
        this.chooseIndex = index
      },
      //申请新品牌跳转
      applyFor() {
        this.$router.push({name: 'BrandAdd'})
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "less/brandImpower.less";
</style>
