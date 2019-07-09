<template>
  <!--更新店铺信息-->
  <div class="container">
    <div class="remind">请认真核对已有的信息，并补充缺少的信息，否则将影响交易！</div>
    <div class="main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <div>
          <div class="form_wrap">
            <div class="form_span">
              <span>店铺信息 </span>
            </div>
            <div class="form_box">
              <el-form-item label="网店名称：" prop="shop_name">
                <el-input style="width: 440px;" v-model="ruleForm.shop_name" placeholder="请输入网店名称"></el-input>
                <span class="shop_rules" @click="shopRulesVisible = true"></span>
              </el-form-item>
              <el-form-item label="网店联系电话：" prop="shop_homeNum">
                <el-input style="width: 60px;" v-model="ruleForm.shop_areaNum" placeholder="023"></el-input>
                <span> - </span>
                <el-input style="width: 150px;" v-model="ruleForm.shop_homeNum" placeholder="55555555"></el-input>
                <span> 或&nbsp;</span>
                <el-input style="width: 190px;" v-model="ruleForm.shop_phone" placeholder="联系手机号"></el-input>
              </el-form-item>


              <el-form-item label="其他证件：" >
                <div class="shop_explain">
                  若是专卖店、专营店或是旗舰店，需上传相关证件<span @click="viewNotes">点击查看说明</span>
                </div>
                <div class="shop_upload">
                  <el-upload
                    multiple
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="shopOtherRemove">
                    <i class="el-icon-plus" style="font-size: 14px;">选择图片</i>
                  </el-upload>
                  <el-dialog :visible.sync="shop_otherVisible">
                    <img width="100%" :src="ruleForm.shop_other" alt="">
                  </el-dialog>
                </div>
              </el-form-item>

              <div class="before_span">
                <el-form-item label="网店logo：" >
                  <div class="shop_upload">
                    <el-upload
                      multiple
                      action="https://jsonplaceholder.typicode.com/posts/"
                      list-type="picture-card"
                      :limit="1"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="shopLogoRemove">
                      <i class="el-icon-plus" style="font-size: 14px;">选择图片</i>
                    </el-upload>
                    <el-dialog :visible.sync="shop_logoVisible">
                      <img width="100%" :src="ruleForm.shop_logo" alt="">
                    </el-dialog>
                  </div>

                  <div class="shop_tip">
                    <small class="shop_tip_icon"></small>
                    <div>
                      <h3>温馨提示：</h3>
                      <p>1、请确保图片清晰，尺寸在200*200像素以上</p>
                      <p>2、上传图片后，请通过虚框选择合适的图片区域</p>
                      <p>3、选择好图片区域后，请点击【确定保存】</p>
                      <p>4、拖动图片选择虚框，可以调整大小和位置</p>
                      <p>5、也可上传品牌logo或热销商品图片</p>
                    </div>
                  </div>
                </el-form-item>
              </div>

              <div class="before_span">
                <el-form-item label="网店形象照：" >
                  <div class="shop_upload">
                    <el-upload
                      multiple
                      action="https://jsonplaceholder.typicode.com/posts/"
                      list-type="picture-card"
                      :limit="1"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="shopPhoneRemove">
                      <i class="el-icon-plus" style="font-size: 14px;">选择图片</i>
                    </el-upload>
                    <el-dialog :visible.sync="shop_photoVisible">
                      <img width="100%" :src="ruleForm.shop_photo" alt="">
                    </el-dialog>
                  </div>

                  <div class="shop_tip">
                    <small class="shop_tip_icon"></small>
                    <div>
                      <h3>温馨提示：</h3>
                      <p>1、请确保图片清晰，尺寸在750*240像素以上</p>
                      <p>2、上传图片后，请通过虚框选择合适的图片区域</p>
                      <p>3、选择好图片区域后，请点击【确定保存】</p>
                      <p>4、拖动图片选择虚框，可以调整大小和位置</p>
                      <p>5、此图片展示在店铺首页，请上传整洁且清晰的网店形象照片</p>
                    </div>
                  </div>
                </el-form-item>
              </div>



            </div>
          </div>

          <div class="marginTop_30">
            <el-form-item>
              <el-button @click="goBack">上一步</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
            </el-form-item>
          </div>
        </div>


      </el-form>

    </div>




    <div class="dialog_box">
      <el-dialog
        title="命名限制"
        :visible.sync="shopRulesVisible"
        width="940px">
        <div class="div_line">
          <div>1、其他法律、行政法规规定禁止的</div>
          <div>2、含有不真实内容或者误导消费者的内容</div>
          <div>3、违背公序良俗的不良信息或令人反感的信息</div>
          <div>4、有害于社会主义道德风尚或者有其他不良影响的</div>
          <div>5、夸大宣传并带有欺骗性的，违反广告法的敏感词汇</div>
          <div>6、有损于国家、社会公共利益，或有损民族尊严的文字</div>
          <div>7、同“红十字”、“红新月”的标志、名称相同或者近似的</div>
          <div>8、未经授权的情况下，使用品牌名称、明星或知名人士姓名</div>
          <div>9、含有国际组织名称、国家名称、省、市、县、地名（卖场型除外）</div>
          <div>10、同第三方标志相同或者近似的，如：中国邮政、中国电信、中国移动、中国联通、中国网通和中国铁通等</div>
          <div>11、含有“有限公司”、“公司”、“批发部”、“经营部”、“商行”、“商盟”、“商贸”、“4S店”、“体验店”等文字</div>
          <div>12、含有政党名称、党政军机关名称、群众组织名称、社会团体名称及部队番号，或国家领导人、老一辈革命家的名字或同音字</div>
          <div>13、含有封建、消极影响、违背少数民族习俗、带有民族歧视等内容，有不文明、低俗等不雅词汇，可能对公众造成欺骗或者误解，或引起社会公众不良
            心理反应等情况；</div>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  export default {
    name: "updataShop",
    data () {
      return {
        shop_logoList: [], // 网店logo用到的参数
        shop_logoVisible: false, // 网店logo图片框显示
        shop_photoList: [], // 网店形象照用到的参数
        shop_photoVisible: false, // 网店形象照图片框显示
        shop_otherList: [], //  其他证件用到的参数
        shop_otherVisible: false, // 其他证件图片框显示
        shopRulesVisible: false, // 网店名称命名规则显示框
        viewNotesVisible: false, // 其他证件上传说明模态框
        ruleForm: {
          shop_name: '',
          shop_areaNum: '',
          shop_homeNum: '',
          shop_phone: '',
          shop_logo: '',
          shop_photo: '',
          shop_other: '',
        },
        rules: {
          shop_name: [
            { required: true, message: '请输入网店名称', trigger: 'blur' }
          ],
          shop_homeNum: [
            { required: true, message: '请输入网店联系电话', trigger: 'change' }
          ]
        },
      };
    },

    methods: {
      /**
       * 表单提交
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid,x) => {
          console.log(x);
          console.log(formName, "formName==================");
          if (valid) {
            alert('submit!');
            this.dialogVisible = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        this.$router.push({name:'UpdataBank'});  //下一步
      },



      /**
       * 图片上传方法
       */
      handleAvatarSuccess(res, file) {
        this.ruleForm.shop_logo = URL.createObjectURL(file.raw);
      },
      /*beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },*/

      /**
       * 点击修改执行事件
       */


      /**
       * 返回
       */
      goBack() {
        this.$router.push({name:'UpdataCompany'});
      },

      /**
       * 图片放大
       * @param file
       */
      handlePictureCardPreview (file) {
        this.ruleForm.shop_logo = file.url;
        this.shop_logoVisible = true;
      },

      /**
       * 删除图片(网店logo)
       * @param file
       * @param fileList
       */
      shopLogoRemove (file, fileList) {
        this.shop_logoList.map((item, i) => {
          if (item.url == file.url) {
            this.shop_logoList.splice(i, 1);
          }
        })
      },


      /**
       * 删除图片(网店形象照)
       * @param file
       * @param fileList
       */
      shopPhoneRemove (file, fileList) {
        this.shop_photoList.map((item, i) => {
          if (item.url == file.url) {
            this.shop_photoList.splice(i, 1);
          }
        })
      },

      /**
       * 删除图片(其他证件)
       * @param file
       * @param fileList
       */
      shopOtherRemove (file, fileList) {
        this.shop_otherList.map((item, i) => {
          if (item.url == file.url) {
            this.shop_otherList.splice(i, 1);
          }
        })
      },

      /**
       * 点击查看其他证件上传说明
       */
      viewNotes () {
        alert(123);
      },

    },
    created(){
      this.$parent.change(2);
    }

  }
</script>

<style lang="less" scoped>
  @import "less/updataShop.less";
</style>
