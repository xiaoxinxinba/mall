<template>
  <div id="zhiXunSheZhi_chatRecord">
    <div class="search_box clearfix">
      <div class="item">用户昵称：</div>
      <div class="item">
        <el-input type="input"></el-input>
      </div>
      <div class="item">
        <el-button type="primary">搜索</el-button>
      </div>
      <div class="item p">请点击你要搜索的用户历史记录。</div>
    </div>
    <div class="division"></div>
    <div class="content_box">
      <div class="list">
        <div class="title">
          <span>聊天列表</span>
        </div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="name" label="昵称"></el-table-column>
        </el-table>
      </div>
      <div class="main">
        <div class="content_toop">
          <span>聊天记录仅保存7天，如需查看7天前聊天记录请联系满集网客服中心</span>
          <span class="bu">400-6766-999</span>
        </div>
        <div class="content_time">
          <div class="action_ps8">
            <span>查询日期（从这个时间点向前拉取历史消息,不包含选中的时间点）：</span>
          </div>
          <div class="action_ps9">
            <el-date-picker v-model="time" type="date" size="mini" placeholder="开始时间"></el-date-picker>
          </div>
        </div>
        <div class="content_info pc_chat_message">
          <ul class="msgflow"></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      time: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang=less>
#zhiXunSheZhi_chatRecord {
  width: 100%;
  height: 100%;
  .clearfix:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .search_box {
    .item {
      float: left;
      margin-right: 10px;
      line-height: 43px;
      font-size: 16px;
    }
    .p {
      line-height: 2;
      font-size: 14px;
      color: red;
    }
  }
  .division {
    margin-top: 20px;
    height: 1px;
    background-color: #d0d0d0;
    width: 100%;
  }
  .content_box {
    padding-top: 8px;
    .list {
      width: 388px;
      float: left;
      .title {
        background-color: #f5f5f5;
        height: 40px;
        line-height: 40px;
        border-left: 2px solid #00a2ff;
        span {
          margin-left: 20px;
          font-size: 16px;
          color: #333333;
        }
      }
    }
    .main {
      float: left;
      padding-left: 20px;
      .content_toop {
        text-align: left;
        width: 100%;
        span {
          color: #666666;
          font-size: 14px;
        }
        .bu {
          color: #00a2ff;
        }
      }
      .content_time {
        margin: 20px 0;
        height: 32px;
        .action_ps8 {
          display: block;
          float: left;
          margin: 0 5px;
          line-height: 32px;
        }
        .action_ps9 {
          width: 160px;
          height: 32px;
          float: left;
        }
      }
      .pc_chat_message {
        height: 550px;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .content_info {
        /* margin-top: 25px; */
        margin: 20px auto 0;
        background-color: #f5f5f5;
        width: 800px;
        height: 550px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
}
</style>