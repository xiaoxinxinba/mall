<template>
  <div class="addDiscount_box">
    <div class="title_box">
      <ul>
        <li class="active">折扣券</li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <el-form class="demo-ruleForm">
      <el-form-item label="活动名称" label-width="100px">
        <p class="look_p">{{data.title}}</p>
      </el-form-item>

      <el-form-item label="满减金额" label-width="100px">
        <div class="add_prepend">
          <i>（满金额最高100元，折扣最高为9.9）</i>
        </div>

        <div class="add_tag">
          <el-tag v-for="(tag, i) in tags" :key="i" :type="tag.type">满{{tag.meet_price}}元打{{tag.discount}}折 | {{tag.give_number}}张</el-tag>
        </div>
      </el-form-item>

      <el-form-item label="领券时间" label-width="100px">
        <div class="add_line">
          <span class="add_span">{{data.begin_time}}</span>
          <span class="add_span"> 至 </span>
          <span class="add_span">{{data.end_time}}</span>
          <span class="add_span">共</span>
          <span class="add_span">{{day}}</span>
          <span class="add_span">天</span>
          <i>（活动时间7-30天，从开始日00:00:00生效，结束日23:59:59失效）</i>
        </div>
      </el-form-item>

      <el-form-item label="有效时间" label-width="100px">
        <div class="add_line">
          <i>领券时间起</i>
          <span style="font-size: 16px; color: #333;">{{data.effective_day}}</span>
          <i>天内有效</i>
          <i>（券的有效期30-60天）</i>
        </div>
      </el-form-item>

      <el-form-item label="领券详情" label-width="100px">
        <div class="table1">
          <el-table
            :data="tags"
            border
            tooltip-effect="dark"
            style="width: 80%">
            <el-table-column
              label="满减金额"
              align="center"
              width="200">
              <template slot-scope="scope">
                <span class="look_span">满{{scope.row.meet_price}}元打{{scope.row.discount}}折 | 100张</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="give_number"
              label="发放总张数"
              align="center">
            </el-table-column>

            <el-table-column
              prop="receive_number"
              label="已领取张数"
              align="center">
            </el-table-column>

            <el-table-column
              prop="user_number"
              align="center"
              label="已使用张数">
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <el-form-item label="活动范围" label-width="100px">
        <div>
          <el-button :type="isAllProduct === 1?'primary':'default'">全店商品</el-button>
          <el-button :type="isAllProduct === 2?'primary':'default'">部分商品</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="add_tips_p">选择全店商品时，活动结束前发布的新商品，将会默认加入优惠活动。</div>

        <!--表格 start-->
        <div class="table table1">
          <el-table
            ref="multipleTable"
            :data="products"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="sort"
              label="序号"
              align="center"
              width="55">
            </el-table-column>

            <el-table-column
              label="商品图片"
              align="center">
              <template slot-scope="scope">
                <viewer :images="scope.row.img_url">
                  <img class="vue-lazyload pic" v-lazy="scope.row.img_url" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center">
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">{{scope.row.title}}</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="sell_price"
              align="center"
              label="商品价格(元)">
            </el-table-column>
          </el-table>
        </div>
        <!--表格 end-->

        <!--页码开始-->
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="products.length"
            layout="total, sizes, prev, pager, next, jumper"
            :total="products.length">
          </el-pagination>
        </div>
        <!--页码结束-->
      </el-form-item>

      <el-form-item label-width="80px" style="margin-top: 60px;">
        <el-button @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import GetDiscountMeetCouponDetail from '../../../../../src/api/ShopActivity/GetDiscountMeetCouponDetail.js'
  export default {
    mounted () {

    },
    data () {
      return {
        tags: [
          /*{ name: '买100返5块 | 100张', type: '' },
          { name: '买100返5块 | 100张', type: '' },
          { name: '买100返5块 | 100张', type: '' }*/
        ],
        tableData: [{ // 表格数据
          sort: '1',
          pic: 'https://picsum.photos/id/237/200/300',
          price: '200.00',
        }],
        currentPage: 1,
        quanTableData: [{ // 领券详情数据
          fullDiscuse: '满500减90元 | 100张',
          giveCount: '100',
          getCount: '40',
          usedCount: '10',
        }],
        data:[],//数据
        isAllProduct:0,
        products:[],//商品数据
        day:0,
      }
    },
    methods: {

      /**
       * 返回
       */
      goBack() {
        this.$router.go( -1 );
      },

      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      GetCouponAcivity(activityId){
        this.time = new Date().toLocaleString()
        GetDiscountMeetCouponDetail.call(this,`?input.activityId=${activityId}&input.clientVersion=&input.clientTimespan=${this.time}`)
          .then(res=>{
            if(res.data.code === 1){
              var data = res.data.data
              this.data = data
              this.tags = data.rules
              this.isAllProduct = data.isAllProduct
              this.products = data.products
              this.day = this.datedifference(this.data.begin_time,this.data.end_time)
            }else{
              this.$message.error(res.data.desc)
            }
          })
      },
      datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
        var dateSpan,
          tempDate,
          iDays;
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays
      },
    },
    created:async function(){
      let activityId  = this.$route.query.activityId
      if(activityId !== null && activityId !== undefined && activityId!==0){
        this.GetCouponAcivity(activityId)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
