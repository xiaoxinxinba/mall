<template>
  <div>
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      multiple
      :http-request="uploadFiles"
      :before-upload="handleBeforeUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img  v-for="(item,index) in imgSrc" width="100%" :src="item" alt="">
    </el-dialog>

    <div id="upload" ref='upload'></div>
  </div>
</template>

<script>
  import GetPolicySignature from '@/api/GetPolicySignature.js';
  import plupload from 'plupload'
  import moment from 'moment';


  export default {
    name: "test",
    data() {
      return {
        imgSrc:[],
        dialogVisible: false,
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
      };
    },
    methods: {
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
      handleRemove(file, fileList) {
        console.log('移除',file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadFiles(file){
        console.log('uploadFiles',file);
      },
      handleBeforeUpload(file){
        console.log('上传',file)

        this.plUploader.addFile(file,file.name)
      },


      getKey() {
        let sessionId = sessionStorage.getItem('sessionId');
        console.log('555',sessionId)
        let date = new Date();
        date = moment(date).format('YYYY-MM-DD HH:mm:ss');
        GetPolicySignature.call(this, `?input.sessionId=${sessionId}&input.clientTimespan=${date}`).then((res) => {
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
          browse_button:'upload',
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

              this.getUploadData(up,'',false)
            },
            BeforeUpload:(up,files)=>{
              console.log('上传之前',files)
              this.getUploadData(up,files.name,true)
            },
            UploadComplete:(up, files)=>{

            },
            FileUploaded: (up, file, info)=>{
              if(info.status===200){
                console.log('ok',`${this.imgUrl}/${this.objName}`)
                this.imgSrc.push(`${this.imgUrl}/${this.objName}`)
                // this.imgsPapers.push({src:`${this.host}/${this.objName}`})
              }
            },
            Error:(up,info)=>{
              if(info.code===-600){
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

    created(){

    },
    mounted(){
      this.initPlUploader()
    }
  }
</script>

<style scoped>

</style>
