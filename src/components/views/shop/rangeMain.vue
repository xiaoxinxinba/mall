<template>
  <div class="main_box">

    <!--审核状态显示 no_pass 是未通过，auditing 是审核中，pass 是审核通过 -->
    <div :class="auditStatus===0?'state auditing':auditStatus===1?'state pass':'state no_pass' " v-if="stateIsShow === true">
      <div class="left">
        <span v-if="auditStatus===2">审核未通过！{{auditStatus}}</span>
        <span v-if="auditStatus===0">公司信息审核中！</span>
        <span v-if="auditStatus===1">审核通过！</span>
      </div>
      <div class="right">
        <span>{{auditTime}}</span>
        <el-button type="primary" size="mini" @click="stateIsShow = false">知道了</el-button>
      </div>
    </div>

    <div class="menu">
      <div>
        <span>店铺当前经营范围：</span>
        <span>
          <el-button type="primary" size="small" @click="goRange">管理经营范围及资质证件</el-button>
        </span>
      </div>
      <div class="ribbon"></div>
    </div>
    <div class="content">
      <div class="box" v-for="(items,index_parent) in dataList" :key="index_parent">
        <span>{{items.title}}</span>
        <div>
          <span v-for="(item,index) in items.childScope" :key="index">{{item.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import shopBusinessScope from '../../../api/ShopBusinessScope/ShopBusinessScope';
  export default {
    data() {
      return {
        stateIsShow: true,
        dataList: [],
        auditRemark: '',
        auditStatus:'',
        auditTime:'',
      }
    },
    methods: {
      goRange() {
        this.$router.push({ name: 'RangeIndex' });
      },
    },
    mounted: function(){
      let nowTime = new Date();
      shopBusinessScope.call(this,`?input.clientTimespan=${nowTime}`).then(res => {
        if (res.data.code === 1) {
          this.dataList = res.data.data.scopeInfo;
          this.auditStatus = res.data.data.auditStatus;
          this.auditRemark = res.data.data.auditRemark;
          this.auditTime = res.data.data.auditTime;
        }else {
          this.$message.error(res.data.desc);
        }
      });
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "./range/less/index.less";
  .main_box {
    .menu {
      > div {
        overflow: hidden;
        span {
          float: left;
        }
        span:first-child {
          line-height: 32px;
          color: #333;
        }
        span + span {
          float: right;
        }
      }
    }
    .content {
      background: #fff;
      padding: 10px 0;
      .box {
        margin: 30px 10px;
        position: relative;
        border: 1px solid #ddd;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        padding: 30px 30px 0 30px;
        background: #ecf4fa;
        > span {
          position: absolute;
          top: -14px;
          padding: 5px 20px;
          background: #33b5ff;
          color: #fff;
          font-size: 15px;
        }
        > div {
          span {
            width: 130px;
            height: 48px;
            border: 1px solid #ccc;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            display: inline-block;
            text-align: center;
            line-height: 48px;
            font-size: 14px;
            color: #666;
            margin-right: 30px;
            background: #fff;
            margin-bottom: 30px;
          }
        }

      }
    }

    .state {
      overflow: hidden;
      line-height: 40px;
      padding: 0 10px;
      margin: 10px 0;
      .left {
        display: inline-block;
        float: left;
        span {
          font-size: 12px;
          color: #666;
          display: inline-block;
        }
        span:first-child {
          font-size: 16px;
          margin-right: 20px;
          padding-left: 32px;
        }
      }
      .right {
        display: inline-block;
        float: right;
      }
    }
    .no_pass {
      border: 1px solid #ffc89c;
      background: #fff7e6;
      .left {
        span:first-child {
          color: #ff6600;
          background: url('./basic/img/comNoPass.png') no-repeat left center;
          -webkit-background-size: 22px 20px;
          background-size: 22px 20px;
        }
      }
      .right {
        span {
          color: #999;
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }

    .auditing {
      border: 1px solid #ffc89c;
      background: #fff7e6;
      .left {
        span:first-child {
          color: #ff6600;
          background: url('./basic/img/auditing.png') no-repeat left center;
          -webkit-background-size: 20px 20px;
          background-size: 20px 20px;
        }
      }
      .right {
        span {
          color: #999;
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }

    .pass {
      border: 1px solid #d8eccd;
      background: #f1f8ee;
      .left {
        span:first-child {
          color: #7abd54;
          background: url('./basic/img/pass.png') no-repeat left center;
          -webkit-background-size: 20px 20px;
          background-size: 20px 20px;
        }
      }
      .right {
        span {
          color: #999;
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }

  }

</style>
