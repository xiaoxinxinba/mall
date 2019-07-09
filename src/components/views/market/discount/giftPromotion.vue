<template>
  <div class="discount_box">
    <div class="btn">
      <ul>
        <li :class="choice === item && 'active'" v-for="(item, i) in carList" :key="i" @click="changeChoice(item)">
          {{item}}
        </li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <!--条件筛选 start-->
    <div class="screen">
      <el-form :inline="true" class="demo-form-inline" label-width="100px">
        <!-- 活动状态输入框 -->
        <el-form-item label="活动状态：" v-if="choice !== '设置赠品'">
          <el-select v-model="discountValue" clearable placeholder="请选择">
            <el-option
              v-for="item in discountOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="活动状态：" v-if="choice === '买几赠几'">
          <el-select v-model="discountValue" placeholder="请选择">
            <el-option
              v-for="item in discountOptions1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <!-- 时间选择 -->
        <el-form-item label="时间：" v-if="choice !== '设置赠品'">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!-- 活动名称 -->
        <el-form-item :label="choice === '设置赠品' ? '赠品名称：' : '活动名称：'">
          <el-input placeholder="请输入商品名称" v-model="activitytitle"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="query()">搜索</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="add('add')">添加</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--条件筛选 end-->

    <!--设置赠品 start-->
    <div v-if="choice === '设置赠品'">
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="sort"
            label="序号"
            align="center"
            width="55">
            <template slot-scope="scope">{{(pageNum-1)*itemNum+(scope.$index)+1}}</template>
          </el-table-column>

          <el-table-column
            label="赠品图片"
            align="center"
            width="120">
            <template slot-scope="scope">
              <img class="pic" :src="pics[scope.$index]" alt title="点击查看大图">
              <!-- <viewer :images="scope.row.pics">
            </viewer> -->
            </template>
          </el-table-column>

          <el-table-column
            label="赠品名称"
            align="center"
            width="320">
            <template slot-scope="scope">
              <div class="shopName">
                <p style="text-align: left;">{{scope.row.title}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="市场价格(元)">
            <template slot-scope="scope">
              <div>{{scope.row.price}}</div>
            </template>
          </el-table-column>

          <!-- <el-table-column
            align="center"
            label="库存(件)">
            <template slot-scope="scope">
              <div>{{scope.row.inventory}}</div>
            </template>
          </el-table-column> -->

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="add('detail',scope.row.id)">查看</el-button>
              <el-button type="text" @click="add('edit',scope.row.id)">编辑</el-button>
              <el-button type="text" @click="deleteVisible = true,delect(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--页码开始-->
      <div class="paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="pageSizes"
          :page-size="itemNum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--设置赠品 end-->

    <!--满赠 start-->
    <div v-if="choice === '满赠'">
      <el-table
        :data="fullDiscountData"
        border
        style="width: 100%">
        <el-table-column
          label="序号"
          width="80"
          align="center">
          <template slot-scope="scope">{{(pageNum-1)*itemNum+(scope.$index)+1}}</template>
        </el-table-column>
        <el-table-column
          label="活动名称"
          width="260"
          align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column
          label="活动规则"
          width="260"
          align="center">
          <template slot-scope="scope">{{scope.row.fullDesc}}</template>
        </el-table-column>
        <el-table-column
          label="活动时间"
          align="center">
          <template slot-scope="scope">{{scope.row.begin_time}} 至 {{scope.row.end_time}}</template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center">
          <template slot-scope="scope">{{scope.row.stateName}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text"  @click="add('detail',scope.row.id)">查看</el-button>
            <el-button type="text"  :disabled='scope.row.stateName!=="未生效"?true:false'  @click="add('edit',scope.row.id)">编辑</el-button>
            <el-button type="text" :disabled='scope.row.stateName==="已生效"?true:false' @click="deleteVisible = true,delect(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-sizes="pageSizes1"
          :page-size="itemNum1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--满赠 end-->

    <!--指定赠 start-->
    <div v-if="choice === '指定赠'">
      <el-table
        :data="giftData"
        border
        style="width: 100%">
        <el-table-column
          label="序号"
          width="80"
          align="center">
          <template slot-scope="scope">{{(pageNum-1)*itemNum+(scope.$index)+1}}</template>
        </el-table-column>
        <el-table-column
          label="活动名称"
          align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column
          label="主商品"
          align="center">
          <template slot-scope="scope">{{scope.row.mainProductDesc}}</template>
        </el-table-column>
        <el-table-column
          label="赠品"
          align="center">
          <template slot-scope="scope">{{scope.row.giftDesc}}</template>
        </el-table-column>
        <el-table-column
          label="活动时间"
          align="center"
          width="350px">
          <template slot-scope="scope">{{scope.row.begin_time}}至{{scope.row.end_time}}</template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center">
          <template slot-scope="scope">{{scope.row.stateName}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="add('detail',scope.row.id)">查看</el-button>
            <el-button type="text" @click="add('edit',scope.row.id)" :disabled='scope.row.stateName!=="未生效"?true:false'>编辑</el-button>
            <el-button type="text" @click="remove(scope.row.id)" :disabled='scope.row.stateName==="已生效"?true:false'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage2"
          :page-sizes="pageSizes2"
          :page-size="itemNum2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--指定赠 end-->

    <!--买几赠几 start-->
    <div v-if="choice === '买几赠几'">
      <el-table
        :data="buyAndGiftData"
        border
        style="width: 100%">
        <el-table-column
          label="序号"
          width="80"
          align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column
          label="活动名称"
          width="260"
          align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column
          label="活动商品"
          width="260"
          align="center">
          <template slot-scope="scope">{{scope.row.shop}}</template>
        </el-table-column>
        <el-table-column
          label="活动时间"
          align="center">
          <template slot-scope="scope">{{scope.row.time}}</template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center">
          <template slot-scope="scope">{{scope.row.state}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="add('detail',scope.row.id)">查看</el-button>
            <el-button type="text" @click="add('edit',scope.row.id)" :disabled='scope.row.state!=="未生效"?true:false'>编辑</el-button>
            <el-button type="text" @click="deleteVisible = true,storageBuyGiftId(scope.row.id)" :disabled='scope.row.state==="已生效"?true:false'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage3"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total3">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>
    <!--买几赠几 end-->

    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      width="500px">
      <p>删除后不能恢复，确认删除？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteVisible = false,deleteAll()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GetGiftProductList from '../../../../api/giftPromotion/GetGiftProductList';   //查询赠品列表
  import delectGift from '../../../../../src/api/giftPromotion/delectGift';         //删除赠品
  import GetFullGiftProductList from '../../../../../src/api/giftPromotion/GetFullGiftProductList';       //查询满赠列表
  import DeleteActivity from '../../../../../src/api/giftPromotion/DeleteActivity';       //删除满赠活动
  import GetFullSpecifiedProductList from '../../../../api/giftPromotion/GetFullSpecifiedProductList.js' // 指定赠查询列表 get
  import GetFullBuyGiftProductList from '../../../../api/giftPromotion/GetFullBuyGiftProductList' // 买几个送几个


  export default {
    mounted() {
      this.setTheGiftList();
    },
    computed: {
      testUrl() {
        return this.$store.state.api.testUrl
      }
    },
    data() {
      return {
        carList: ['设置赠品', '满赠', '指定赠', '买几赠几'],
        choice: '设置赠品',
        time: '', // 折扣时间值[new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageNum: 1, //当前页
        itemNum: 10, //每页多少条
        total: 100,

        currentPage1: 1,       //满赠的分页模型
        pageSizes1: [10, 20, 30, 40],
        itemNum1: 10,
        total1: 100,
        clientTimespan: '',
        activitytitle: '',     //赠品名称
        giftprootionid: '',    //要删除的赠品id
        discountOptions: [{  // 折扣活动状态选项
          value: '1',
          label: '未生效'
        }, {
          value: '2',
          label: '已生效'
        }, {
          value: '3',
          label: '已过期'
        },
        ],
        /*discountOptions1: [{  // 折扣活动状态选项
          value: '0',
          label: '未生效'
        }, {
          value: '1',
          label: '已生效'
        }, {
          value: '2',
          label: '已过期'
        }, {
          value: '3',
          label: '结束'
        }, {
          value: '4',
          label: '暂停'
        }],*/
        discountValue: '', // 折扣活动状态值
        tableData: [{ // 设置赠品数据
          sort: '1',
          name: '2015年度潮流红色鞋款是见覅的违法阿法阿法阿1000',
          price: '￥60.00-80.00',
          pics: 'https://picsum.photos/id/237/200/300',
          inventory: '100',
        }],
        pics: [],
        currentPage: 1, // 设置赠品分页

        fullDiscountData: [],// 满增表格数据
        currentPage1: 1, // 满增分页
        //  指定赠送数据
        giftData: [],// 指定增表格数据
        currentPage2: 1, // 指定增分页
        pageSizes2: [5,10,20,40],//指定增每页条数
        itemNum2: 10,
        total2: 0,

        buyAndGiftData: [/*{   // 买几赠几数据
          sort: '1',
          name: '五一限时9折优惠',
          shop: '共2件',
          time: '2017.04.29 00:00 至 2017.05.01 23:59',
          state: '进行中'
        }, {
          sort: '2',
          name: '新品上架限时8小时2.5折优惠',
          shop: '共2件',
          time: '2017.04.29 00:00 至 2017.05.01 23:59',
          state: '已结束'
        }*/],
        currentPage3: 1, // 买几赠几分页
        pageSize3: 10, // 买几赠几分页
        total3: 0,
        statusList: ['未生效', '已生效', '已过期', '已结束', '已暂停'],
        buyGiftId: '',
        deleteVisible: false,
        clientTimespan1: new Date().toLocaleString(),
        clientVersion: '1',
        zhiding:''//指定赠删除ID
      }
    },
    methods: {
      changeChoice(name) {
        //alert(name)
        this.choice = name;
        //切换种类时清空筛选框中的内容
        this.activitytitle = '';
        this.discountValue = "";
        this.time = '';
        //切换种类时清空筛选框中的内容
        if (name = "满赠") {
          this.queryGetFullGiftProductList();
        }
        if (name = '买几赠几') {
          this.currentPage3 = 1;
          this.getFullBuyGiftProductList();
        }
        if (name = "指定赠") {
          this.currentPage2=1;
          this.GetFullSpecifiedProductList();
        }
      },
      setTheGiftList: function () {     //设置赠品列表查询
        this.clientTimespan = new Date().toLocaleString();
        GetGiftProductList.call(this, `?input.title=${this.activitytitle}&input.pageSize=${this.itemNum}&input.pageIndex=${this.pageNum}&input.clientTimespan=${this.clientTimespan}`).then(res => {
          if (res.data.code === 1) {
            console.log(res)
            this.tableData = res.data.data.giftProduct;
            this.total = res.data.data.totalCount;
            this.pics = [];
            for (let i = 0; i < res.data.data.giftProduct.length; i++) {
              this.pics.push(res.data.data.giftProduct[i].pics.split(",")[0]);
            }
            console.log(this.pics);
          } else {
            this.$message.error("查询赠品列表失败！");
          }
        })
      },
      delect(id) {     //取删除的id
        this.giftprootionid = id;    //要删除的活动或赠品id通用存储键：giftprootionid；
      },
      queryGetFullGiftProductList() {        //满赠查询列表方法
        this.clientTimespan = new Date().toLocaleString();
        let begin_time = "";
        let end_time = "";
        if (this.time != "" && this.time !=null) {
          begin_time = this.time[0].toLocaleString();
          end_time = this.time[1].toLocaleString();
        }
        let status = 0;
        if (this.discountValue != ""&&this.discountValue!=null) {
          status = this.discountValue;
        }
        GetFullGiftProductList.call(this, `?input.key=${this.activitytitle}&input.pageSize=${this.itemNum}
                  &input.pageIndex=${this.pageNum}&input.clientTimespan=${this.clientTimespan}
                  &input.begin_time=${begin_time}&input.end_time=${end_time}&input.status=${status}`).then(res => {
          if (res.data.code === 1) {
            // console.log(res.data.data.list);
            this.fullDiscountData = res.data.data.list;
            this.total1 = res.data.data.totalCount;
          } else {
            this.$message.error("查询满赠列表失败！");
          }
        })
      },
      deleteAll() {
        if (this.choice === '设置赠品') {
          this.clientTimespan = new Date().toLocaleString();
          let info = {
            activityId: this.giftprootionid,
            clientTimespan: this.clientTimespan
          }
          delectGift.call(this, info).then(res => {
            console.log(res);
            if (res.data.code === 1) {
              this.setTheGiftList();
              this.$message.success("删除成功");
            } else {
              this.$message.error("删除失败！");
            }
          })
        } else if (this.choice === '满赠') {
          this.clientTimespan = new Date().toLocaleString();
          let info = {
            activityId: this.giftprootionid,
            clientTimespan: this.clientTimespan
          }
          DeleteActivity.call(this, info).then(res => {
            console.log(res);
            if (res.data.code === 1) {
              this.queryGetFullGiftProductList();
              this.$message.success("删除成功");
            } else {
              this.$message.error("删除失败！");
            }
          })
        } else if (this.choice === '指定赠') {
          DeleteActivity.call(this,{
             activityId:this.zhiding,
             clientTimespan:this.clientTimespan1,
             clientVersion:this.clientVersion
             }).then(res=>{
              //  console.log(res)
              if(res.data.code===1){
                this.$message.success('删除成功')
                // 刷新列表
                this.GetFullSpecifiedProductList()
              }
             })
        } else if (this.choice === '买几赠几') {
          this.clientTimespan = new Date().toLocaleString();
          let info = {
            activityId: this.buyGiftId,
            clientTimespan: this.clientTimespan
          };
          DeleteActivity.call(this, info).then(res => {
            console.log(res);
            if (res.data.code === 1) {
              this.getFullBuyGiftProductList();
              this.$message.success("删除成功");
            } else {
              this.$message.error("删除失败！");
            }
          })
        }
      },
      query: function () {
        if (this.choice === '设置赠品') {
          this.setTheGiftList();
        } else if (this.choice === '满赠') {
          this.queryGetFullGiftProductList();
        } else if (this.choice === '指定赠') {
          this.GetFullSpecifiedProductList()
        } else if (this.choice === '买几赠几') {
          this.getFullBuyGiftProductList()
        }
      },
      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.itemNum = val;
        this.setTheGiftList();
        this.pageSize3 = val;
        this.getFullBuyGiftProductList();
        this.itemNum2=val;
        this.GetFullSpecifiedProductList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum = val;
        this.setTheGiftList();
        this.currentPage3 = val;
        this.getFullBuyGiftProductList();
        this.currentPage2=val;
        this.GetFullSpecifiedProductList();
      },

      /**
       * 添加
       * add是添加，edit是编辑，detail是详情
       */
      add(type, id) {
        // name = 0是设置赠品，1是满赠，2是指定增，3是买几增几
        if (this.choice === '设置赠品') {
          this.$router.push({name: 'AddGift', query: {type: type, id: id}});
        } else if (this.choice === '满赠') {
          this.$router.push({name: 'AddFullGift', query: {type: type, id: id}});
        } else if (this.choice === '指定赠') {
          this.$router.push({name: 'AddFixedGift', query: {type: type, id: id}});
        } else if (this.choice === '买几赠几') {
          this.$router.push({name: 'AddBuyAndGift', query: {type: type, id: id}});
        }
      },
      // 指定赠查询列表
      GetFullSpecifiedProductList() {
        let begin_time = "";
        let end_time = "";
        if (this.time != ''&&this.time!=null) {
          begin_time = this.time[0].toLocaleString();
          end_time = this.time[1].toLocaleString();
        }
        let status = 0;
        if (this.discountValue != ''&&this.discountValue!=null) {
          status = this.discountValue;
        }
      
         GetFullSpecifiedProductList.call(this, `?input.key=${this.activitytitle}&input.begin_time=${begin_time}&input.end_time=${end_time}&input.status=${status}&input.pageSize=${this.itemNum2}&input.pageIndex=${this.currentPage2}&input.clientTimespan=${this.clientTimespan1}`)
          .then(res => {
            if (res.data.code === 1) {
              // this.giftData = res.data.data.list
              console.log(res)
              // let zhidingdata = {}
              // for(let i=0;i<res.data.data.list.length;i++){
              //    zhidingdata={
              //        id:res.data.data.list[i].id,//活动id
              //        title:res.data.data.list[i].title,//活动标题
              //        stateName:res.data.data.list[i].stateName,//活动状态
              //        shop_id:res.data.data.list[i].shop_id,//商品ID
              //        mainProductDesc:res.data.data.list[i].mainProductDesc,//主商品
              //        giftDesc:res.data.data.list[i].giftDesc,//赠品
              //        sort:i + 1,
              //        time: res.data.data.list[i].begin_time + '至' + res.data.data.list[i].end_time,//时间
              //    }
              //    this.giftData.push(zhidingdata)
              // }
              // this.total2 = res.data.data.totalCount
              this.giftData = res.data.data.list;
              console.log('指定赠列表数据',this.giftData);
              this.total2 = res.data.data.totalCount;
            }
          })
        
      },
      //指定赠删除模态框先显示
      remove(id){
        this.deleteVisible = true;
        //console.log(id)
        this.zhiding = id
      },

      //买几赠几活动列表
      getFullBuyGiftProductList() {
        let begin_time = '';
        let end_time = '';
        //console.log('ttttttttttttttttttttttttttttttt', this.time);
        if (this.time !== '' && this.time != null) {
          begin_time = this.time[0].toLocaleString();
          end_time = this.time[1].toLocaleString();
        }
        let discountValue = '';
        if (this.discountValue === ''||this.discountValue==null) {
          discountValue = 0;
        } else {
          discountValue = this.discountValue;
        }
        GetFullBuyGiftProductList.call(this, '?key=' + this.activitytitle + '&begin_time=' + begin_time + '&end_time='
          + end_time + '&status=' + discountValue + '&pageSize=' + this.pageSize3 + '&pageIndex=' + this.currentPage3
          + '&clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan1)
          .then(
            res => {
              if (res.data.code === 1) {
                this.buyAndGiftData = [];
                /*console.log(('---------------------买一送一百--------------------------------------------------------------------------------'));
                console.log(res.data.data);*/
                /*
                *  buyAndGiftData: [{   // 买几赠几数据
          sort: '1',
          name: '五一限时9折优惠',
          shop: '共2件',
          time: '2017.04.29 00:00 至 2017.05.01 23:59',
          state: '进行中'
        },*/
                let data = {};
                for (let i = 0; i < res.data.data.list.length; i++) {
                  data = {
                    id: res.data.data.list[i].id,
                    shopId: res.data.data.list[i].shop_id,//商家id
                    stateName: res.data.data.list[i].stateName,//状态描述
                    shop: res.data.data.list[i].giftDesc,//买赠说明
                    sort: i + 1,
                    name: res.data.data.list[i].title,
                    //shop:res.data.data[i].title,
                    time: res.data.data.list[i].begin_time + '至' + res.data.data.list[i].end_time,
                    //state:res.data.data[i].status ,
                    state: this.statusList[res.data.data.list[i].status],
                  };
                  this.buyAndGiftData.push(data);
                }
                this.total3 = res.data.data.totalCount;
              }
            }
          )
      },

      //设置删除买赠活动的id
      storageBuyGiftId(id) {
        this.buyGiftId = id;
      },
      /*
      * 列表数据对接，
      * 详情数据添加绑定
      * 详情会判断是编辑还是查看
      * 页面还会跳到商品详情页面
      * */

      /*
      * 添加功能赠送条件判断完成，添加成功后会跳转到买赠界面
      *
      * 编辑 删除。
      * */
    },
    /*watch: {
      pageSize3: function(val) {
        alert(val)
        this.getFullBuyGiftProductList();
      },
      currentPage3: function() {
        this.getFullBuyGiftProductList();
      }
    },*/

    created() {
      if (this.$route.query.activityName !== undefined) {
        this.choice = this.$route.query.activityName;
      }
      this.GetFullSpecifiedProductList();
      this.getFullBuyGiftProductList();
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
