<template>
  <!--资质证件-->
  <div class="container">
    <ul class="menu"><li v-for="(item,index) in list" :key="index" @click="skip(index)" :class="current===index?'skip':''"><span>{{item}}</span></li></ul>

    <!--已上传-->
    <div class="already" v-show="current===0">
      <el-table
        :data="tableDataAlready"
        style="width: 100%" :border="true">
        <el-table-column label="经营范围">
          <template slot-scope="scope">
            <span>{{ scope.row.cateTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资质名称">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证件有效期至">
          <template slot-scope="scope">
            <span>{{ scope.row.deadlineTime.indexOf("9999") != -1 ? '永久有效' : scope.row.deadlineTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span :class="scope.row.status ===2?'state-no':scope.row.status ===0?'state-pass':'stateing'">{{ scope.row.status===0?'通过':scope.row.status===1?'待审核':'未通过' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原因">
          <template slot-scope="scope">
            <span>{{ scope.row.rejectReason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="我的证件" class-name="self-img" min-width="138px">
          <template slot-scope="scope">
              <viewer class="describe-ul-img" :image="scope.row.imgUrl">
                <div class="self-license">

                <img class="papers avatar" :src="scope.row.imgUrl" alt="" title="点击查看大图">
                </div>

              </viewer>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <span class="operation" :class="scope.row.status === 1 ?'stateing':''" @click="upload(scope.$index, scope.row)">{{scope.row.status===0?'更新':'重新上传'}}</span>
            <span class="operation" :class="scope.row.status === 1 ?'stateing':''" v-show="scope.row.status !== 0 " @click="uploadPostpone(scope.$index, scope.row)">延期上传</span>
<!--            <span class="operation" @click="lookCertificate(scope.$index, scope.row)">查看证件示例</span>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--延期上传-->
    <div class="postpone" v-show="current===1">
      <el-table
        :data="tableDataPostpone"
        style="width: 100%" :border="true">
        <el-table-column label="经营范围">
          <template slot-scope="scope">
            <span>{{ scope.row.cateTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资质名称">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划上传时间">
          <template slot-scope="scope">
            <span>{{ scope.row.commitmentTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="我的证件">
          <template slot-scope="scope">
            <viewer class="describe-ul-img" :image="scope.row.imgUrl">
              <img class="papers vue-lazyload avatar" v-lazy="scope.row.imgUrl" alt="" title="点击查看大图">
            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <span class="operation" :class="scope.row.state === '审核中'?'stateing':''"  @click="upload(scope.$index, scope.row)">上传</span>
<!--            <span class="operation" @click="lookCertificate(scope.$index, scope.row)">查看证件示例</span>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--未上传-->
    <div class="without"  v-show="current===2">
      <el-table
        :data="tableDataWithout"
        style="width: 100%" :border="true">
        <el-table-column label="经营范围">
          <template slot-scope="scope">
            <span>{{ scope.row.cateTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资质名称">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <span class="operation" @click="upload(scope.$index, scope.row)">上传</span>
            <span class="operation" @click="uploadPostpone(scope.$index, scope.row)">延期上传</span>
<!--            <span class="operation" @click="lookCertificate(scope.$index, scope.row)">查看证件示例</span>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="btn">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="info" @click="goBack">返回</el-button>
    </div>


    <!--重新上传,更新-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogUpload"
      width="520px"
      center>
      <div class="dialog-upload">
        <div><span>证件到期时间：</span>
          <el-date-picker v-model="expireTime" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div><span></span><el-checkbox style="margin-left: 100px;" v-model="checked" :disabled="isChecked">永久有效</el-checkbox></div>
        <div class="upload">
          <span>上传证件：</span>
          <div class="test">
            <CustomUpload :img="child"></CustomUpload>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="againUp">提交</el-button>
      </span>
    </el-dialog>

    <!--延期上传-->
    <el-dialog
      title="延期上传"
      :visible.sync="dialogPostpone"
      width="520px"
      center>
      <div class="postpone-upload">
        <div><span>计划上传时间：</span><el-date-picker v-model="postponeTime" type="date" placeholder="选择日期"></el-date-picker></div>
        <div class="postpone-reason"><span>原因说明：</span><el-input type="textarea" v-model="postponeReason" :autosize="{ minRows: 4}" placeholder="200字以内" maxlength="200" show-word-limit resize="none"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lazyUp">提交</el-button>
      </span>
    </el-dialog>

    <!--查看证件示例-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogLook"
      width="520px"
      center>
      <div class="dialog-look">
        <img :src="lookSrc" alt="">
      </div>
    </el-dialog>





  </div>
</template>

<script>
  import shopCredentials from '../../../../api/ShopBusinessScope/ShopCredentials';
  import changeShopCredential from '@/api/ShopBusinessScope/ChangeShopCredential';
  import CustomUpload from '@/components/public/customUpload'
  export default {
    components:{
      CustomUpload,
    },
    data(){
      return{
        list:['已上传','延期上传','未上传'],
        current:0,
        tableDataAlready: [],
        tableDataPostpone: [],
        tableDataWithout: [],
        // tableDataAlready: [{rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证', date: '2016-05-02', state:'审核中', reason:'图片模糊', imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //   {rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证', date: '2016-05-02', state:'未通过', reason:'图片模糊', imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //   {rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证', date: '2016-05-02', state:'通过', reason:'图片模糊', imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //
        // ],
        // tableDataPostpone: [{rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证', date: '2016-05-02', state:'审核中',imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //   {rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证', date: '2016-05-02', state:'同意延期', imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //   {rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证', date: '2016-05-02', state:'同意延期', imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //
        // ],
        // tableDataWithout: [{rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证',imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //   {rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证',imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //   {rang:'彩妆工具 > BB霜 > 12PCS', name:'化妆品经营许可证',imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'],},
        //
        // ],
        dialogTitle:'资质证件名称',
        dialogUpload:false,
        expireTime:'',  //到期时间
        imageUrl: '',
        dialogPostpone:false,
        postponeTime:'',  //延期时间
        postponeReason:'',
        dialogLook:false,
        lookSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/7shbd7QGHha.jpg',

        nowItem: {},
        commitData:{
          credentials: [],
          clientVersion: "v1.0",
          clientTimespan: this.$Tool.formatDate(new Date())
        },



        child: {
          idName: 'qqq', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        checked:false,
      }
    },
    computed:{
      isChecked(){
        if(this.expireTime === '' || this.expireTime === null){
          return false
        }else{
          this.checked=false;
          return true
        }
      }
    },
    methods:{
      //加载数据
      getData(){
        shopCredentials.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          if(res.data.code===1){
            this.tableDataWithout=[];
            this.tableDataAlready=[];
            this.tableDataPostpone=[];
            res.data.data.map(item=>{
              item.credentials.map(items=>{
                items.cateId = item.cateId;
                items.cateTitle = item.cateTitle;
                if(items.uploadType=== -1 ){//未上传
                  this.tableDataWithout.push(items);
                }else if(items.uploadType===0){//已上传
                  this.tableDataAlready.push(items);
                }else{//延迟上传
                  this.tableDataPostpone.push(items);
                }
              })
            })
          }else{
            this.$message.error(res.data.desc);
          }
        })
      },
      skip(index){
        this.current=index;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      //重新上传，更新
      upload(index, row){
        console.log(index,row);
        if(row.status===1){
          return false;
        }else{
          this.dialogUpload=true;
          this.nowItem = row;
        }
      },
      //延迟上传
      uploadPostpone(index, row){
        if(row.status===1){
          return false;
        }else{
          this.dialogPostpone=true;
          this.nowItem = row;
        }
      },
      //查看证件示例
      lookCertificate(){
        this.dialogLook=true;
      },


      //重新提交
      againUp(){
        if(!this.expireTime && !this.checked){
          this.$message.warning("请选择日期");
          return;
        };
        if(!this.child.imgArr[0]){
          this.$message.warning("请上传图片");
          return;
        };
        this.dialogUpload = false;
        let time = this.$Tool.formatDate(this.expireTime);
        if(this.checked){
          time = "9999-12-31 00:00:00";
        }
        this.expireTime = '';
        let param = {};
        param.id = this.nowItem.id;
        param.title = this.nowItem.title;
        param.image = this.child.imgArr[0];
        param.deadlineTime = time;

        let index = '';
        this.commitData.credentials.map((item,index_child)=>{
          if(item.id===param.id){
            index = index_child;
          }
        })
        if(index.toString() != ''){
          this.commitData.credentials[index]=param;
        }else{
          this.commitData.credentials.push(param);
        }
        console.log(this.tableDataPostpone,this.tableDataAlready,this.tableDataWithout);
        // this.tableDataPostpone.map(item=>{
        //   if(item.id===param.id){
        //     item.imgUrl = param.image;
        //   }
        // })
        // this.tableDataAlready.forEach((item,index)=>{
        //   if(item.id===param.id){
        //     console.log(item.imgUrl,1);
        //     // item.imgUrl = param.image;
        //     let obj = Object.assign(this.tableDataAlready[index],{imgUrl:param.image});
        //
        //     this.tableDataAlready.splice(index,1,obj);
        //     // this.$set(this.tableDataAlready[index],'imgUrl',param.image);
        //     // this.tableDataAlready[index].imgUrl = param.image;
        //     console.log(item.imgUrl,2);
        //
        //
        //   }
        // })
        // this.tableDataWithout.map(item=>{
        //   if(item.id===param.id){
        //     item.imgUrl = param.image;
        //   }
        // })


        // this.nowItem.title='dsfgsdfgsdfg';
        this.nowItem.imgUrl='http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/ddLD2QVOzpb.jpg'
        // this.$set(this.nowItem,'imgUrl',this.child.imgArr[0])
        // this.child.imgArr = [];
        // this.nowItem = [];
      },
      //延期提交
      lazyUp(){
        if(!this.postponeTime && !this.checked){
          this.$message.warning("请选择日期");
          return;
        };
        if(!this.postponeReason){
          this.$message.warning("请填写延期上传原因");
          return;
        };
        this.dialogPostpone = false;

        let time = this.$Tool.formatDate(this.postponeTime);
        this.postponeTime = '';
        let param = {};
        param.id = this.nowItem.id;
        param.title = this.nowItem.title;
        param.commitmentTime = time;
        param.saveCategoryCredentials = this.postponeReason;
        param.UploadType = 1;

        let index = '';
        this.commitData.credentials.map((item,index_child)=>{
          if(item.id===param.id){
            index = index_child;
          }
        })
        if(index.toString() != ''){
          this.commitData.credentials[index]=param;
        }else{
          this.commitData.credentials.push(param);
        }
        this.postponeReason = '';
        this.nowItem = [];
      },
      //提交
      submit(){
        changeShopCredential.call(this,this.commitData).then(res=>{
          this.commitData.credentials=[];
          if(res.data.code === 1){
            this.$message.success(res.data.desc);
            this.getData();
          }else{
            this.$message.error(res.data.desc);
          }
        })
      },
      goBack(){
        this.$router.push({name:"RangeMain"})
      }
    },
    created(){
      this.getData();
    }

  }
</script>

<style lang="less" type="text/less" scoped>
@import "less/certificates.less";
//上传
.upload{
  .avatar-uploader{
    display: inline-block;
    vertical-align: top;
  }
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
  .test{
    display: inline-block;
  }
</style>
