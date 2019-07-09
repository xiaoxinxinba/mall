<template>
  <div class="discount_box">
    <div class="btn">
      <ul>
        <li @click="goDiscountList">折扣券</li>
        <li class="active">优惠券</li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <!--条件筛选 start-->
    <div class="screen">
      <el-form :inline="true" class="demo-form-inline" label-width="100px">

        <el-form-item label="活动状态：">
          <el-select v-model="discountValue" clearable placeholder="请选择">
            <el-option
              v-for="item in discountOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间：">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="活动名称：">
          <el-input v-model="activityName" placeholder="请输入活动名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="couponSearch">搜索</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="add">添加</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--条件筛选 end-->

    <!--折扣券 start-->
    <div>
      <el-table
        :data="couponList"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          fixed
          label="序号"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          fixed
          label="活动名称"
          width="260"
          align="center">
        </el-table-column>
        <el-table-column
          label="满减金额"
          width="200"
          align="center">
          <template slot-scope="scope">
            <div class="discountList_span">
              <span v-if="scope.row.activityDes !== ''">{{scope.row.activityDes}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="领券时间"
          align="center"
          width="200">
          <template slot-scope="scope">
            <div>{{scope.row.begin_time}} 至 {{scope.row.end_time}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="有效天数"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.effective_day}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="发放总张数"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.giveCount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="已领取张数"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.receiveCount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="已使用张数"
          align="center">
          <template slot-scope="scope">
            {{scope.row.userCount}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">未开始</div>
            <div v-if="scope.row.status === 1">进行中</div>
            <div v-if="scope.row.status === 2 || scope.row.status === 3">已过期</div>
            <div v-if="scope.row.status === 4">已暂停</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.status === 2 || scope.row.status === 3 || scope.row.status === 1 || scope.row.status === 4" @click="goDetail(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" v-if="scope.row.status === 1" @click="ChangeActivity(scope.row.id)">停止发券</el-button>
            <el-button type="text" size="small" v-if="scope.row.status === 4" @click="ChangeActivityActionPost(scope.row.id)">继续发劵</el-button>
            <el-button type="text" size="small" v-if="scope.row.status === 0" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" v-if="scope.row.status === 2 || scope.row.status === 3 || scope.row.status === 0" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="couponTotalCount">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--折扣券 end-->

    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      width="500px">
      <p>删除后不能恢复，确认删除？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePost">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="changeVisible"
      width="500px">
      <p>停止后买家将无法继续领取优惠券，但已领取的优惠券可正常使用，确认停止？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeVisible = false">取 消</el-button>
        <el-button type="primary" @click="ChangeActivityPost()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import PcGetCouponActivitiyList from '../../../../../src/api/ShopActivity/PcGetCouponActivitiyList.js'
  import DeleteActivity from '../../../../../src/api/ShopActivity/deleteActivity.js'
  import couponsChangeActivityStatus from '../../../../../src/api/ShopActivity/couponsChangeActivityStatus.js'
  export default {
    mounted () {

    },
    data () {
      return {
        time:[],
        discountOptions: [{  // 活动状态选项
          value: '0',
          label: '请选择活动状态'
        },{  // 活动状态选项
          value: '1',
          label: '未开始'
        }, {
          value: '2',
          label: '进行中'
        }, {
          value: '3',
          label: '已过期'
        }],
        discountValue: '0', // 活动状态值
        fullDiscountData: [{   //折扣券表格数据
          sort: '1',
          name: '五一限时9折优惠',
          fullReduction: [{
            rules: '满500减90元|100张',
          }, {
            rules: '满500减90元|100张',
          }, {
            rules: '满500减90元|100张',
          }],
          time: '2017.04.29 00:00 至 2017.05.01 23:59',
          day: '3',
          giveCount: '300',
          getCount: '126',
          usedCount: '66',
          state: '进行中',
        }, {
          sort: '2',
          name: '五一限时9折优惠',
          fullReduction: [{
            rules: '满500减90元|100张',
          }],
          time: '2017.04.29 00:00 至 2017.05.01 23:59',
          day: '3',
          giveCount: '300',
          getCount: '126',
          usedCount: '66',
          state: '已结束',
        }],
        currentPage: 1, // 折扣券分页
        deleteVisible: false,
        changeVisible: false,
        key:'',//关键字
        begin_time:'',//开始时间
        end_time:'',//结束时间
        status:0,//状态 0全部1未开始2进行中3已结束
        pageSize:20,//分页大小
        pageIndex:1,//页码,
        couponList:[],//优惠券列表
        couponTotalCount:0,//优惠券总数
        activityName:'',//活动名称
        activityId:0,//活动ID
      }
    },
    methods: {
      /**
       * 跳转到折扣页面
       */
      goDiscountList() {
        this.$router.push({ name: 'DiscountList' });
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

      /**
       * 添加页
       */
      add() {
        this.$router.push({ name: 'AddGoodsCoupon',query: { type: 'add' } });
      },
      edit(id){
        this.$router.push({
          name: 'AddGoodsCoupon',
          query: { type: 'edit',activityId:id }
        });
      },
      /**
       * 详情页
       */
      goDetail(activityId) {
        this.$router.push({
          name: 'LookGoodsCoupon',
          query: { activityId: activityId }
        });
      },
      del(id){
        console.log(id)
        this.deleteVisible = true
        this.activityId = id
      },
      deletePost(){
        var data = {
          "activityId": this.activityId,
          "clientVersion": "string",
          "clientTimespan": new Date().toLocaleString()
        }
        DeleteActivity.call(this,data).then(res=>{
          if(res.data.code === 1){
            this.deleteVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getCouponActivitiyList()
          }else{
            this.$message.error(res.data.desc);
          }
        })
      },
      ChangeActivity(id){
        this.activityId = id
        this.changeVisible = true
      },
      ChangeActivityPost(){
        var data = {
          "state": 4,//状态 1恢复 4暂停 ,
          "activityId": this.activityId,
          "clientVersion": "string",
          "clientTimespan": new Date().toLocaleString()
        }
        couponsChangeActivityStatus.call(this,data).then(res=>{
          if(res.data.code === 1){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getCouponActivitiyList()
            this.changeVisible = false
          }else {
            this.$message.error(res.data.desc);
          }
        })
      },
      ChangeActivityActionPost(activityId){
        var data = {
          "state": 1,//状态 1恢复 4暂停 ,
          "activityId": activityId,
          "clientVersion": "string",
          "clientTimespan": new Date().toLocaleString()
        }
        couponsChangeActivityStatus.call(this,data).then(res=>{
          if(res.data.code === 1){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getCouponActivitiyList()
          }else {
            this.$message.error(res.data.desc);
          }
        })
      },
      couponSearch(){
        //状态
        if(this.discountValue !== '' && this.discountValue !== undefined && this.discountValue !== '0' && this.discountValue !== 0){
           this.status = this.discountValue
        }
        //时间
        if(this.time !== null && this.time !== undefined){
          if(this.time[0] !== '2' && this.time[1] !== '0'){
            console.log(this.time[0])
            this.begin_time = this.time[0]
            this.end_time = this.time[1]
          }
        }
        if(this.activityName!=='' && this.activityName !== undefined){
          this.key = this.activityName
        }
        this.getCouponActivitiyList()
      },
      //优惠券列表
      getCouponActivitiyList(){
        this.time = new Date().toLocaleString()
        PcGetCouponActivitiyList.call(this,`?input.key=${this.key}&input.begin_time=${this.begin_time}&input.end_time=${this.end_time}&input.status=${this.status}&input.pageSize=${this.pageSize}&input.pageIndex=${this.pageIndex}&input.clientTimespan=${this.time}`)
           .then(res=>{
             if(res.data.code === 1){
               var data = res.data.data
               this.couponList = data.coupon
               this.couponTotalCount = data.totalCount
             }else{
               this.$message.error(res.data.desc)
             }

           })
      },
    },
    created:async function(){
      //优惠券列表
      this.getCouponActivitiyList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
