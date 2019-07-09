<template>
  <div id="activity">
    <div class="title_box">
      <span>基本信息</span>
    </div>
    <div class="Basic_box">
      <ul>
        <li>
          <span>活动名称：</span>
          <p>宝箱秒杀惠</p>
        </li>
        <li>
          <span>活动名称：</span>
          <p>宝箱秒杀惠</p>
        </li>
        <li>
          <span>活动名称：</span>
          <p>宝箱秒杀惠</p>
        </li>
        <li>
          <span>活动名称：</span>
          <p>宝箱秒杀惠</p>
        </li>
        <li>
          <span>活动名称：</span>
          <p>宝箱秒杀惠</p>
        </li>
        <li>
          <span>活动名称：</span>
          <p>宝箱秒杀惠</p>
        </li>
      </ul>
    </div>
    <div class="title_box">
      <span>优惠信息</span>
    </div>
    <div class="Basic_box offer_box">
      <div class="Spike">
        <h4>秒杀时间段：</h4>
        <span>12月28日</span>
        <p>6:00-7:00 6:00-7:00 6:00-7:00 6:00-7:00 6:00-7:00</p>
        <span>12月28日</span>
        <p>6:00-7:00 6:00-7:00 6:00-7:00 6:00-7:00 6:00-7:00</p>
      </div>
      <div class="mj_line"></div>
      <div class="zheKou">
        <span>折扣区：</span>
        <p>5折区 6折区 7折区 8折区</p>
      </div>
      <div class="mj_line"></div>
      <div class="baoYou">
        <span>包邮地区：</span>
        <p>北京 上海 广州 深圳</p>
      </div>
      <div class="mj_line"></div>
      <div class="manZhe">
        <span>满折类型：</span>
        <p>购买满500元打5折</p>
        <p>购买满300元打6折</p>
      </div>
      <div class="mj_line"></div>
      <div class="youHui">
        <span>优惠券类型：</span>
        <p>购买满200元减10元 发放数量：800张 有效时间：2019-9-15 24:00:00</p>
        <p>购买满100元减5元 发放数量：1000张 有效时间：2019-9-15 24:00:00</p>
      </div>
      <div class="mj_line"></div>
      <div class="zheKouType">
        <span>折扣券类型：</span>
        <p>购买满200元打8折 发放数量：800张 有效时间：2019-9-15 24:00:00</p>
        <p>购买满100元打9折 发放数量：1000张 有效时间：2019-9-15 24:00:00</p>
      </div>
      <div class="mj_line"></div>
      <div class="manE">
        <span>满额返券类型：</span>
        <p>购买满500元赠送100元优惠券 下次购物满500元可用 发放数量：500张 有效时间：60天</p>
        <p>购买满300元赠送50元优惠券 下次购物满300元可用 发放数量：500张 有效时间：60天</p>
      </div>
      <div class="mj_line"></div>
      <div class="gouMai">
        <span>*买赠设置（最多设置5种买赠类型）</span>
        <p>买5赠2 买2赠1</p>
      </div>
      <div class="mj_line"></div>
      <div class="pingGou">
        <span>*拼购设置（最多设置5种拼购类型）</span>
        <p>拼购类型：2人拼 拼购有效时间：20分钟</p>
        <p>拼购类型：2人拼 拼购有效时间：20分钟</p>
      </div>
      <div class="mj_line"></div>
      <div class="manZheng">
        <span>*满赠设置（最多设置5种满赠类型）</span>
        <p>拼购类型：2人拼 拼购有效时间：20分钟</p>
        <p>拼购类型：2人拼 拼购有效时间：20分钟</p>
      </div>
      <div class="mj_line"></div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="sginUp">报名参加</el-button>
      <!-- <el-button>活动即将报名</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  methods: {
      //跳转至商品设置页面
      sginUp(){
          this.$router.push({name:'SetDiscount'})
      }
  }
};
</script>

<style lang=less>
#activity {
  .title_box {
    border-left: 3px solid #00a2ff;
    margin: 15px 0;
    span {
      font-size: 14px;
      color: #333;
      line-height: 14px;
      padding-left: 4px;
    }
  }
  .Basic_box {
    background: #fff;
    padding: 20px 18px;
    ul {
      li {
        font-size: 14px;
        color: #333;
        margin-bottom: 9px;
        span {
          color: #666;
        }
        p {
          display: inline-block;
        }
      }
    }
  }
  .offer_box {
    font-size: 14px;
    line-height: 34px;
    span {
      color: #666;
    }
    p {
      color: #333;
    }
    .mj_line {
      height: 1px;
      background-color: #e1e1e1;
    }
    .Spike {
      padding-bottom: 27px;
    }
    .zheKou,
    .baoYou {
      padding: 15px 0;
      p {
        display: inline-block;
      }
    }
    .manZhe {
    }
  }
  .btn {
    margin: 30px 22px;
  }
}
</style>