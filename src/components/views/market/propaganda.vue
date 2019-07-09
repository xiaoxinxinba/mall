<template>
  <div class="container">
    我要宣传
    <!--<p>url11{{imgUrl1}}</p>
    <p>url22{{imgUrl2}}</p>
    <upload :op="img[0]" :all="img" @img="img1"></upload>
    <upload :op="img[1]" :all="img"  @img="img2"></upload>-->


    <CustomUpload :img="bbb"></CustomUpload>

    <div class="test">
      <CustomUpload :img="child"></CustomUpload>
    </div>
  </div>
</template>

<script>
  // import upload from '@/components/public/upload'
  import CustomUpload from '@/components/public/customUpload'
  export default {
    mounted () {

    },
    data () {
      return {
        // img: ['one', 'two'],
        // imgUrl1: undefined,
        // imgUrl2: undefined,
        child: {
          idName: 'qqq', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 3, // 上传图片的最大限制个数
          imgArr: ['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201905/24/DZGrWusdDwb.jpg'], // 上传成功返回的数组，默认传空
        },
        bbb: { idName: 'www', limit: 3, imgArr: [] },
      }
    },
    methods: {
      /*img1 (e) {
        this.imgUrl1 = e
        console.log(e, '接受第一个')
      },
      img2 (e) {
        this.imgUrl2 = e
        console.log(e, '接受第er个')
      }*/
    },
    components: {
      // upload,
      CustomUpload
    },
    watch:{
      'child.idname'(val) {

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.test{
  width: 800px;
  height: 800px;
}
</style>
