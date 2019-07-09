<template>
  <div>
    <change-step :active-index="1"></change-step>
    <div style="padding: 15px;margin-bottom: 20px;background-color: #fff;text-align: right">
      <strong style="color: #00a2ff;cursor: pointer;" @click="$router.push({name: 'ChangeDesc'})"><img src="../../img/shuoming.png" alt="" style="vertical-align: middle;margin-right: 5px">变更说明</strong>
    </div>
    <div class="title">
      <!--      <p>公司/法人信息</p>-->
    </div>
    <div class="main">
      <div style="padding: 20px;text-align: center;border-bottom: 1px solid #e1e1e1;margin-bottom: 20px;">
        <img src="../../img/ruzhu.png" alt="">
        <div style="margin-top: 10px;color: #ff6600"><strong>待上传申请表</strong></div>
      </div>
      <el-form label-width="120px">
        <el-form-item label="上传申请表：">
          <div class="inline-box">
            <custom-upload :img="apply_img"></custom-upload>
          </div>
          <div class="inline-box" style="width: 300px;background-color: #f8f8f8;padding: 10px;color: #666;line-height: 1.5;text-align: left;">
            <div>上传申请表需满足以下要求，否则会影响审核结果：</div>
            <div>1、上传的申请表必须是平台生成的申请表打印后签字盖章的影印件图片；</div>
            <div>2、申请表必须法定代表人或授权代理人签字以及加盖公章；</div>
            <div>3、影印件要求必须为彩色（红色公章）、清晰的数码相机拍摄件或扫描件，涂改后无效；</div>
            <div>4、图片必须清晰、完整、方向正确，不能带有无关的水印或标记；</div>
            <div>5、支持jpg、png图片格式，大小不超过8M。</div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="info">查看申请表</el-button>
          <el-button type="primary" @click="nextStep">提交审核</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import changeStep from '@/components/views/capital/cash/bankChange/changeStep'
  import CustomUpload from '@/components/public/customUpload'
  export default {
    name: "applyUpload",
    components: {
      changeStep,
      CustomUpload
    },
    data() {
      return {
        apply_img: {
          idName: 'apply_img', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        }
      }
    },
    methods: {
      nextStep() {
        this.$router.push({name: 'ReviewStatus'})
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    border-bottom: 2px solid #00a2ff;

    p {
      width: 6.1rem;
      height: 2.3rem;
      background-color: #00a2ff;
      border-radius: 0.2rem 0.2rem 0rem 0rem;
      color: #fff;
      text-align: center;
      line-height: 2.3rem;
    }
  }
  .main {
    padding: 20px;
    background-color: #fff;
    .inline-box {
      display: inline-block;
      vertical-align: top;
      margin-right: 10px;
    }
  }
</style>
