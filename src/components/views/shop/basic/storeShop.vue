<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <!--编辑-->
      <div v-show="pageType === 1">
        <div class="form_wrap">
          <div class="form_span">
            <span>店铺信息 </span>
          </div>
          <div class="form_box">
            <el-form-item label="网店名称：" prop="shop_name">
              <el-input style="width: 440px;" v-model="ruleForm.name" placeholder="请输入网店名称"></el-input>
              <span class="shop_rules" @click="shopRulesVisible = true"></span>
            </el-form-item>
            <el-form-item label="网店联系电话：" prop="shop_homeNum">
              <el-input style="width: 60px;" v-model="ruleForm.areaCode" placeholder="023"></el-input>
              <span> - </span>
              <el-input style="width: 150px;" v-model="ruleForm.telephone" maxlength="11" placeholder="55555555"></el-input>
              <span> 或&nbsp;</span>
              <el-input style="width: 190px;" v-model="ruleForm.mobile" maxlength="11" placeholder="联系手机号"></el-input>
            </el-form-item>

            <div class="before_span">
              <el-form-item label="网店logo：" >
                <div class="shop_upload">
                 <!-- <el-upload
                    multiple
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :limit="1"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="shopLogoRemove">
                    <i class="el-icon-plus" style="font-size: 14px;">选择图片</i>
                  </el-upload>-->
                  <CustomUpload :img="logoUpload"></CustomUpload>
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
                  <!--<el-upload
                    multiple
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :limit="1"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="shopPhoneRemove">
                    <i class="el-icon-plus" style="font-size: 14px;">选择图片</i>
                  </el-upload>-->
                  <CustomUpload :img="mainUpload"></CustomUpload>
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

            <el-form-item label="其他证件：" >
              <div class="shop_explain">
                若是专卖店、专营店或是旗舰店，需上传相关证件<span @click="viewNotes">点击查看说明</span>
              </div>
              <div class="shop_upload">
               <!-- <el-upload
                  multiple
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="shopOtherRemove">
                  <i class="el-icon-plus" style="font-size: 14px;">选择图片</i>
                </el-upload>-->
                <CustomUpload :img="otherUpload"></CustomUpload>
                <el-dialog :visible.sync="shop_otherVisible">
                  <img width="100%" :src="ruleForm.shop_other" alt="">
                </el-dialog>
              </div>
            </el-form-item>

          </div>
        </div>

        <div class="marginTop_30" style="padding-left: 20px;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>

      <!--详情-->
      <div v-show="pageType === 0">
        <div class="form_wrap">
          <div class="form_span">
            <span>店铺信息</span>
          </div>
          <div class="form_box">
            <el-form-item label="网店名称：" >
              <p class="info_p">{{ruleForm.name}}</p>
            </el-form-item>
            <el-form-item label="网店联系电话：" >
              <p class="info_p" v-if="ruleForm.areaCode !== '' && ruleForm.telephone !== '' && ruleForm.mobile !==''">{{ruleForm.areaCode}} - {{ruleForm.telephone}} / {{ruleForm.mobile}}</p>
              <p class="info_p" v-if="ruleForm.mobile ===''">{{ruleForm.areaCode}} - {{ruleForm.telephone}}</p>
              <p class="info_p" v-if="ruleForm.areaCode ==='' || ruleForm.telephone === ''">{{ruleForm.mobile}}</p>
            </el-form-item>
            <el-form-item label="网店logo：" >
              <div class="shopImg_style">
                <viewer :images="shop_logoList">
                  <img v-for="item in shop_logoList" class="vue-lazyload avatar" v-lazy="item.logo" style="width: 70%; height: 70%;" alt="" title="点击查看大图">
                </viewer>
              </div>
            </el-form-item>
            <el-form-item label="网店主图：" >
              <div class="shopImg_style1">
                <viewer :images="shop_photoList">
                  <img v-for="item in shop_photoList" class="vue-lazyload avatar" v-lazy="item.pics" alt="" title="点击查看大图"/>
                </viewer>
              </div>
            </el-form-item>
            <el-form-item label="其他证件：" >
              <div class="shopImg_list">
                <viewer :images="shop_otherList">
                  <img v-for="item in shop_otherList" class="vue-lazyload avatar" v-lazy="item.otherPics" alt="" title="点击查看大图"/>
                  <!--<img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/200/200`" alt="" title="点击查看大图">-->
                </viewer>
              </div>
            </el-form-item>
          </div>
        </div>

        <div class="marginTop_30" style="padding-left: 20px;" v-if="SupplementInformationStatus !== 0">
          <el-button type="primary" @click="edit">修改</el-button>
        </div>
      </div>
    </el-form>

    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="500px">
      <span>修改信息将提交平台审核，确定提交公司信息变更吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>

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
  import GetShopInfo from '../../../../api/ShopInfo/GetShopInfo'
  import ChangeShopInfo from '../../../../api/ShopInfo/ChangeShopInfo'
  import CustomUpload from '@/components/public/customUpload'
  export default {
    components: {
      // upload,
      CustomUpload
    },
    data () {
      return {
        pageType: 0, // 页面类型：0是查看，1是编辑
        dialogVisible: false, // 点击修改时的确认提示
        shop_logoList: [], // 网店logo用到的参数
        shop_logoVisible: false, // 网店logo图片框显示
        shop_photoList: [], // 网店形象照用到的参数
        shop_photoVisible: false, // 网店形象照图片框显示
        shop_otherList: [], //  其他证件用到的参数
        shop_otherVisible: false, // 其他证件图片框显示
        shopRulesVisible: false, // 网店名称命名规则显示框
        viewNotesVisible: false, // 其他证件上传说明模态框
        ruleForm: {
          name: '',
          mobile: '',
          shopLogo: '',
          shopPics: '',
          shopOther:[],
          shop_telephone:'',
          areaCode:'',
          telephone:'',
        },
        rules: {
          name: [
            { required: true, message: '请输入网店名称', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入网店联系电话', trigger: 'change' }
          ]
        },
        logoUpload : { idName: 'logoUpload', limit: 1, imgArr: [] },
        mainUpload : { idName: 'mainUpload', limit: 1, imgArr: [] },
        otherUpload : { idName: 'otherUpload', limit: 4, imgArr: [] },
        data:[],
      };
    },

    computed: {
      //审核状态
      SupplementInformationStatus() {
        return this.$parent.status
      }
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
            this.dialogVisible = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 请求接口，提交数据
       */
      submitData() {
        this.dialogVisible = false;

        let shopLogo = ''
        if(this.logoUpload.imgArr !== null && this.logoUpload.imgArr !== undefined && this.logoUpload.imgArr.length > 0){
          shopLogo = this.logoUpload.imgArr[0]
        }else{
          shopLogo = this.ruleForm.shopLogo
        }


        let shopPics = ''
        if(this.mainUpload.imgArr[0] !== null && this.mainUpload.imgArr[0] !== undefined && this.otherUpload.imgArr.length > 0){
          shopPics = this.mainUpload.imgArr[0]
        }else{
          shopPics = this.ruleForm.shopPics
        }

        let otherPics = []
        if(this.otherUpload.imgArr !== null && this.otherUpload.imgArr !== undefined && this.otherUpload.imgArr.length > 0){
          otherPics = this.otherUpload.imgArr
        }else{
          otherPics = this.ruleForm.shopOther
        }
        console.log(JSON.stringify(otherPics))
        if(this.ruleForm.mobile !== ''){
          var myreg=/^[1][2,3,4,5,7,8,9][0-9]{9}$/;
          if (!myreg.test(this.ruleForm.mobile)) {
            this.$message.error('请正确填写手机号');
            return false;
          }
        }
        let data =
          {
          "areacode": this.ruleForm.areaCode,
          "name": this.ruleForm.name,
          "address": this.data.address,
          "area": this.data.area,
          "mobile": this.ruleForm.mobile,
          "telephone": this.ruleForm.areaCode +"-"+this.ruleForm.telephone,
          "acreage": this.data.acreage,
          "describe": this.data.describe,
          "storeName": this.data.storeName,
          "inputNum": this.data.inputNum,
          "pcLogo": shopLogo,
          "pics": shopPics,
          "otherPics":otherPics,
          "reason":this.data.reason,
          "status": this.data.status,
          "auditTime": this.data.auditTime,
          "shoptype": this.data.shoptype,
          "clientVersion": "v1",
          "clientTimespan": new Date().toLocaleString()
        }
        ChangeShopInfo.call(this,data).then(res=>{
          if(res.data.code === 1){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.goBack()
          }else{
            this.$message.error(res.data.desc);
          }
        })
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
      edit() {
        this.pageType = 1;
      },

      /**
       * 返回
       */
      goBack() {
        this.pageType = 0;
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
    created:async function(){
      this.time = new Date().toLocaleString();
      this.sessionId = sessionStorage.getItem('sessionId');
      GetShopInfo.call(this,`?input.sessionId=${this.sessionId}&input.clientTimespan=${this.time}`).then(res=>{
        if (res.data.code === 1) {
          var data = res.data.data
          console.log(data)
          this.ruleForm.name = data.name
          this.ruleForm.mobile = data.mobile
          this.shop_logoList.push( {logo: data.pcLogo })
          this.ruleForm.shopLogo = data.pcLogo
          this.shop_photoList.push({pics: data.pics })
          this.ruleForm.shopPics = data.pics
          if(data.otherPics !== null && data.otherPics !=="" &&data.otherPics.length != 0){
               for (let i = 0;i<data.otherPics.length;i++) {
                    this.shop_otherList.push({otherPics: data.otherPics[i] });
                    this.ruleForm.shopOther.push(data.otherPics[i])
               }
               console.log(this.ruleForm.shopOther)
          }
          if(data.telephone !== null && data.telephone !== ''){
            if(data.telephone.indexOf('-') > 0){
               this.ruleForm.areaCode = data.telephone.split('-')[0]
               this.ruleForm.telephone = data.telephone.split('-')[1]
            }
          }
          this.data = data
        }
      });
    }
  }
</script>

<style lang="less" scoped>
  @import "./less/information.less";

  .avatar-uploader {
    width: 200px;
    height: 200px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #eee;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }

  /*/deep/ .form_box > div {
    margin-bottom: 10px;
  }*/

</style>
