<template>
  <div class="sysMessageDetail_box">
    <div class="content">
      <h3><!--新订单接单-->{{title}} <span><!--2019-05-12 12:12:12-->{{post_time}}</span></h3>
      <p>
        <!--您所发布的XX，因未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因审您所发布的XX，因未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因审您所发布的XX，因未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因审您所发布的XX，因未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因审您所发布的XX，因未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因审-->
        {{content}}</p>
    </div>

    <div class="btn">
      <el-button type="default" @click="goBack">返 回</el-button>
    </div>
  </div>
</template>

<script>
  import MessageDetail from '../../../api/system_message/MessageDetail';

  export default {
    data() {
      return {
        id: 0,
        title: '',
        content: '',
        post_time: '',
        clientVersion: 1,
        clientTimespan: new Date().toLocaleString(),
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      messageDetail() {
        MessageDetail.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan
          + '&messageId=' + this.id)
          .then(
            res => {
              if (res.data.code === 1) {
                this.title = res.data.data.title;
                this.content = res.data.data.content;
                this.post_time = res.data.data.post_time;
              }
            }
          )
      }
    },
    created() {
      if (this.$route.query !== undefined) {
        this.id = this.$route.query;
      }
      this.messageDetail();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
