<template>
  <!-- 咨询设置页面 -->
  <div id="zhiXunSheZhi">
    <el-tabs type="border-card">
      <el-tab-pane label="常见问题添加">
        <problem></problem>
      </el-tab-pane>
      <el-tab-pane label="常用语设置">
        <changYongYu></changYongYu>
      </el-tab-pane>
      <el-tab-pane label="聊天记录查看">
        <chatRecord></chatRecord>
      </el-tab-pane>
    </el-tabs>
    <div class="lianxi">
      联系平台
      <span class="span" title="点此可与客服进行线上交流">
        <img src="./img/trans_apply_chat.png" alt="联系" @click="chatTouter">
      </span>
    </div>
  </div>
</template>

<script>
import problem from "./consultingSettings/problem";
import changYongYu from "./consultingSettings/changYongYu";
import chatRecord from "./consultingSettings/chatRecord";
export default {
  name: "",
  data() {
    return {};
  },
  components: {
    problem,
    changYongYu,
    chatRecord
  },
  methods: {
    chatTouter() {
      this.$router.push("/OrderManage/zhiXunGuanLi");
    }
  }
};
</script>

<style lang=less>
#zhiXunSheZhi {
  position: relative;
  height: 100%;
  background: #fff !important;
  .el-tabs--border-card {
    background: #fff;
    -webkit-box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12),
      0 0 0px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12), 0 0 0px 0 rgba(0, 0, 0, 0.04);
    border: 0px;
  }
  .el-tab {
  }
  .lianxi {
    position: absolute;
    top: 11px;
    z-index: 10;
    right: 397px;
    .span {
      display: inline-block;
      width: 15px;
      height: 15px;
      vertical-align: middle;
      img {
        width: 100%;
        vertical-align: text-top;
        cursor: pointer;
      }
    }
  }
}
</style>