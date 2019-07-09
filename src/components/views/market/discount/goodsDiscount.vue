<template>
  <div class="discount_box">
    <div class="btn">
      <ul>
        <li :class="choice === item && 'active'" v-for="(item, i) in carList" :key="i" @click="changeChoice(item)">{{item}}</li>
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
            type="daterange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="活动名称：">
          <el-input placeholder="请输入商品名称" v-model="title"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchList">搜索</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="add('add')">添加</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--条件筛选 end-->
    <!--折扣 start-->
    <div v-show="choice === '折扣'">
      <el-table
        :data="discountData"
        border
        style="width: 100%">
        <el-table-column
          prop="num"
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="活动名称"
          width="260"
          align="center">
        </el-table-column>
        <el-table-column
          label="活动时间"
          align="center">
          <template slot-scope="scope">
            {{scope.row.beginTime}} 至 {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="activitiesGoodsDescribe"
          label="活动商品"
          align="center">
        </el-table-column>
        <el-table-column
          prop="discountInfo"
          label="折扣"
          align="center">
        </el-table-column>
        <el-table-column
          label="每人限购"
          align="center">
          <template slot-scope="scope">
            {{scope.row.limit}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.statusCode === 2 || scope.row.statusCode === 3" size="small" @click="add('detail', scope.row.id)">查看</el-button>
            <el-button type="text" v-if="scope.row.statusCode === 0 || scope.row.statusCode === 1" size="small" @click="add('edit', scope.row.id)">编辑</el-button>
            <el-button type="text" v-if="scope.row.statusCode === 1" size="small" @click="add('end', scope.row.id)">结束</el-button>
            <el-button type="text" v-if="scope.row.statusCode === 0 || scope.row.statusCode === 2 || scope.row.statusCode === 3" size="small" @click="add('del', scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChangeDiscount"
          @current-change="handleCurrentChangeDiscount"
          :current-page="discountPageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="discountPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="discountTotal">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--折扣 end-->

    <!--满折 start-->
    <div v-show="choice === '满折'">
      <el-table
        :data="fullDiscountData"
        border
        style="width: 100%">
        <el-table-column
          prop="num"
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="活动名称"
          width="260"
          align="center">
        </el-table-column>
        <el-table-column
          prop="activitiesGoodsDescribe"
          label="活动规则"
          width="260"
          align="center">
        </el-table-column>
        <el-table-column
          label="活动时间"
          align="center">
          <template slot-scope="scope">
            {{scope.row.beginTime}} 至 {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.statusCode === 2 || scope.row.statusCode === 3" size="small" @click="add('detail', scope.row.id)">查看</el-button>
            <el-button type="text" v-if="scope.row.statusCode === 0 || scope.row.statusCode === 1" size="small" @click="add('edit', scope.row.id)">编辑</el-button>
            <el-button type="text" v-if="scope.row.statusCode === 1" size="small" @click="add('end', scope.row.id)">结束</el-button>
            <el-button type="text" v-if="scope.row.statusCode === 0 || scope.row.statusCode === 2 || scope.row.statusCode === 3" size="small" @click="add('del', scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChangeMeet"
          @current-change="handleCurrentChangeMeet"
          :current-page="meetPageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="meetPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="fullDiscountTotal">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--满折 end-->

    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      width="500px">
      <p>{{deleteMessage}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="delOrEnd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import pcQueryDiscountList from '../../../../../src/api/ShopActivity/pcQueryDiscountList.js'
  import pCQueryMeetDiscountList from '../../../../../src/api/ShopActivity/pCQueryMeetDiscountList.js'
  import deleteActivity from '../../../../../src/api/ShopActivity/deleteActivity.js'
  import theEndActivity from '../../../../../src/api/ShopActivity/theEndActivity.js'

  export default {
    mounted () {
      if (this.choice === '折扣') {
        this.title = '';
        this.time = [];
        this.discountValue = 0;
        this.queryDiscountList();
      }else if (this.choice === '满折') {
        this.title = '';
        this.time = [];
        this.discountValue = 0;
        this.queryMeetDiscountList();
      }
    },
    data () {
      return {
        carList: ['折扣', '满折'],
        choice: this.$route.params.name === 1 ? '满折' : '折扣',
        title : '',
        time: [], // 折扣时间值
        discountOptions: [{  // 折扣活动状态选项
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '未开始'
        }, {
          value: 2,
          label: '进行中'
        }, {
          value: 3,
          label: '已结束'
        }],
        discountValue: 0, // 折扣活动状态值
        discountData: [],
        discountTotal: 0,
        currentPage: 1, // 折扣分页
        discountPageIndex: 1, //折扣起始页
        discountPageSize: 5, //折扣每页大小
        meetPageIndex: 1, //满折起始页
        meetPageSize: 5, //满折每页大小

        fullDiscountData: [],
        fullDiscountTotal: 0,
        deleteVisible: false, //删除,结束提示框
        deleteMessage: '',
        deleteType: '',
        deleteId: '',
      }
    },
    methods: {
      changeChoice(name) {
        this.choice = name;
        this.searchList();
      },
      //搜素
      searchList(){
        if (this.choice === '折扣') {
          this.queryDiscountList();
        }else if (this.choice === '满折') {
          this.queryMeetDiscountList();
        }
      },
      /**
       * 折扣查询列表
       */
      queryDiscountList() {
        let _param = `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&pageIndex=${this.discountPageIndex}&pageSize=${this.discountPageSize}&status=${this.discountValue}`;
        if (this.title !== '' && this.title !== null) {
          _param += `&key=${this.title}`;
        }
        if (this.time !== null && this.time.length > 0){
          _param += `&begin_time=${this.time[0]}&end_time=${this.time[1]}`;
        }
        pcQueryDiscountList.call(this, _param).then(res => {
          if (res.data.code === 1) {
            //成功
            if (res.data.data != null) {
              this.discountData = res.data.data.discountList;
              this.discountTotal = res.data.data.totalCount;
            }
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        })
      },
      //满折
      queryMeetDiscountList() {
        let _param = `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&pageIndex=${this.meetPageIndex}&pageSize=${this.meetPageSize}&status=${this.discountValue}`;
        if (this.title !== '' && this.title !== null) {
          _param += `&key=${this.title}`;
        }
        if (this.time !== null && this.time.length > 0){
          _param += `&begin_time=${this.time[0]}&end_time=${this.time[1]}`;
        }
        pCQueryMeetDiscountList.call(this, _param).then(res => {
          if (res.data.code === 1) {
            //成功
            if (res.data.data != null) {
              this.fullDiscountData = res.data.data.meetList;
              this.fullDiscountTotal = res.data.data.totalCount;
            }
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        })
      },
      /**
       * 分页方法
       * @param val
       */
      handleSizeChangeDiscount(val) {
        this.discountPageSize = val;
        this.discountPageIndex = 1;
        this.searchList();
      },
      handleCurrentChangeDiscount(val) {
        this.discountPageIndex = val;
        this.searchList();
      },

      handleSizeChangeMeet(val) {
        this.meetPageSize = val;
        this.meetPageIndex = 1;
        this.searchList();
      },
      handleCurrentChangeMeet(val) {
        this.meetPageIndex = val;
        this.searchList();
      },

      /**
       * 添加
       * add是添加，edit是编辑，detail是详情 del是删除 end是结束
       */
      add( type,id ) {
        let name = 0; // 0是折扣，1是满折
        if (this.choice === '折扣') {
          name = 0;
        } else {
          name = 1;
        }
        if (type === 'del'){
          //删除
          this.deleteVisible = true;
          this.deleteMessage = '删除后将不能恢复，确认删除？';
          this.deleteType = type;
          this.deleteId = id;
        } else if (type === 'end'){
          //结束
          this.deleteVisible = true;
          this.deleteMessage = '活动正在进行中，结束后活动商品将恢复原价，确认结束？';
          this.deleteType = type;
          this.deleteId = id;
        } else {
          // 添加 删除 详情
          this.$router.push({
            name: 'AddDiscount',
            query: { name: name, type: type, id: id }
          });
        }
      },
      delOrEnd() {
        this.deleteVisible = false;
        let _input = {
          clientVersion: '1.0.0',
          clientTimespan: '2019-05-16 11:13:00',
          activityId: this.deleteId
        };
        if (this.deleteType === 'del'){
          deleteActivity.call(this, _input).then(res => {
            if (res.data.code === 1) {
              //成功
              this.$message.success('活动删除成功!');
              if (this.choice === '折扣') {
                if (this.discountTotal > this.discountPageSize && this.discountTotal % this.discountPageSize === 1 && this.discountPageIndex > this.discountTotal / this.discountPageSize){
                  //删除后 回到上一页
                  --this.discountPageIndex;
                }
              }else if (this.choice === '满折') {
                if (this.fullDiscountTotal > this.meetPageSize && this.fullDiscountTotal % this.meetPageSize === 1 && this.meetPageIndex > this.fullDiscountTotal / this.meetPageSize){
                  //删除后 回到上一页
                  --this.meetPageIndex;
                }
              }
              this.searchList();
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
          })
        } else if (this.deleteType === 'end'){
          theEndActivity.call(this, _input).then(res => {
            if (res.data.code === 1) {
              //成功
              this.$message.success('活动结束成功!');
              this.searchList();
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
          })
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
