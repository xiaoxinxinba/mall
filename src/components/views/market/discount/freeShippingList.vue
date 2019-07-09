<template>
  <div class="discount_box">

    <div class="btn">
      <ul>
        <li class="active">包邮促销</li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <!--条件筛选 start-->
    <div class="screen">
      <el-form :inline="true" class="demo-form-inline" label-width="100px">

        <el-form-item label="活动状态：">
          <el-select v-model="discountValue" placeholder="请选择">
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
          <el-button type="primary" @click="getFreeFullGiftActivityList(true)">搜索</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="add('add')">添加</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--条件筛选 end-->

    <!--优惠券 start-->
    <div>
      <el-table
        :data="discountData"
        border
        style="width: 100%">
        <el-table-column
          prop="num"
          type="index"
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
          label="活动时间"
          align="center"
          width="200">
          <template slot-scope="scope">
            <div>{{scope.row.begin_time}} 至 {{scope.row.end_time}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="包邮条件"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.full_desc}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.state_name}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150px">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3" @click="add('detail', scope.row.id)">查看</el-button>
            <el-button type="text" size="small" v-if="scope.row.status === 0 " @click="add('edit', scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" v-if="scope.row.status === 0 || scope.row.status === 2 || scope.row.status === 3" @click="add('del', scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--优惠券 end-->

    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      width="500px">
      <p>删除后不能恢复，确认删除？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="delMethod">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import getFreeFullGiftActivityList from '../../../../../src/api/ShopActivity/getFreeFullGiftActivityList.js'
  import deleteActivity from '../../../../../src/api/ShopActivity/deleteActivity.js'

  export default {
    mounted () {
      this.getFreeFullGiftActivityList();
    },
    data () {
      return {
        time:  [], // 折扣时间值
        discountOptions: [{  // 活动状态选项
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
        discountValue: 0, // 活动状态值
        discountData: [],
        title: '',
        pageIndex: 1, // 优惠券分页
        pageSize: 5,
        totalCount: 0,
        deleteVisible: false,
        deleteId : '',

      }
    },
    methods: {

      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        this.pageSize = val;
        this.getFreeFullGiftActivityList(true);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getFreeFullGiftActivityList();
      },

      /**
       * 添加页
       */
      add(type, id) {
        if (type === 'del') {
          //删除
          this.deleteVisible = true;
          this.deleteId = id;
        } else {
          this.$router.push({
            name: 'AddFreeShipping',
            query: {type: type,
              id: id}
          });
        }
      },
      getFreeFullGiftActivityList(flag) {
        if (flag === true){
          this.pageIndex = 1;
        }
        let _param = `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&status=${this.discountValue}`;
        if (this.title !== '' && this.title !== null) {
          _param += `&key=${this.title}`;
        }
        if (this.time !== null && this.time.length > 0) {
          _param += `&begin_time=${this.time[0]}&end_time=${this.time[1]}`;
        }
        getFreeFullGiftActivityList.call(this, _param).then(res => {
          if (res.data.code === 1) {
            //成功
            if (res.data.data != null) {
              this.discountData = res.data.data.list;
              this.totalCount = res.data.data.totalCount;
            }
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        })
      },
      delMethod(){
        this.deleteVisible = false;
        let _input = {
          clientVersion: '1.0.0',
          clientTimespan: '2019-05-16 11:13:00',
          activityId: this.deleteId
        };
        deleteActivity.call(this, _input).then(res => {
          if (res.data.code === 1) {
            //成功
            this.$message.success('活动删除成功!');
            if (this.totalCount > this.pageSize && this.totalCount % this.pageSize === 1 && this.pageIndex > this.totalCount / this.pageSize){
              //删除后 回到上一页
              --this.pageIndex;
            }
            this.getFreeFullGiftActivityList();
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        })
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
