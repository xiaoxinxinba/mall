<template>
  <!-- 商品设置满减 -->
  <div id="SetDiscount">
    <!-- 头部区域 -->
    <div class="header_box">
      <Header></Header>
    </div>
    <!-- 头部区域 -->

    <div class="table_box">
      <div class="t_title">
        <el-col :span="1">
          <el-checkbox v-model="checked"></el-checkbox>
        </el-col>
        <el-col :span="4">
          <span>商品缩略图</span>
        </el-col>
        <el-col :span="2">
          <span>规格属性</span>
        </el-col>
        <el-col :span="2">
          <span>单价（元）</span>
        </el-col>
        <el-col :span="2">
          <span>折后价(元)</span>
        </el-col>
        <el-col :span="2">
          <span>商品库存（实时 )</span>
        </el-col>
        <el-col :span="2">
          <span>活动库存</span>
        </el-col>
        <el-col :span="2">
          <span>每人限购</span>
        </el-col>
        <el-col :span="2">
          <span>审核结果</span>
        </el-col>
        <el-col :span="2">
          <span>操作</span>
        </el-col>
      </div>
      <div class="table_main">
        <div class="bt clearfix">
          <el-col :span="1">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-col>
          <div class="tt">
            <span>商品：</span>
            <span>SONY索尼 PS4游戏 重力眩晕1 重力异想世界 中英文合版</span>
          </div>
          <div class="it">
            <span>折扣：</span>
          </div>
        </div>
        <div class="tw clearfix">
          <el-col :span="1">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-col>
          <el-col :span="4">
            <div class="tw_item">
              <img
                src="https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                alt
              >
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>蓝色</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>300.00</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>180.00</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>100</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>不高于库存</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>“0”为不限购</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>未通过</span>
            </div>
          </el-col>
        </div>
        <div class="tw clearfix">
          <el-col :span="1">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-col>
          <el-col :span="4">
            <div class="tw_item">
              <img
                src="https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                alt
              >
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>蓝色</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>300.00</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>180.00</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>100</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>不高于库存</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>“0”为不限购</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>未通过</span>
            </div>
          </el-col>
        </div>
        <div class="tw clearfix">
          <el-col :span="1">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-col>
          <el-col :span="4">
            <div class="tw_item">
              <img
                src="https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                alt
              >
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>蓝色</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>300.00</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>180.00</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>100</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>不高于库存</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>“0”为不限购</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tw_item">
              <span>未通过</span>
            </div>
          </el-col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "./setDiscountHeader";
export default {
  name: "",
  data() {
    return {
      form: {},
      checked: false,
      listQuery: {},
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518最少的两个小时吧"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            }
          ]
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  components: {
    Header
  },
  methods: {}
};
</script>

<style lang=less>
#SetDiscount {
  background: #fff;
  .clearfix:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .table_box {
    .t_title {
      height: 48px;
      background: #f1f1f3;
      color: #333;
      box-sizing: border-box;
      padding-top: 13px;
      padding-left: 10px;
    }
    .table_main {
      margin-top: 20px;
      .bt {
        background: #f1f1f3;
        height: 46px;
        .el-checkbox {
          float: left;
          padding-top: 13px;
          padding-left: 11px;
        }
        .tt {
          float: left;
          padding-top: 10px;
        }
        .it {
          padding-top: 10px;
          padding-left: 24px;
          display: inline-block;
        }
      }
      .tw {
        height: 50px;
        padding: 8px;
        border: 0.5px solid #f1f1f3;
        margin-bottom: 4px;
        .el-checkbox {
          float: left;
          padding-top: 16px;
          padding-left: 4px;
        }
        .tw_item {
          float: left;
          img {
            height: 50px;
            width: 50px;
          }
          span {
            padding-top: 17px;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>