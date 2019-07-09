<template>
  <div>
    <div class="out-box">
      <div class="content" :class="{'active': activeIndex > index}" v-for="(item, index) in text_list" :key="index">
        <span>{{index + 1}}</span>
        <div>
          {{item.text1}} <br/>
          {{item.text2}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "changeStep",
    props: {
      activeIndex: {
        type: Number,
      }
    },
    data() {
      return {
        text_list: [
          {
            text1: '填写变更信息',
            text2: '下载变更申请表',
          },
          {
            text1: '上传已盖章申请表',
            text2: '等待审核',
          },
          {
            text1: '审核通过',
            text2: '邮寄纸质档资料',
          },
          {
            text1: '收到纸质档资料合格',
            text2: '变更完成',
          },
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
  .out-box {
    display: -webkit-flex;
    display: flex;
    color: #999;
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    .content {
      flex: 1;
      text-align: center;
      border-right: 1px solid #e1e1e1;
      span {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        margin-right: 10px;
        color: #fff;
        background-color: #999;
        border-radius: 50%;
      }
      div {
        display: inline-block;
        vertical-align: middle;
        line-height: 2;
      }
      &.active {
        color: #00a2ff;
        span {
          background-color: #00a2ff;
        }
      }
      &:last-child {
        border-right: none;
      }
    }
  }
</style>
