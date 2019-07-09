<template>
  <div class="addDiscount_box">

    <div class="title_box">
      <ul>
        <li class="active"><span v-if="pageType === 'add'">添加</span><span v-if="pageType === 'edit'">编辑</span><span v-if="pageType === 'detail'">查看</span>赠品信息</li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-width="100px">
      <el-form-item label="赠品名称" prop="title">
        <el-input style="width: 400px;" v-model="ruleForm.title" :disabled="pageType === 'detail' ? true : false"></el-input>
        <span class="add_font">0/20</span>
      </el-form-item>

      <el-form-item label="赠品名称" prop="descr">
        <el-input type="textarea" :rows="6" :disabled="pageType === 'detail' ? true : false" placeholder="请输入赠品的介绍，限60字" style="width: 600px;" v-model="ruleForm.descr"></el-input>
      </el-form-item>

      <el-form-item label="市场价格" required>
        <div class="add_line">
          <el-input v-model="ruleForm.price" style="width: 180px;" :disabled="pageType === 'detail' ? true : false"></el-input>
          <span class="add_span">元</span>
          <i>（此价格只用于赠品信息展示，不计入订单金额）</i>
        </div>
      </el-form-item>

      <el-form-item label="上传赠品图片" v-if="pageType !== 'detail'">
        <div>
          <div class="shop_main_pic">
            <ul> <!--拖动调整图片顺序（vue.Draggable ）-->
              <draggable
                :list="mainPicData"
                :disabled="!enabled"
                class="list-group"
                ref="imgInfo"
                ghost-class="ghost"
                @start="dragging = true"
                @end="dragging = false"
              >
                <li v-for="(item, index) in mainPicData" :key="index">
                  <CustomUpload :img="item"></CustomUpload>
                  <span v-if="index === 0 && item.imgArr.length > 0">主图</span>
                  <span v-if="item.imgArr.length <= 0">上传图片</span>
                </li>
                <!-- <el-upload
                  class="avatar-uploader mt-20"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :http-request="uploadSectionFile">
                  <template v-for="(item,i) in mainPicData">
                    <img width="140px" height="140px" v-if="item" :src="item" class="mr-1" :key="i">
                  </template>
                  <img v-if="mainPicData.length < 5"  width="140px" height="140px" class="mr-1" src="item.src" alt="">{{mainPicData.length}}/5
                </el-upload> -->
              </draggable>
            </ul>
          </div>

          <div class="shop_main_pic">
            <div class="main_pic_tips">
              <h3>图片上传说明：</h3>
              <p>1、您的商品图片会展示给用户，请确保图片清晰和美观</p>
              <p>2、建议上传 600*600 像素的图片，支持JPG，JEPG，PNG格式</p>
              <p>3、点击拖动调整图片顺序</p>
            </div>
            <div class="main_pic_tips">
              <h3>图片质量要求：</h3>
              <p>1、请尽量上传商品各个角度拍摄的照片，比如正面、侧面、背面、内部等</p>
              <p>2、商品照片要求质感柔和、光泽均匀、颜色纯厚</p>
              <p>3、拍摄前要确保产品状态良好，比如外观正常、没有裂纹、没有划痕、没有褶皱、没有破损</p>
            </div>
            <div class="main_pic_tips">
              <a href="#">更多要求 >></a>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="赠品图片" v-if="pageType === 'detail'">
        <div>
          <div class="shop_main_pic">
            <ul> <!--拖动调整图片顺序（vue.Draggable ）-->
              <viewer :images="content">
                <li v-for="(item, index) in content" :key="index">
                  <img class="vue-lazyload pic" v-lazy="item" alt="" title="点击查看大图" />
                  <!-- <span v-if="index === 0 && item !== ''">主图</span> -->
                  <span v-if="index === 0 && item.length > 0">主图</span>
                </li>
              </viewer>
            </ul>
          </div>
        </div>
      </el-form-item>

      <el-form-item style="margin-top: 60px;">
        <el-button v-if="pageType !== 'detail'" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="calcle">返 回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="sureDialogVisible"
      width="500px">
      <div>
        <p>活动将在开始时间自动发布，发布后将不能修改，确认添加？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sureDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="cancleDialogVisible"
      width="500px">
      <div>
        <p>你已编辑了活动信息，确认放弃？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goBack">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import draggable from "vuedraggable";
  import addGift from '../../../../../src/api/giftPromotion/addGift';
  import queryGiftProdctInfo from '../../../../../src/api/giftPromotion/queryGiftProdctInfo';     //查询赠品详细
  import GetPolicySignature from '../../../../../src/api/GetPolicySignature';
  import CustomUpload from '@/components/public/customUpload'

  export default {
    mounted () {
      this.shopId = JSON.parse(sessionStorage.getItem('tokenInfo')).shopId;
      if(this.pageType!="add"){
        this.queryGift();
      }
      if(this.pageType=="add"){
        // this.mainPicData=["","","","",""]
      }
    },
    components: {
      draggable,
      CustomUpload
    },
    data () {
      return {
        pageType: this.$route.query.type,
        freeGiftId:this.$route.query.id,
        sureDialogVisible: false, // 点击确定的提示框
        cancleDialogVisible: false, // 点击取消的提示框
        ruleForm: {
          title: '',
        },
        rules: {
          title: [
            { required: true, message: '请输入赠品名称', trigger: 'blur' },
          ],
          descr: [
            { required: true, message: '请输入赠品名称', trigger: 'blur' },
          ],
        },
        shopId:'',
        mainPicData: [ // 商品主图图片数据
          { idName: 'img1', limit: 1, imgArr: [] },
          { idName: 'img2', limit: 1, imgArr: [] },
          { idName: 'img3', limit: 1, imgArr: [] },
          { idName: 'img4', limit: 1, imgArr: [] },
          { idName: 'img5', limit: 1, imgArr: [] }
        ],
        enabled: true, // 图片拖动参数
        dragging: false,
        content:[],
      }
    },
    methods: {

      submitForm(formName) {
        this.content=[];
        this.mainPicData.map(item => {
                if ( item.imgArr.length > 0 ) {
                  if(item.imgArr[0]!=""){
                    this.content.push( item.imgArr[0]);
                  }
                }
              });
        if(this.pageType=='edit'){      //修改
           let InsertGiftActivityInput={
               type: 1,            //0为新增1为修改
               clientVersion:'1.0.0',
              clientTimespan:'2019-05-21 19:34',
              gift: {
                id: this.freeGiftId,
                shop_id: this.shopId,
                title: this.ruleForm.title,
                descr: this.ruleForm.descr,
                price: this.ruleForm.price,
                pics: this.content.join(",")
              }
            }
            addGift.call(this, InsertGiftActivityInput).then(res => {     //修改
              if(res.data.code===1){
                this.$message.success("修改成功");
                this.goBack();
              }else{
                this.$message.error("修改失败");
              }
          })
        }else{      //新增
          let InsertGiftActivityInput={
              type: 0,
              clientVersion:'1.0.0',
              clientTimespan:'2019-05-21 19:34',
              gift: {
                id: 0,
                shop_id: this.shopId,
                title: this.ruleForm.title,
                descr: this.ruleForm.descr,
                price: this.ruleForm.price,
                pics: this.content.join(",")
              }
            }
          addGift.call(this, InsertGiftActivityInput).then(res => {
              if(res.data.code===1){
                this.$message.success("添加成功");
                this.goBack();
              }else{
                this.$message.error("添加失败");
              }
          })
        }
      },
      queryGift(){      //查询详情
        let id=this.freeGiftId;   //赠品Id
        this.clientTimespan = new Date().toLocaleString();
        queryGiftProdctInfo.call(this,`?input.type=0&input.id=${id}&input.clientTimespan=${this.clientTimespan}`).then(res=>{
          if (res.data.code===1) {
            let imgageInfo=res.data.data.pics.split(",");   //获取赠品图片集合
            this.mainPicData=[];
            for(let i=0;i<5;i++){
              let imgs=[];
              let img=imgageInfo[i];
              if(img==undefined){
                  img="";
              }
              imgs.push(img);
              this.mainPicData.push({ "idName":"img"+i,"limit": "1", "imgArr": [img]});
            }
            console.log(this.mainPicData);
            this.ruleForm=res.data.data;
            this.shopId=res.data.data.shop_id;
            this.mainPicData.map(item => {
                if ( item.imgArr.length > 0 ) {
                  if(item.imgArr[0]!=""){
                    this.content.push( item.imgArr[0]);
                  }
                }
              });
          } else {
            this.$message.error("查询详情失败！");
          }
        })
      },
      uploadSectionFile(file) { // 图片上传
        let param = new FormData(); //创建form对象
        param.append('multipartFile', file.file);//通过append向form对象添加数据
      },
      calcle() {
        if(this.pageType!='detail'){
          this.cancleDialogVisible = true;
        }else{
          this.goBack();
        }
      },
      goBack() {
        this.$router.go( -1 );
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";

  .upload_list{
    ul{
      li{
        width: 120px !important;
        height: 120px !important;
      }
    }
  }

</style>
