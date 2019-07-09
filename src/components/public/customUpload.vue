<template>
  <div class="upload_container" >
    <ul class="upload_list">
      <viewer :images="img.imgArr">
        <li v-for="(item,index) in img.imgArr" :key="index"><img :src="item" title="点击查看大图" alt=""><i @click="del(index)" class="el-icon-error li_i"></i></li>
      </viewer>
    </ul>
    <div class="upload_box" :id="img.idName" v-show="img.imgArr.length<img.limit" v-loading="isLoad">
      <i class="el-icon-plus box_i"></i>
    </div>
    <div :id="img.idName+img.idName"></div>
  </div>

</template>

<script>
  import GetPolicySignature from '@/api/GetPolicySignature.js';
  import plupload from 'plupload';
  import moment from 'moment';

  export default {
    name: "aaa",
    props:['img'],
    data(){
      return{
        imgSrc:{},
        obj:{
          'key': '',
          'policy':'',
          'OSSAccessKeyId':'',
          'success_action_status': '200', //让服务端返回200,不然，默认会返回2040
          'signature':'',
        },
        key:'',
        host:'',
        objName:'',
        imhUrl:'',
        listImg:[],
        isLoad:false,
      }
    },
    computed:{
      widthHeight() {
        return `width:${this.img.width}px;height:${this.img.height}px;line-height:${this.img.width}px;`
      },

    },
    methods:{
      del(index){
        this.listImg.splice(index,1);
        this.img.imgArr=[...this.listImg];
      },
      //随机数
      random(len) {
        len = len || 32;
        let chars = 'ABCDEFGHIGKLMNOPQRSDUVWHVZabcdefghigklmnopqrsduvwhvz123456789';
        let maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      getKey() {
        let date = new Date();
        date = moment(date).format('YYYY-MM-DD HH:mm:ss');
        GetPolicySignature.call(this, `?input.clientTimespan=${date}`).then((res) => {
          console.log('res', res)
          if (res.data.code === 1) {
            this.obj.key = `${res.data.data.dir}`
            this.obj.policy = res.data.data.policy
            this.obj.OSSAccessKeyId = res.data.data.accessid
            this.obj.signature = res.data.data.signature
            this.key = `${res.data.data.dir}`
            this.host = res.data.data.host
            this.imgUrl = res.data.data.imgUrl

            let new_multipart_params = {
              'key': this.objName,
              'policy': this.obj.policy,
              'OSSAccessKeyId': this.obj.OSSAccessKeyId,
              'success_action_status': '200', //让服务端返回200,不然，默认会返回204
              'signature': this.obj.signature,
            };
            console.log('obj', this.obj)

            this.plUploader.setOption({
              'url': this.host,
              'multipart_params': new_multipart_params
            });

            this.plUploader.start()
            return true
          }
        })
      },
      initPlUploader() {
        this.plUploader= new plupload.Uploader({
          runtimes: 'html5,flash,silverlight,html4',
          url:'http://oss-cn-shenzhen.aliyuncs.com',
          browse_button:this.img.idName,
          container:this.img.idName+this.img.idName,
          multi_selection: true,
          filters: {
            mime_types: [
              { title: 'Image files', extensions: 'jpg,png,bmp,jpeg' }
            ],
            max_file_size: '3mb',
            prevent_duplicates: false
          },
          init: {
            FilesAdded:(up, files)=>{
              console.log('111111111')
              console.log(files)
              this.listImg=[...this.img.imgArr];
              this.getUploadData(up,'',false)
              // 加载框
              this.isLoad=true;

            },
            BeforeUpload:(up,files)=>{
              console.log('上传之前',files)
              this.getUploadData(up,files.name,true)
            },
            UploadComplete:(up, files)=>{
                console.log('6666999')
              this.listImg.splice(this.img.limit);
              this.img.imgArr=[...this.listImg];
              //关闭加载框
              this.isLoad=false;

            },
            FileUploaded: (up, file, info)=>{
              if(info.status===200){
                console.log('ok',`${this.imgUrl}/${this.objName}`)
                // this.imgSrc.push(`${this.imgUrl}/${this.objName}`)
                this.listImg.push(`${this.imgUrl}/${this.objName}`)
                // this.img.imgArr.push()
                // this.imgsPapers.push({src:`${this.host}/${this.objName}`})
                // this.imgSrc[this.op] = `${this.host}/${this.objName}`
                // console.log(this.imgSrc, '上传图片路径');
                // console.log(this.op, '父');
                // this.$emit('img', this.imgSrc[this.op])
              }
            },
            Error:(up,info)=>{
              console.log('错误',info);
              if(info.code===-600){
                this.$message.error('图片3M以内');
              }else if(info.code===-601){
                this.$message.error('图片格式为jpg,png,bmp,jpeg');
              }else{
                this.$message.error('网络异常');
              }
            }
          }
        })
        this.plUploader.init()
      },
      getUploadData(up,filename,ret){
        if(ret===false){
          ret=this.getKey()
          console.log('this.obj',this.obj)
        }else{
          if(filename!==''){
            let suffix=this.getName(filename)
            this.objName=`${this.key}${this.random(10)}${suffix}`
          }
          let new_multipart_params = {
            'key':this.objName,
            'policy': this.obj.policy,
            'OSSAccessKeyId': this.obj.OSSAccessKeyId,
            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
            'signature': this.obj.signature,
          };
          // console.log(new_multipart_params)
          up.setOption({
            'url': this.host,
            'multipart_params': new_multipart_params
          });
          up.start();
        }
      },
      getName(filename){
        let suffix=''
        suffix=filename
        return suffix
      },


    },
    mounted(){
      this.initPlUploader();
      console.log('555')
    }
  }
</script>

<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  ul{
    display: inline-block;
    font-size: 0px;
    li{
      display: inline-block;
      margin: 10px;
      position: relative;
      width: 100px;
      height: 100px;
      img{
        width: 100%;
        height: 100%;
      }
      .li_i{
        position: absolute;
        top: -18px;
        right: -18px;
        font-size: 20px;
        color: #ff0000;
        cursor: pointer;
      }
    }
  }
  .upload_box{
    display: inline-block;
    vertical-align: top;
    border: 1px dashed #cccccc;
    margin: 10px;
    text-align: center;
    width: 100px;
    height: 100px;
    line-height: 120px;
    .box_i{
      font-size: 30px;
      color: #999999;
    }
  }
  .upload_box:hover{
    border-color: #00a2ff;
    .box_i{
      color: #00a2ff;
    }
  }

  /deep/ .el-loading-mask{
    line-height: 1;
  }

</style>
