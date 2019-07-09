<template>
  <!--申请平台介入处理结果-->
  <div class="container">
    <div class="top">
      <!--介入详情-->
      <div class="intervene">
        <div class="title">介入详情</div>
        <div class="intervene-state">介入状态：<span>{{state[pageType]}}</span></div>
        <div class="intervene-remind" v-if="pageType===2">全国统一服务热线：<span>400-6766-999</span></div>
        <div class="intervene-remind" v-if="pageType!==2">平台正在处理中，我们会在5个工作日内给出处理意见，请您耐心等待。全国统一服务热线：<span>400-6766-999</span></div>
        <div class="intervene-btn" v-if="pageType!==2"><el-button type="primary">提交凭证</el-button></div>
      </div>
      <!--评价信息-->
      <div class="evaluate">
        <div class="title">评价信息</div>
        <ul class="evaluate-list">
          <li><span>订 单 号：</span><div class="evaluate-list-num">CDG954585422255522DF44</div></li>
          <li><span>订单商品：</span><div class="evaluate-list-goods">小西牛 纯牛奶全脂鲜牛奶常温儿童早餐高原奶整箱 243ML*12瓶</div></li>
          <li><span>评      价：</span><div class="evaluate-grade"><i class="evaluate-grade-icon super"></i><span>超赞</span></div></li>
        </ul>
      </div>
    </div>

    <!--处理结果-->
    <div class="result" v-if="pageType===2">
      <div class="title">处理结果</div>
      <ul class="result-ul evaluate-list">
        <li><span>结果：</span><div>维持原判</div></li>
        <li><span>说明：</span><div>这个是客服根据交易双方申诉以及提供证据来判定的，默认是谁申诉谁举证</div></li>
      </ul>
      <ul class="describe-ul">
        <li>
          <viewer class="describe-ul-img" :images="imgSrc">
            <img class="vue-lazyload avatar" v-lazy="imgSrc[0]" alt="" title="点击查看大图">
          </viewer>
        </li>
      </ul>
      <div class="time"><span>2017-05-06 12:56:10</span></div>
    </div>

    <!--卖家描述-->
    <div class="seller">
      <div class="title">卖家描述</div>

      <div class="describe-main">
        <div class="describe-content">这个是客服根据交易双方申诉以及提供证据来判定的，默认是谁申诉谁举证，如果买家申诉提交相关证据后，卖家无理由反驳，客服介入后就会要求卖家举证，若举证不成功则会判买家赢。卖家举证不足以评判的，会要求卖家继续举证，最后举证期限内
          卖家所举证不能反驳买家所举证内容的，会判买家赢。
          如果期间卖家举证足以反驳买家，且提出新的证据后，无法判断，也会要求买家针对卖家证据进行举证，然后再判定双方输赢。v驳买家所举证内容的，会判买家赢。
        </div>
        <ul class="describe-ul">
          <li>
            <viewer class="describe-ul-img" :images="imgSrc">
              <img class="vue-lazyload avatar" v-lazy="imgSrc[0]" alt="" title="点击查看大图">
            </viewer>
          </li>
        </ul>
        <div class="time"><span>2017-05-06 12:56:10</span></div>
      </div>

      <div class="describe-main">
        <div class="describe-content">这个是客服根据交易双方申诉以及提供证据来判定的，默认是谁申诉谁举证，如果买家申诉提交相关证据后，卖家无理由反驳，客服介入后就会要求卖家举证，若举证不成功则会判买家赢。卖家举证不足以评判的，会要求卖家继续举证，最后举证期限内
          卖家所举证不能反驳买家所举证内容的，会判买家赢。
          如果期间卖家举证足以反驳买家，且提出新的证据后，无法判断，也会要求买家针对卖家证据进行举证，然后再判定双方输赢。v驳买家所举证内容的，会判买家赢。
        </div>
        <ul class="describe-ul">
          <li>
            <viewer class="describe-ul-img" :images="imgSrc">
              <img class="vue-lazyload avatar" v-lazy="imgSrc[0]" alt="" title="点击查看大图">
            </viewer>
          </li>
        </ul>
        <div class="time"><span>2017-05-06 12:56:10</span></div>
      </div>

    </div>

    <!--买家描述-->
    <div class="buyer">
      <div class="title">买家描述</div>
      <div class="describe-main">
        <div class="describe-content">这个是客服根据交易双方申诉以及提供证据来判定的，默认是谁申诉谁举证，如果买家申诉提交相关证据后，卖家无理由反驳，客服介入后就会要求卖家举证，若举证不成功则会判买家赢。卖家举证不足以评判的，会要求卖家继续举证，最后举证期限内
          卖家所举证不能反驳买家所举证内容的，会判买家赢。
          如果期间卖家举证足以反驳买家，且提出新的证据后，无法判断，也会要求买家针对卖家证据进行举证，然后再判定双方输赢。v驳买家所举证内容的，会判买家赢。
        </div>
        <div class="time"><span>2017-05-06 12:56:10</span></div>
      </div>

    </div>



  </div>
</template>

<script>
  export default {
    name: "interveneResult",
    data(){
      return{
        pageType:0,   //0待处理    1处理中  3已完成
        state:['待处理 ','处理中','已完成'],
        imgSrc:['http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/27/LOrSvO6VLfd.jpg'],
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "less/interveneResult.less";
</style>
