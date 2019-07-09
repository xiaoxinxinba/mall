<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="shopRep_box marTop_20">
          <div class="shopRep_top">
            <span>我的信用</span>
            <router-link to="/shop/believeRecord">查看信用记录</router-link>
          </div>

          <div class="shopRep_record">
            <span>当前信用：<b>{{businessCreditTotalScore.ttotalScore}}分</b></span>
            <span>近30天扣分：<b>{{businessCreditTotalScore.reduceScore}}分</b></span>
            <span>近30天加分：<b>{{businessCreditTotalScore.addScore}}分</b></span>
          </div>

          <p class="shopRep_tips">每月信用分数变化趋势</p>

          <div class="shopRep_chart">
            <ve-line :data="creditData" :settings="creditSettings"></ve-line>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="shopRep_box marTop_20">
          <div class="shopRep_box">
            <div class="shopRep_top">
              <span>我的信誉</span>
              <router-link to="/shop/creditRecord">查看信誉记录</router-link>
            </div>

            <div class="shopRep_record">
              <span>当前信誉：<b>{{businessReputationtTotalScore.rtTotalScore}}分</b></span>
              <span>信誉等级：<b>{{businessReputationtTotalScore.reputationGrade}}</b></span>
              <span>近30天扣分：<b>{{businessReputationtTotalScore.reduceScore}}分</b></span>
              <span>近30天加分：<b>{{businessReputationtTotalScore.addScore}}分</b></span>
            </div>

            <p class="shopRep_tips">每月信誉分数变化趋势</p>

            <div class="shopRep_chart">
              <ve-line :data="reputationData" :settings="reputationSettings"></ve-line>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="shopRep_box">
          <div class="shopRep_top">
            <span>店铺半年内动态评分</span>
          </div>

          <div class="shopRep_score" style="overflow: hidden;">
            <div class="shopRep_score_left">
              <span @click="scoreSelect(1)" :class="scoreSelectIndex === 1 ? 'on' : ''">商品满意度：<b>{{businessReputationtOvera.goodsAverage}}</b>分</span>
              <span @click="scoreSelect(2)" :class="scoreSelectIndex === 2 ? 'on' : ''">商家包装：<b>{{businessReputationtOvera.packingAverage}}</b>分</span>
              <span @click="scoreSelect(3)" :class="scoreSelectIndex === 3 ? 'on' : ''">服务态度：<b>{{businessReputationtOvera.serviceAverage}}</b>分</span>
              <span @click="scoreSelect(4)" :class="scoreSelectIndex === 4 ? 'on' : ''">物流速度：<b>{{businessReputationtOvera.logisticsAverage}}</b>分</span>
            </div>


            <div class="shopRep_score_right" v-if="scoreSelectIndex === 1">
              <div>
                <el-rate
                  v-model="goodsAverage.average"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
                <span>共{{goodsAverage.sumPeople}}人评价</span>
              </div>

              <div>
                <div class="score_line">
                  <small class="icon_zan"></small>
                  <i>超赞</i>
                  <span>
                    <span :style="{width: goodsAverage.superCommentSumbl}"></span>
                    <label>{{goodsAverage.superCommentSumbl}} （{{goodsAverage.superCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_good"></small>
                  <i>满意</i>
                  <span>
                    <span :style="{width: goodsAverage.satisfiedCommentSumbl}"></span>
                    <label>{{goodsAverage.satisfiedCommentSumbl}} （{{goodsAverage.satisfiedCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_commonly"></small>
                  <i>一般</i>
                  <span>
                    <span :style="{width: goodsAverage.commonlyCommentSumbl}"></span>
                    <label>{{goodsAverage.commonlyCommentSumbl}} （{{goodsAverage.commonlyCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_bad"></small>
                  <i>较差</i>
                  <span>
                    <span :style="{width: goodsAverage.badCommentSumbl}"></span>
                    <label>{{goodsAverage.badCommentSumbl}} （{{goodsAverage.badCommentSum}}人）</label>
                  </span>
                </div>
              </div>

            </div>


            <div class="shopRep_score_right" v-if="scoreSelectIndex === 2">
              <div>
                <el-rate
                  v-model="packingAverage.average"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
                <span>共{{packingAverage.sumPeople}}人评价</span>
              </div>

              <div>
                <div class="score_line">
                  <small class="icon_zan"></small>
                  <i>超赞</i>
                  <span>
                    <span :style="{width: packingAverage.superCommentSumbl}"></span>
                    <label>{{packingAverage.superCommentSumbl}} （{{packingAverage.superCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_good"></small>
                  <i>满意</i>
                  <span>
                    <span :style="{width: packingAverage.satisfiedCommentSumbl}"></span>
                    <label>{{packingAverage.satisfiedCommentSumbl}} （{{packingAverage.satisfiedCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_commonly"></small>
                  <i>一般</i>
                  <span>
                    <span :style="{width: packingAverage.commonlyCommentSumbl}"></span>
                    <label>{{packingAverage.commonlyCommentSumbl}} （{{packingAverage.commonlyCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_bad"></small>
                  <i>较差</i>
                  <span>
                    <span :style="{width: packingAverage.badCommentSumbl}"></span>
                    <label>{{packingAverage.badCommentSumbl}} （{{packingAverage.badCommentSum}}人）</label>
                  </span>
                </div>
              </div>
            </div>

            <div class="shopRep_score_right" v-if="scoreSelectIndex === 3">
              <div>
                <el-rate
                  v-model="serviceAverage.average"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
                <span>共{{serviceAverage.sumPeople}}人评价</span>
              </div>

              <div>
                <div class="score_line">
                  <small class="icon_zan"></small>
                  <i>超赞</i>
                  <span>
                    <span :style="{width: serviceAverage.superCommentSumbl}"></span>
                    <label>{{serviceAverage.superCommentSumbl}} （{{serviceAverage.superCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_good"></small>
                  <i>满意</i>
                  <span>
                    <span :style="{width: serviceAverage.satisfiedCommentSumbl}"></span>
                    <label>{{serviceAverage.satisfiedCommentSumbl}} （{{serviceAverage.satisfiedCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_commonly"></small>
                  <i>一般</i>
                  <span>
                    <span :style="{width: serviceAverage.commonlyCommentSumbl}"></span>
                    <label>{{serviceAverage.commonlyCommentSumbl}} （{{serviceAverage.commonlyCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_bad"></small>
                  <i>较差</i>
                  <span>
                    <span :style="{width: serviceAverage.badCommentSumbl}"></span>
                    <label>{{serviceAverage.badCommentSumbl}} （{{serviceAverage.badCommentSum}}人）</label>
                  </span>
                </div>
              </div>
            </div>

            <div class="shopRep_score_right" v-if="scoreSelectIndex === 4">
              <div>
                <el-rate
                  v-model="logisticsAverage.average"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
                <span>共{{logisticsAverage.sumPeople}}人评价</span>
              </div>

              <div>
                <div class="score_line">
                  <small class="icon_zan"></small>
                  <i>超赞</i>
                  <span>
                    <span :style="{width: logisticsAverage.superCommentSumbl}"></span>
                    <label>{{logisticsAverage.superCommentSumbl}} （{{logisticsAverage.superCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_good"></small>
                  <i>满意</i>
                  <span>
                    <span :style="{width: logisticsAverage.satisfiedCommentSumbl}"></span>
                    <label>{{logisticsAverage.satisfiedCommentSumbl}} （{{logisticsAverage.satisfiedCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_commonly"></small>
                  <i>一般</i>
                  <span>
                    <span :style="{width: logisticsAverage.commonlyCommentSumbl}"></span>
                    <label>{{logisticsAverage.commonlyCommentSumbl}} （{{logisticsAverage.commonlyCommentSum}}人）</label>
                  </span>
                </div>

                <div class="score_line">
                  <small class="icon_bad"></small>
                  <i>较差</i>
                  <span>
                    <span :style="{width: logisticsAverage.badCommentSumbl}"></span>
                    <label>{{logisticsAverage.badCommentSumbl}} （{{logisticsAverage.badCommentSum}}人）</label>
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="shopRep_box">
          <div class="shopRep_box">
            <div class="shopRep_top">
              <span>我的特权</span>
            </div>

            <div class="shopRep_privilege" v-if="false">
              <div>
                <span>
                  <small class="icon1"></small>
                </span>
                <h1>20%</h1>
                <h4>今年广告费减少</h4>
                <p>花更少的钱</p>
                <p>获得更多的曝光率</p>
                <p>打造爆款商品不是梦</p>
              </div>
              <div>
                <span>
                  <small class="icon2"></small>
                </span>
                <h1>60%</h1>
                <h4>今年热搜词费用减少</h4>
                <p>花更少的钱</p>
                <p>上更多的热搜</p>
                <p>助你登上顶级流量宝座</p>
              </div>
              <div>
                <span>
                  <small class="icon3"></small>
                </span>
                <h1>20%</h1>
                <h4>今年商品保证金减少</h4>
                <p>用更少的成本</p>
                <p>赚更多的钱</p>
                <p>获得更好的人生</p>
              </div>
              <div>
                <span>
                  <small class="icon4"></small>
                </span>
                <h1>20%</h1>
                <h4>今年返平台使用年费</h4>
                <p>满集给你返利</p>
                <p>互利互赢</p>
                <p>并肩走向更远处</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="shopRep_box">
          <div class="shopRep_top">
            <span>关于信用、信誉</span>
          </div>
          <div class="shopRep_about">
            <h3>1. 信用分是如何计算的？</h3>
            <p>信用分主要是平台对消费者投诉举报，以及对商家的违规进行扣分处理，当然通过商品评价及销量等也可以进行加分。</p>

            <h3>2. 信誉值是如何计算的？有哪些维度？</h3>
            <p>信誉值是对数据的综合处理和评估，主要包含了消费者评价、商家售前/售中/售后服务等，具体包括如发布新商品、发布活动、收到的好评、商品销量、消费者咨询回复等多项指标。</p>

            <h3>3. 可以通过哪些方式去提升信誉值？</h3>
            <p>信誉值会影响到商品及店铺的曝光率，影响用户购买的转化C率，建议您把关好商品质量，选择优质合作快递，加强商品包装，提高发货速，做好售后服务，诚信经营。</p>

            <h3>4. 信用等级是怎么分的？分别享有什么特权？</h3>
            <div>
              <span class="shopRep_about_span1">
                <small></small>
                <p>新手商家</p>
                <span>信誉值：0 - 199</span>
              </span>

              <span class="shopRep_about_span2">
                <small></small>
                <p>普通商家</p>
                <span>信誉值：200 - 999</span>
              </span>

              <span class="shopRep_about_span3">
                <small></small>
                <p>优秀商家</p>
                <span>信誉值：1000 - 9999</span>
              </span>

              <span class="shopRep_about_span4">
                <small></small>
                <p>优质商家</p>
                <span>信誉值：10000 - 29999</span>
              </span>

              <span class="shopRep_about_span5">
                <small></small>
                <p>品质商家</p>
                <span>信誉值：30000+</span>
              </span>
            </div>

          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>


  import GetCreditReputationRuleList from '../../../../api/ShopInfo/GetCreditReputationRuleList'

  export default {
    mounted () {
    },
    data () {
      this.creditSettings = { // 信用
        metrics: ['信用分数'],
        dimension: ['月份']
      },
      this.reputationSettings = { // 信誉
        metrics: ['信誉分数'],
        dimension: ['月份']
      }
      return {
        scoreSelectIndex: 1,
        score: 5.0,
        creditData: { // 信用数据
          columns: ['月份', '信用分数'],
          rows: [
            /*{ '月份': '2018-01', '信用分数': 12.00 },
            { '月份': '2018-02', '信用分数': 23.40 },
            { '月份': '2018-03', '信用分数': 25 },
            { '月份': '2018-04', '信用分数': 34 },
            { '月份': '2018-05', '信用分数': 45 },
            { '月份': '2018-06', '信用分数': 55 },
            { '月份': '2018-07', '信用分数': 65 },
            { '月份': '2018-08', '信用分数': 70 },
            { '月份': '2018-09', '信用分数': 80 },
            { '月份': '2018-10', '信用分数': 85 },
            { '月份': '2018-11', '信用分数': 90 },
            { '月份': '2018-12', '信用分数': 95 }*/
          ]
        },
        reputationData: { // 信誉数据
          columns: ['月份', '信誉分数'],
          rows: [
            /*{ '月份': '1月', '信誉分数': 900 },
            { '月份': '2月', '信誉分数': 1800 },
            { '月份': '3月', '信誉分数': 2500 },
            { '月份': '4月', '信誉分数': 3600 },
            { '月份': '5月', '信誉分数': 4800 },
            { '月份': '6月', '信誉分数': 5700 },
            { '月份': '7月', '信誉分数': 6600 },
            { '月份': '8月', '信誉分数': 7300 },
            { '月份': '9月', '信誉分数': 8000 },
            { '月份': '10月', '信誉分数': 8500 },
            { '月份': '11月', '信誉分数': 9000 },
            { '月份': '12月', '信誉分数': 9800 }*/
          ]
        },
        businessReputationtTotalScore:{
          rtTotalScore:0,
          reputationGrade:0,
          reduceScore:0,
          addScore:0,
        },//信誉
        businessCreditTotalScore:{
          addScore:0,
          reduceScore:0,
          ttotalScore:0,
        },//信用
        businessReputationtOvera: {
           goodsAverage:0,//商品评分
           packingAverage:0,//包装评分
           serviceAverage:0,//服务评分
           logisticsAverage:0,//物流评分
        },
        goodsAverage:{
          average:0,
          sumPeople:0,
          superCommentSum:0,//超赞
          superCommentSumbl:'width:0%',//超赞比例
          satisfiedCommentSum:0,//满意
          satisfiedCommentSumbl:'width:0%',//满意比例
          commonlyCommentSum:0,//一般
          commonlyCommentSumbl:'width:0%',//一般比例
          badCommentSum:0,//较差
          badCommentSumbl:'width:0%',//较差
        },
        packingAverage:{
          average:0,
          sumPeople:0,
          superCommentSum:0,//超赞
          superCommentSumbl:'width:0%',//超赞比例
          satisfiedCommentSum:0,//满意
          satisfiedCommentSumbl:'width:0%',//满意比例
          commonlyCommentSum:0,//一般
          commonlyCommentSumbl:'width:0%',//一般比例
          badCommentSum:0,//较差
          badCommentSumbl:'width:0%',//较差
        },
        serviceAverage:{
          average:0,
          sumPeople:0,
          superCommentSum:0,//超赞
          superCommentSumbl:'width:0%',//超赞比例
          satisfiedCommentSum:0,//满意
          satisfiedCommentSumbl:'width:0%',//满意比例
          commonlyCommentSum:0,//一般
          commonlyCommentSumbl:'width:0%',//一般比例
          badCommentSum:0,//较差
          badCommentSumbl:'width:0%',//较差
        },
        logisticsAverage:{
          average:0,
          sumPeople:0,
          superCommentSum:0,//超赞
          superCommentSumbl:'width:0%',//超赞比例
          satisfiedCommentSum:0,//满意
          satisfiedCommentSumbl:'width:0%',//满意比例
          commonlyCommentSum:0,//一般
          commonlyCommentSumbl:'width:0%',//一般比例
          badCommentSum:0,//较差
          badCommentSumbl:'width:0%',//较差
        }
      }
    },
    methods:{
      /**
       * 店铺半年内动态评分点击事件
       */
      scoreSelect( index ) {
        this.scoreSelectIndex = index;
      },

      getCreditReputationRuleList(){
        this.time = new Date().toLocaleString();
        GetCreditReputationRuleList.call(this,`?input.clientVersion=v1&input.clientTimespan=${this.time}`).then(res=>{
           if(res.data.code === 1){
             var data = res.data.data
             if(data.businessReputationtTotalScore !== null){
               this.businessReputationtTotalScore = data.businessReputationtTotalScore
             }
             if(data.businessCreditTotalScore !== null){
               this.businessCreditTotalScore = data.businessCreditTotalScore
             }
             if(data.businessReputationtOvera !== null && data.businessReputationtOvera !== undefined && data.businessReputationtOvera.length > 0){

               for (let i = 0;i<data.businessReputationtOvera.length;i++) {
                  if(data.businessReputationtOvera[i].bosSsScoringItems === "1")
                  {
                     this.businessReputationtOvera.goodsAverage = data.businessReputationtOvera[i].average
                     this.goodsAverage.average = parseFloat(data.businessReputationtOvera[i].average)
                     if(data.businessReputationtOvera[i].sumPeople !== null && data.businessReputationtOvera[i].sumPeople != ''){
                       this.goodsAverage.sumPeople = data.businessReputationtOvera[i].sumPeople
                     }
                     if(data.businessReputationtOvera[i].superCommentSum !== null && data.businessReputationtOvera[i].superCommentSum !==''){
                       this.goodsAverage.superCommentSum = data.businessReputationtOvera[i].superCommentSum
                     }
                     if(data.businessReputationtOvera[i].satisfiedCommentSum !== null && data.businessReputationtOvera[i].satisfiedCommentSum !==''){
                       this.goodsAverage.satisfiedCommentSum = data.businessReputationtOvera[i].satisfiedCommentSum
                     }
                    if(data.businessReputationtOvera[i].commonlyCommentSum !== null && data.businessReputationtOvera[i].commonlyCommentSum !==''){
                      this.goodsAverage.commonlyCommentSum = data.businessReputationtOvera[i].commonlyCommentSum
                    }
                    if(data.businessReputationtOvera[i].badCommentSum !== null && data.businessReputationtOvera[i].badCommentSum !==''){
                      this.goodsAverage.badCommentSum = data.businessReputationtOvera[i].badCommentSum
                    }
                    let tot = parseFloat(this.goodsAverage.superCommentSum) + parseFloat(this.goodsAverage.satisfiedCommentSum) + parseFloat(this.goodsAverage.commonlyCommentSum) + parseFloat(this.goodsAverage.badCommentSum)
                    this.goodsAverage.superCommentSumbl = this.GetPercent(this.goodsAverage.superCommentSum,tot)
                    this.goodsAverage.satisfiedCommentSumbl = this.GetPercent(this.goodsAverage.satisfiedCommentSum,tot)
                    this.goodsAverage.commonlyCommentSumbl = this.GetPercent(this.goodsAverage.commonlyCommentSum,tot)
                    this.goodsAverage.badCommentSumbl = this.GetPercent(this.goodsAverage.badCommentSum,tot)
                  }
                 if(data.businessReputationtOvera[i].bosSsScoringItems === "2"){
                   this.businessReputationtOvera.packingAverage = data.businessReputationtOvera[i].average
                   this.packingAverage.average = parseFloat(data.businessReputationtOvera[i].average)
                   if(data.businessReputationtOvera[i].sumPeople !== null && data.businessReputationtOvera[i].sumPeople != ''){
                     this.packingAverage.sumPeople = data.businessReputationtOvera[i].sumPeople
                   }
                   if(data.businessReputationtOvera[i].superCommentSum !== null && data.businessReputationtOvera[i].superCommentSum !==''){
                     this.packingAverage.superCommentSum = data.businessReputationtOvera[i].superCommentSum
                   }
                   if(data.businessReputationtOvera[i].satisfiedCommentSum !== null && data.businessReputationtOvera[i].satisfiedCommentSum !==''){
                     this.packingAverage.satisfiedCommentSum = data.businessReputationtOvera[i].satisfiedCommentSum
                   }
                   if(data.businessReputationtOvera[i].commonlyCommentSum !== null && data.businessReputationtOvera[i].commonlyCommentSum !==''){
                     this.packingAverage.commonlyCommentSum = data.businessReputationtOvera[i].commonlyCommentSum
                   }
                   if(data.businessReputationtOvera[i].badCommentSum !== null && data.businessReputationtOvera[i].badCommentSum !==''){
                     this.packingAverage.badCommentSum = data.businessReputationtOvera[i].badCommentSum
                   }
                   let tot = parseFloat(this.packingAverage.superCommentSum) + parseFloat(this.packingAverage.satisfiedCommentSum) + parseFloat(this.packingAverage.commonlyCommentSum) + parseFloat(this.packingAverage.badCommentSum)
                   this.packingAverage.superCommentSumbl = this.GetPercent(this.packingAverage.superCommentSum,tot)
                   this.packingAverage.satisfiedCommentSumbl = this.GetPercent(this.packingAverage.satisfiedCommentSum,tot)
                   this.packingAverage.commonlyCommentSumbl = this.GetPercent(this.packingAverage.commonlyCommentSum,tot)
                   this.packingAverage.badCommentSumbl = this.GetPercent(this.packingAverage.badCommentSum,tot)
                 }
                 if(data.businessReputationtOvera[i].bosSsScoringItems === "3"){
                   this.businessReputationtOvera.serviceAverage = data.businessReputationtOvera[i].average
                   this.serviceAverage.average = parseFloat(data.businessReputationtOvera[i].average)
                   if(data.businessReputationtOvera[i].sumPeople !== null && data.businessReputationtOvera[i].sumPeople != ''){
                     this.serviceAverage.sumPeople = data.businessReputationtOvera[i].sumPeople
                   }
                   if(data.businessReputationtOvera[i].superCommentSum !== null && data.businessReputationtOvera[i].superCommentSum !==''){
                     this.serviceAverage.superCommentSum = data.businessReputationtOvera[i].superCommentSum
                   }
                   if(data.businessReputationtOvera[i].satisfiedCommentSum !== null && data.businessReputationtOvera[i].satisfiedCommentSum !==''){
                     this.serviceAverage.satisfiedCommentSum = data.businessReputationtOvera[i].satisfiedCommentSum
                   }
                   if(data.businessReputationtOvera[i].commonlyCommentSum !== null && data.businessReputationtOvera[i].commonlyCommentSum !==''){
                     this.serviceAverage.commonlyCommentSum = data.businessReputationtOvera[i].commonlyCommentSum
                   }
                   if(data.businessReputationtOvera[i].badCommentSum !== null && data.businessReputationtOvera[i].badCommentSum !==''){
                     this.serviceAverage.badCommentSum = data.businessReputationtOvera[i].badCommentSum
                   }
                   let tot = parseFloat(this.serviceAverage.superCommentSum) + parseFloat(this.serviceAverage.satisfiedCommentSum) + parseFloat(this.serviceAverage.commonlyCommentSum) + parseFloat(this.serviceAverage.badCommentSum)
                   this.serviceAverage.superCommentSumbl = this.GetPercent(this.serviceAverage.superCommentSum,tot)
                   this.serviceAverage.satisfiedCommentSumbl = this.GetPercent(this.serviceAverage.satisfiedCommentSum,tot)
                   this.serviceAverage.commonlyCommentSumbl = this.GetPercent(this.serviceAverage.commonlyCommentSum,tot)
                   this.serviceAverage.badCommentSumbl = this.GetPercent(this.serviceAverage.badCommentSum,tot)
                 }
                 if(data.businessReputationtOvera[i].bosSsScoringItems === "4"){
                   this.businessReputationtOvera.logisticsAverage = data.businessReputationtOvera[i].average
                   this.logisticsAverage.average = parseFloat(data.businessReputationtOvera[i].average)
                   if(data.businessReputationtOvera[i].sumPeople !== null && data.businessReputationtOvera[i].sumPeople != ''){
                     this.logisticsAverage.sumPeople = data.businessReputationtOvera[i].sumPeople
                   }
                   if(data.businessReputationtOvera[i].superCommentSum !== null && data.businessReputationtOvera[i].superCommentSum !==''){
                     this.logisticsAverage.superCommentSum = data.businessReputationtOvera[i].superCommentSum
                   }
                   if(data.businessReputationtOvera[i].satisfiedCommentSum !== null && data.businessReputationtOvera[i].satisfiedCommentSum !==''){
                     this.logisticsAverage.satisfiedCommentSum = data.businessReputationtOvera[i].satisfiedCommentSum
                   }
                   if(data.businessReputationtOvera[i].commonlyCommentSum !== null && data.businessReputationtOvera[i].commonlyCommentSum !==''){
                     this.logisticsAverage.commonlyCommentSum = data.businessReputationtOvera[i].commonlyCommentSum
                   }
                   if(data.businessReputationtOvera[i].badCommentSum !== null && data.businessReputationtOvera[i].badCommentSum !==''){
                     this.logisticsAverage.badCommentSum = data.businessReputationtOvera[i].badCommentSum
                   }
                   let tot = parseFloat(this.logisticsAverage.superCommentSum) + parseFloat(this.logisticsAverage.satisfiedCommentSum) + parseFloat(this.logisticsAverage.commonlyCommentSum) + parseFloat(this.logisticsAverage.badCommentSum)
                   this.logisticsAverage.superCommentSumbl = this.GetPercent(this.logisticsAverage.superCommentSum,tot)
                   this.logisticsAverage.satisfiedCommentSumbl = this.GetPercent(this.logisticsAverage.satisfiedCommentSum,tot)
                   this.logisticsAverage.commonlyCommentSumbl = this.GetPercent(this.logisticsAverage.commonlyCommentSum,tot)
                   this.logisticsAverage.badCommentSumbl = this.GetPercent(this.logisticsAverage.badCommentSum,tot)
                 }
               }
             }

             //信用分数 图表
             if(data.businessCreditScoreRecordVoList !== null && data.businessCreditScoreRecordVoList!==undefined && data.businessCreditScoreRecordVoList.length > 0)
             {
               for (let i = 0;i<data.businessCreditScoreRecordVoList.length;i++){
                 this.creditData.rows.push({ '月份':data.businessCreditScoreRecordVoList[i].month, '信用分数': data.businessCreditScoreRecordVoList[i].sumScores })
               }
             }

             if(data.businessReputationtScoreRecordVoList !== null && data.businessReputationtScoreRecordVoList!==undefined && data.businessReputationtScoreRecordVoList.length > 0)
             {
               for (let i = 0;i<data.businessReputationtScoreRecordVoList.length;i++){
                 this.reputationData.rows.push({ '月份':data.businessReputationtScoreRecordVoList[i].month, '信誉分数': data.businessReputationtScoreRecordVoList[i].sumScores })
               }
             }
             console.log(this.creditData)
           }else{
             this.$message.error(res.data.desc)
           }
        })
      },
      GetPercent(num, total) {
        console.log(num)
        console.log(total)
        if(num == 0){
           return 'width:0%'
        }
        num = parseFloat(num);
        total = parseFloat(total);
        if (isNaN(num) || isNaN(total)) {
          return 'width:0%';
        }
        return 'width:'+total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
      }
    },
    created:async function(){
      this.getCreditReputationRuleList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/shopReputation.less";

  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
</style>
