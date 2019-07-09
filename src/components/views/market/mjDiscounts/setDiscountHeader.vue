<template>
  <div class="setDiscountHeader">
    <div class="top">
      <el-form ref="form" :inline="true" label-width="80px">
        <el-form-item label="活动名称:">
          <span>箱包大促销</span>
        </el-form-item>
        <el-form-item label="活动名称:">
          <span>箱包大促销</span>
          <span>箱包大促销</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer clearfix">
      <div class="title">
        <h4>活动商品</h4>
      </div>
      <div class="btn">
        <el-button type="primary" size="mini">批量移除</el-button>
        <el-button type="primary" size="mini">继续添加</el-button>
      </div>
    </div>
    <div class="mj_line"></div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
        from:{}
    };
  },
  methods: {}
};
</script>

<style lang=less>
.setDiscountHeader {
  .clearfix:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .top {
    background: #ecf4fa;
    height: 88px;
    position: relative;
    padding-top: 28px;
    box-sizing: border-box;
    .el-form--inline .el-form-item {
      margin-right: 44px;
    }
  }
  .footer {
    background: #fff;
    padding: 6px 3px;
    position: relative;
    .title {
      position: absolute;
      left: 6px;
      bottom: 2px;
      float: left;
    }
    .btn {
      float: right;
    }
  }
  .mj_line {
    height: 2px;
    background-image: linear-gradient(
        87deg,
        #21d4fb 2%,
        #21a1fb 31%,
        #21cef5 46%,
        #21fbee 62%,
        #01a3ff 100%
      ),
      linear-gradient(#00a2ff, #00a2ff);
    background-blend-mode: normal, normal;
  }
}
</style>