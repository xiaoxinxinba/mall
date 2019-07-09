<template>
  <div class="adticle_box">
    <div class="line"></div>
    <div class="edit_box">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="文章标题" prop="name">
          <el-input v-model="ruleForm.name" style="width: 500px;"></el-input>
        </el-form-item>

        <el-form-item label="文章分类" prop="categary">
          <el-select v-model="ruleForm.categary" placeholder="请选择" style="width: 300px;">
            <el-option
              v-for="item in cateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片" prop="pic">
          <!-- <el-upload
             class="avatar-uploader"
             action="https://jsonplaceholder.typicode.com/posts/"
             :show-file-list="false"
             :on-success="handleAvatarSuccess"
           >
             &lt;!&ndash;<img v-if="ruleForm.pic" :src="ruleForm.pic" class="avatar">
             <i v-else class="el-icon-plus avatar-uploader-icon"></i>&ndash;&gt;
           </el-upload>-->
          <CustomUpload :img="ruleForm.pic"></CustomUpload>
        </el-form-item>

        <el-form-item label="文章编辑" prop="content">
          <vue-ueditor-wrap v-model="ruleForm.content"></vue-ueditor-wrap>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交审核</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import SaveArticle from '../../../../../src/api/article/SaveArticle'
  import DeleteArticle from '../../../../../src/api/article/DeleteArticle'
  import GetArticleDetails from '../../../../../src/api/article/GetArticleDetails'
  import CustomUpload from '@/components/public/customUpload'

  export default {
    components: {
      VueUeditorWrap,
      CustomUpload
    },
    data() {
      return {
        ruleForm: {
          id: 0,
          name: '',
          categary: '',
          pic: {idName: 'ttt', limit: 1, imgArr: []},
          content: '输入内容',
          articleId: '',
          categaryId: '',
          extension:'',
          updateTime:'',
          addTime:'',
          status:'',
          isPublish:'',
          praiseCount:'',
          favoriteCount:'',
          pageView:'',
          shopId:'',
        },
        clientVersion: '1',
        clientTimespan: new Date().toLocaleString(),
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 10, max: 30, message: '长度在 10 到 30 个字符', trigger: 'blur'}
          ],
          categary: [
            {required: true, message: '请选择文章分类', trigger: 'change'}
          ],
          pic: [
            {required: true, message: '请上传图片', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请编辑文章', trigger: 'change'}
          ],
        },
        cateOptions: [{
          value: 0,
          label: '居家生活'
        }, {
          value: 1,
          label: '手机数码'
        }, {
          value: 2,
          label: '服装服饰'
        }],
      };
    },
    methods: {
      //保存文章,返回则保存为草稿
      saveArticle(commitType) {
        /*console.log(('--------------aa---------------------------------------------------------------------------------'));
        console.log(this.ruleForm.articleId);*/
       /* if (this.ruleForm.articleId !== '') {
          articleId = this.ruleForm.articleId;
        }
        let categoryId = this.ruleForm.categary;
        if (this.ruleForm.categaryId !== '') {
          categoryId = this.ruleForm.categaryId;
        }*/

        let model = {
          id:this.ruleForm.id,
          title: this.ruleForm.name,
          categoryId: this.ruleForm.categary,
          coverPicture: this.ruleForm.pic.imgArr[0],
          content: this.ruleForm.content,
          commitType: commitType,
          articleId: this.ruleForm.articleId,
          clientVersion: this.clientVersion,
          clientTimespan: this.clientTimespan,
        };
        SaveArticle.call(this, model)
          .then(
            res => {
              if (res.data.code === 1) {
                /*console.log(('----------------保存文章-----------------------------------------------------------------------------------'));
                console.log(res.data.data);*/
                //有id就是编辑，删除
                if (commitType === 0) {
                  if (this.ruleForm.id !== 0) {
                    this.deleteArticle(this.ruleForm.id);
                  }
                  //alert('保存成功');
                  //this.$router.go(-1);
                  this.$router.push({name: 'MarketArticleMain'});
                } else if (commitType === 1) {
                  this.$message.success('已保存到草稿箱');
                }
              }
            }
          )
      },

      //删除文章
      deleteArticle(id) {
        DeleteArticle.call(this, {
          articleId: id,
          clientVersion: this.clientVersion,
          clientTimespan: this.clientTimespan,
        }).then(
          res => {
            if (res.data.code === 1) {
              this.$message.success('编辑成功');
              console.log(('进行了删除操作'));
            }
          }
        )
      },

      //获取文章
      getArticleDetails(id) {
        GetArticleDetails.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan
          + '&articleId=' + id)
          .then(
            res => {
              if (res.data.code === 1) {
                /*console.log(('----------------传过来参数------------------------------------------------------------------'));
                console.log(res.data.data);*/
                 this.ruleForm.id=res.data.data.id;
                 this.ruleForm.categary=res.data.data.categoryId;
                 this.ruleForm.name=res.data.data.title ;
                 this.ruleForm.pic.imgArr.push(res.data.data.coverPicture ) ;
                 this.ruleForm.articleId =res.data.data.articleId   ;
                 //this.ruleForm.extension=extension ,
                 this.ruleForm.updateTime=res.data.data.updateTime  ;
                 this.ruleForm.addTime=res.data.data.addTime  ;
                 this.ruleForm.status=res.data.data.status  ;
                 //只有.ruleForm通过了审核才能进行其他操作，否则只能编辑
                 //this.ruleForm.stateNum=res.data.data.status,
                 this.ruleForm.content =res.data.data.content  ;
                 this.ruleForm.remark =res.data.data.remark  ;
                 this.ruleForm.isPublish =res.data.data.isPublish  ;//0未发布、1发布 ,
                 this.ruleForm.praiseCount =res.data.data.praiseCount ;
                 this.ruleForm.favoriteCount =res.data.data.favoriteCount;
                 this.ruleForm.pageView =res.data.data.pageView ;
                 this.ruleForm.shopId =res.data.data.shopId ;
              }
            }
          )
      },

      submitForm(formName) {
        this.saveArticle(0);
        /*this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });*/
      },
      /**
       * 返回
       */
      goBack() {
        this.saveArticle(1);
        this.$router.go(-1);
      },

      /**
       * 图片上传方法
       */
      handleAvatarSuccess(res, file) {
        this.ruleForm.pic = URL.createObjectURL(file.raw);
      },

    },
    watch: {
      'child.idname'(val) {
      }
    },
    created() {
      if (this.$route.query.tableId !== undefined) {
        this.getArticleDetails(this.$route.query.tableId);
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";

  .avatar-uploader {
    width: 250px;
    height: 160px;
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
    width: 250px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 250px;
    height: 160px;
    display: block;
  }
</style>
