<template>
  <div class="addDiscount_box">

    <div class="title_box">
      <ul>
        <li class="active"><span v-if="pageType === 'add'">添加</span><span v-if="pageType === 'edit'">编辑</span><span
          v-if="pageType === 'detail'">查看</span>买几赠几活动
        </li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name" label-width="100px">
        <el-input style="width: 400px;" v-model="ruleForm.name"
                  :disabled="pageType === 'detail' ? true : false" @change="regexExtent(ruleForm.name)"></el-input>
        <span class="add_font">（限20字）</span>
      </el-form-item>

      <el-form-item label="活动时间" required label-width="100px">
        <div class="add_line">
          <span>
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                :disabled="pageType === 'detail' ? true : false"
                :picker-options="startTimes" @change="startMonth"
                type="date"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span"> 至 </span>
          <span>
            <el-form-item prop="date2">
              <el-date-picker
                v-model="ruleForm.date2"
                :disabled="pageType === 'detail' ? true : false"
                :picker-options="endTimes" @change="endMonth"
                type="date"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span">共</span>
          <el-input style="width: 100px;" v-model="ruleForm.num"
                    :disabled="pageType === 'detail' ? true :  (pageType==='add' ? true : (pageType==='edit'? true:false))" @blur="DateDiff(ruleForm.date1,ruleForm.date2)" ></el-input>
          <span class="add_span">天</span>
          <i>（活动时间7-30天，从开始日00:00:00生效，结束日23:59:59失效）</i>
        </div>
      </el-form-item>

      <el-form-item label="商品设置" label-width="100px" v-if="pageType !== 'detail'">
        <div>
          <el-button type="default" @click="selectShop">+ 选择商品</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="add_top" v-if="pageType !== 'detail'">
          <el-button type="default" size="small" @click="setConditionVisible = true,mett_num='',num=''">批量设置条件
          </el-button>
          <el-button type="danger" size="small" @click="removeActivityAll">批量移除</el-button>
        </div>

        <!--添加/编辑的表格 start-->
        <div class="table table1" v-if="pageType !== 'detail'">
          <el-table
            ref="multipleTable"
            :data="tableData1"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>

            <!--<el-table-column
              prop="sort"
              label="序号"
              align="center"
              width="55">
            </el-table-column>-->
            <el-table-column
              label="商品图片"
              align="center">
              <template slot-scope="scope">
                <viewer :images="scope.row.imgUrl">
                  <img class="pic" :src="scope.row.imgUrl" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center">
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail(scope.row.id)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="赠送条件(件)"
              width="400">
              <template slot-scope="scope">
                <div class="add_prepend">
                  <el-input style="width: 160px;" placeholder="输入数量" v-model="scope.row.meet_num"
                            @blur="regexNum(scope.row,'meet_num')">
                    <template slot="prepend">买</template>
                  </el-input>
                  <el-input style="width: 160px; margin-left: -5px;" placeholder="输入数量" v-model="scope.row.num"
                            @blur="regexNum(scope.row,'num')">
                    <template slot="prepend">送</template>
                  </el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="removeActivity(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--添加/编辑的表格 end-->

        <!--详情的表格 start-->
        <div class="table table1" v-if="pageType === 'detail'">
          <el-table
            :data="tableData"
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
                <viewer :images="scope.row.imgUrl">
                  <img class="vue-lazyload pic" v-lazy="scope.row.imgUrl" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center">
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail(scope.row.id)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="赠送条件(件)"
              width="400">
              <template slot-scope="scope">
                <span class="look_span">{{scope.row.condition}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--详情的表格 end-->

        <!--页码开始-->
        <!--<div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="activityCurrentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="activityPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="activityTotalPage">
          </el-pagination>
        </div>-->
        <!--页码结束-->
      </el-form-item>

      <el-form-item label-width="80px" style="margin-top: 60px;">
        <el-button type="primary" v-if="pageType !== 'detail'" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button v-if="pageType !== 'detail'" @click="calcle">返 回</el-button>
        <el-button v-if="pageType === 'detail'" @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>

    <!--选择商品弹框 start-->
    <el-dialog
      title="选择商品"
      :visible.sync="shopDataVisible"
      width="60%">
      <div>

        <div class="dialog_span">
          <span>
            <el-cascader
              :options="shopOptions"
              v-model="selectedShopOptions"
              :props="shopProps"
              clearable
              :show-all-levels="false">
            </el-cascader>
          </span>

          <span>
            <el-input placeholder="请输入商品名称" v-model="grantName"></el-input>
          </span>

          <span>
            <el-button type="primary" @click="searchShop">搜索商品</el-button>
          </span>

          <!--<span>
            <el-button type="primary" @click="">确定</el-button>
          </span>-->
        </div>

        <!--表格 start-->
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="shopData"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>

            <el-table-column
              label="商品图片"
              fixed
              align="center"
              width="280">
              <template slot-scope="scope">
                <viewer :images="scope.row.imgUrl">
                  <img class="pic" :src="scope.row.imgUrl" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
              width="320">
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail"><!--2015年度潮流红色鞋款是见覅的违法阿法阿法阿1000-->
                      {{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="原价(元)">
              <template slot-scope="scope">
                <div><!--￥60.00-80.00-->{{scope.row.sellPrice}}</div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="库存(件)">
              <template slot-scope="scope">
                <div><!--100-->{{scope.row.stockQuantity}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--表格 end-->

        <!--页码开始-->
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="grantCurrentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="grantPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="grantTotalPage">
          </el-pagination>
        </div>
        <!--页码结束-->

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="shopConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择商品弹框 end-->
<!--title="选择商品"-->
    <!--批量设置弹框 start-->
    <el-dialog
      :visible.sync="setConditionVisible"
      width="600px">
      <div class="add_prepend" style="text-align: center;">
        <el-input style="width: 160px;" placeholder="输入数量" v-model="mett_num" @blur="regexNum1(mett_num,'mett_num')">
          <template slot="prepend">买</template>
        </el-input>
        <el-input style="width: 160px; margin-left: -5px;" placeholder="输入数量" v-model="num" @blur="regexNum1(num,'num')">
          <template slot="prepend">送</template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setConditionVisible = false">取 消</el-button>
        <el-button type="primary" @click="setConditionAll">确 定</el-button>
      </span>
    </el-dialog>
    <!--批量设置弹框 end-->

    <el-dialog
      title="提示"
      :visible.sync="sureDialogVisible"
      width="500px">
      <div>
        <p>活动将在开始时间自动发布，发布后将不能修改，确认添加？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sureDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitActivity">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="cancleDialogVisible"
      width="500px">
      <div>
        <p>你已编辑了活动信息，确认放弃？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goBack">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GetBuyProductGetProductInfo from '../../../../api/giftPromotion/GetBuyProductGetProductInfo' // 买几个送几个de 详情
  import GetFullBuyGiftActivityList from '../../../../api/giftPromotion/GetFullBuyGiftActivityList' // 买几个送几个de 活动列表
  import GetGoodsBriefInfoByPage from '../../../../api/giftPromotion/GetGoodsBriefInfoByPage' // 赠品列表
  import InsertBuyProductGetProduct from '../../../../api/giftPromotion/InsertBuyProductGetProduct' // 新增或修改
  import getCategory from '../../../../../src/api/ShopActivity/getCategory.js';       //分类查询
  export default {
    mounted() {

    },
    data() {
      return {
        id: 0,
        pageType: this.$route.query.type,
        sureDialogVisible: false, // 点击确定的提示框
        cancleDialogVisible: false, // 点击取消的提示框
        grantName: '',//赠品名称
        pageSize: 10,
        totalPage: 12,
        grantCurrentPage: 1,
        grantPageSize: 10,
        grantTotalPage: 0,
        activityCurrentPage: 1,
        activityPageSize: 10,
        activityTotalPage: 0,
        mett_num: 0,//批量设置的阀值
        num: 0,
        ruleForm: {
          name: '',
          num: '',
          date1: '',
          date2: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          date1: [
            {type: 'data', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'data', required: true, message: '请选择时间', trigger: 'change'}
          ]
        },
        tableData: [/*{ // 表格数据
          sort: '1',
          pic: 'https://picsum.photos/id/237/200/300',
          condition: '满500减90元 | 100张'
        }*/],
        shopData: [],
        tableData1: [/*{
          meet_num: '',
          num: '',
          title: 'aaaaaa',
          pic: 'https://picsum.photos/id/237/200/300',
        }*/],
        multipleSelection: [], // 表格全选参数
        currentPage: 1,
        shopDataVisible: false,
        shopProps: {
          value: 'id',
          label: 'title',
          children: 'cateogryChildren'
        },
        selectedShopOptions: [], //商家选择的分类
        shopOptions: [{ // 搜索条件-商品分类的选项
          value: 'wristWatch',
          label: '腕表眼镜',
          children: [{
            value: 'zhongbiao',
            label: '钟表',
            children: [{
              value: 'huaibiao',
              label: '怀表'
            }]
          }, {
            value: 'peijian',
            label: '配件',
            children: [{
              value: 'biaohe',
              label: '表盒表带'
            }]
          }]
        }, {
          value: 'xiangbao',
          label: '服饰箱包',
          children: [{
            value: 'fushi',
            label: '服饰配件',
            children: [{
              value: 'xiukou',
              label: '袖扣'
            }, {
              value: 'lingdaitou',
              label: '领带夹'
            }]
          }]
        }, {
          value: 'xiexue',
          label: '精品鞋靴',
          children: [{
            value: 'lvTongXie',
            label: '运动鞋'
          }]
        }],
        setConditionVisible: false,
        clientTimespan1: new Date().toLocaleString(),
        clientVersion: '1',
        startTimes: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        endTimes: {
          disabledDate(time) {
            return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
          }
        },
      }
    },
    methods: {
      //买赠的详情
      getBuyProductGetProductInfo() {
        GetBuyProductGetProductInfo.call(this, '?activityId=' + this.id + '&clientVersion=' + this.clientVersion
          + '&clientTimespan=' + this.clientTimespan1)
          .then(
            res => {
              if (res.data.code === 1) {
                this.tableData = [];
                console.log(('=============买赠的详情数据========================================================================='));
                console.log(res.data.data);
                this.ruleForm.name = res.data.data.title;
                this.ruleForm.date1 = res.data.data.begin_time;
                this.ruleForm.date2 = res.data.data.end_time;
                let dataTime = this.DateDiff(res.data.data.begin_time, res.data.data.end_time);      //计算活动天数
                this.ruleForm.num = dataTime+1;
                /*
                * tableData: [{ // 表格数据
          sort: '1',
          pic: 'https://picsum.photos/id/237/200/300',
          condition: '满500减90元 | 100张'
        }],
                * */
                let data = {};
                for (let i = 0; i < res.data.data.products.length; i++) {
                  data = {
                    sort: i + 1,
                    imgUrl: res.data.data.products[i].img_url,
                    articleId: res.data.data.products[i].id,
                    market_price: res.data.data.products[i].market_price,//市场价
                    title: res.data.data.products[i].title,
                    meet_num: res.data.data.products[i].meet_num,
                    num: res.data.data.products[i].num,
                    condition: '买' + res.data.data.products[i].meet_num + '赠' + res.data.data.products[i].num,
                  };
                  this.tableData.push(data);
                  this.tableData1.push(data);

                }
                //this.tableData1=res.data.data.products;
                /*for (let i = 0; i < this.tableData1.length; i++) {
                  this.$set(this.tableData1[i], 'sort', i+1);
                }
                console.log(this.tableData1);*/
                this.activityTotalPage = res.data.data.products.length;
              }
            }
          )
      },

      //买赠活动列表
      getFullBuyGiftActivityList() {
        alert(123)
        GetFullBuyGiftActivityList.call(this, '?key=' + '' + '&begin_time=' + '' + '&end_time='
          + '' + '&status=' + 0 + '&pageSize=' + 10 + '&pageIndex=' + 1
          + '&clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan1)
          .then(
            res => {
              if (res.data.code === 1) {
                console.log(('---------------------买赠的活动列表-----------------------------------------------------'));
                console.log(res.data.data);
              }
            }
          )
      },

      //活动添加啊
      submitForm(formName) {
        console.log(this.ruleForm.date1);
        console.log(this.ruleForm.date2);
        /*this.$refs[formName].validate((valid) => {
          if (valid) {*/
        if (this.ruleForm.date1 === '' || this.ruleForm.date2 === '' || this.ruleForm.date2 == null || this.ruleForm.date1 == null) {
          this.$message.error('活动时间未完成设置');
          return false;
        }
        if (this.tableData1.length === 0) {
          this.$message.error('您还未添加任何活动赠品');
          return false;
        } else {
          //判断是否已经设置买赠条件
          let flag = this.isSetBuyGiftCondition();
          if (flag) {
            this.sureDialogVisible = true;
          } else {
            return flag;
          }
        }
        /*} else {
          // console.log('error submit!!');
          this.$message.error('提交有误!');
          return false;
        }
      });*/
      },

      //确定提交活动添加
      submitActivity() {
        /*console.log(this.tableData1);
        console.log(this.ruleForm);*/
        this.sureDialogVisible = false;
        let type = '';
        if (this.pageType === 'add') {
          type = 0;
        }
        if (this.pageType === 'edit') {
          type = 1;
        }
        this.insertBuyProductGetProduct(type);
      },

      //活动的添加或编辑
      insertBuyProductGetProduct(type) {
        console.log(this.id);
        /*if (this.id === undefined) {
          this.id = 0;
        }*/
        console.log(this.id);
        let products = [];
        let temp = {};
        let t = this.tableData1;
        for (let i = 0; i < t.length; i++) {
          temp = {
            id: t[i].articleId,
            meet_num: parseInt(t[i].meet_num),
            num: parseInt(t[i].num),
          };
          products.push(temp);
        }
        let model = {
          type: type,
          clientVersion: this.clientVersion,
          clientTimespan: this.clientTimespan1,
          buyGift: {
            id: this.id,//活动id
            title: this.ruleForm.name,
            shop_id: this.tableData1[0].shopId,
            begin_time: this.ruleForm.date1,
            end_time: this.ruleForm.date2,
            products: products,//this.tableData1,
          },
        };
        InsertBuyProductGetProduct.call(this, model)
          .then(
            res => {
              console.log('+++++++++++++++++++++++++++++++++++++++++++++++发送数据', model);
              if (res.data.code === 1) {
                /*console.log(type);
                console.log('-----------------------------活动添加编辑返回结果',res.data.data);*/
                this.$message.success('保存成功');
                this.$router.push({name: 'GiftPromotion', query: {activityName: '买几赠几'}});
              } else {
                this.$message.error('保存失败' + res.data.desc);
              }
            }
          )
      },

      //判断是否设置买赠条件
      isSetBuyGiftCondition() {
        let flag = true;
        let t = this.tableData1;
        for (let i = 0; i < t.length; i++) {
          if (t[i].meet_num === '' || t[i].num === '') {
            this.$message.error(t[i].title + '未设置完成赠送条件');
            flag = false;
            return flag;
          }
        }
        return flag;
      },

      //判断是不是数字
      regexNum(row, data) {
        console.log(row + '----' + data);
        // console.log('转化后的数字',parseInt(data.meet_num));
        let numReg = /^[0-9]+$/;
        let numRe = new RegExp(numReg);
        let num = '';
        if (data === 'meet_num'&&row.meet_num!=='') {
          num = Number(row.meet_num);
          if (!numRe.test(num)) {
            this.$message.error('请输入数字');
            row.meet_num = '';
            return false;
          }
        } else if (data === 'num'&&row.num!=='') {
          num = Number(row.num);
          if (!numRe.test(num)) {
            this.$message.error('请输入数字');
            row.num = '';
            return false
          }
        }
      },

      //判断批量设置框
      regexNum1(data,type){
        if (data !== '') {
          let numReg = /^[0-9]+$/;
          let numRe = new RegExp(numReg);
          let num = '';
          num = Number(data);
          if (!numRe.test(num)) {
            this.$message.error('请输入数字');
            if (type === 'mett_num') {
              this.mett_num='';
            }else if (type === 'num') {
              this.num='';
            }
            return false;
          }
        }
      },


      //判断活动名称的长度
      regexExtent(name) {
        let length = name.split('');
        if (length.length < 1 || length.length > 20) {
          this.$message.error('名称长度不合法');
        }
      },

      calcle() {
        this.cancleDialogVisible = true;
      },

      goBack() {
        //this.$router.go(-1);
        this.$router.push({name: 'GiftPromotion', query: {activityName: '买几赠几'}});
      },

      /**
       * 表格全选功能
       * @param val
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(('-------------全选列表----------------------------------------------------------------------------'));
        console.log(this.multipleSelection);
      },

      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        if (this.shopDataVisible === true) {
          this.grantPageSize = val;
          this.getGiftProductList();
        } else {
          this.pageSize = val;
          this.getBuyProductGetProductInfo();
        }
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        if (this.shopDataVisible === true) {
          this.grantCurrentPage = val;
          this.getGiftProductList();
        } else {
          this.currentPage = val;
          this.getBuyProductGetProductInfo();
        }
      },

      /**
       * 跳转到商品详情页
       */
      goDetail(id) {
        // alert(id);
        this.$router.push({name: 'GoodsDetail', query: {goodsId: id}});
      },
      //活动天数
      DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为yyyy-MM-dd格式
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
        return iDays;  //返回相差天数
      },

      //买赠活动的商品列表
      getGiftProductList() {
        let queryData = `?input.pageSize=${this.grantPageSize}&input.pageIndex=${this.grantCurrentPage}&input.clientTimespan=
        ${this.clientTimespan1}&input.clientVersion=${this.clientVersion}`;
        if (this.selectedShopOptions != null && this.selectedShopOptions.length > 0) {
          let index = this.selectedShopOptions.length - 1;
          let cateGroyId = this.selectedShopOptions[index];
          queryData += '&input.categroyId=' + cateGroyId;
        }
        if (this.grantName !== '') {
          queryData += '&input.articleName=' + this.grantName;
        }
        GetGoodsBriefInfoByPage.call(this, queryData)
          .then(
            res => {
              // console.log(res)
              if (res.data.code === 1) {
                console.log(('---------------------赠品列表-------------------------------------------------------------------------'));
                console.log(res.data.data);
                //给返回数据添加属性，用来展示买赠的输入框
                let meet_num = '';
                let num = '';
                for (let i = 0; i < res.data.data.list.length; i++) {
                  //res.data.data.list[i].pics = res.data.data.list[i].pics.split(",")[0];
                  this.$set(res.data.data.list[i], 'meet_num', meet_num);
                  this.$set(res.data.data.list[i], 'num', num);
                  // this.tableData1[i]=Object.assign(this.tableData1[i],{'meet_num':meet_num,'num':num})
                }
                this.shopData = res.data.data.list;
                this.grantTotalPage = res.data.data.totalCount;
                //console.log(this.shopData);
              } else {
                this.$message.error("查询赠品列表失败！");
              }
            })
      },

      //根据条件查询赠品
      searchShop() {
        this.getGiftProductList();
      },

      //选择赠品时查询赠品列表
      selectShop() {
        this.shopDataVisible = true;
        this.grantName = '';
        this.selectedShopOptions = [];
        this.getGiftProductList();
      },

      //选择赠品确定时将数据转移到显示列表
      shopConfirm() {
        this.shopDataVisible = false;
        /*每次点击赠品选择的时候都会将已经选择的活动商品置空
        this.tableData1=this.multipleSelection;*/
        //如果没有选择活动商品就直接将全选的商品传递过来，如果已经有选择了活动商品就往里面添加，如果已经存在该商品就提示
        if (this.tableData1.length < 1) {
          //this.tableData1 = this.multipleSelection;
          //let temp={};
          for (let i = 0; i < this.multipleSelection.length; i++) {
            /* temp={
               articleId:this.multipleSelection[i].articleId,
               imgUrl:this.multipleSelection[i].imgUrl,
               title:this.multipleSelection[i].title,
               meet_num:this.multipleSelection[i].meet_num,
               num:this.multipleSelection[i].num,
             };*/
            this.tableData1.push(this.multipleSelection[i]);
          }
          this.multipleSelection = [];
        } else {
          let mts = this.multipleSelection;
          let td = this.tableData1;
          for (let i = 0; i < mts.length; i++) {
            //如果活动列表中已经存在该商品提示
            let flag = this.isAddShop(td, mts[i].articleId);
            if (!flag) {
              td.push(mts[i]);
              this.$message.success(mts[i].title + '商品添加成功');
            } else {
              this.$message.error(mts[i].title + '该商品已经添加过');
            }
          }
          this.multipleSelection = [];
        }
        this.activityTotalPage = this.tableData1.length;
        console.log('aaaa', this.tableData1)
      },

      //根据赠品列表判断活动列表中是否已经添加了该赠品
      isAddShop(arr, id) {
        //debugger;
        let flag = false;//默认不存在
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].articleId === id) {
            //如果存在了这个赠品
            flag = true;
            break;
          }
        }
        return flag;
      },

      //移除单个活动
      removeActivity(tableData1) {
        let index = this.tableData1.indexOf(tableData1);
        this.tableData1.splice(index, 1);
      },

      //批量移除方法
      removeActivityAll() {
        let temp = [];
        this.tableData1.forEach(m => {
          if (this.multipleSelection.indexOf(m) === -1)
            temp.push(m);
        });
        this.tableData1 = temp;
        this.multipleSelection = [];
      },

      //批量设置买赠condition
      setConditionAll() {
        //console.log('aaaaaaaaaaaaaaa',this.multipleSelection);
        this.setConditionVisible = false;
        //如果点击确定的时候一个都没有选，那就全部置空
        if (this.multipleSelection.length === 0) {
          this.$message.error('请选择商品');
          /*this.tableData1.forEach(t => {
            t.meet_num = '';
            t.num = '';
          });*/
          return;
        }
        //如果有选择就设置指定项
        this.tableData1.forEach(t => {
          if (this.multipleSelection.indexOf(t) !== -1) {
            t.meet_num = this.mett_num;
            t.num = this.num;
          }
        })
      },

      //获取商品的分类列表
      getCategory() {
        getCategory.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan1)
          .then(
            res => {
              if (res.data.code === 1) {
                console.log('商品分类栏目', res.data.data);
                let _classList = res.data.data;
                if (_classList != null) {
                  this.shopOptions = _classList;
                } else {
                  this.$message.error(res.data.desc);
                }
              }
            }
          )
      },

      //添加时默认时间方法
      startMonth() {
        this.endTimes = {
          disabledDate: (time) => {
            if (this.ruleForm.date1 === '' || this.ruleForm.date1 === null) {
              return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
            } else {
              return time.getTime() < new Date(this.ruleForm.date1).getTime() + (86400000 * 6) || time.getTime() > new Date(this.ruleForm.date1).getTime() + (86400000 * 29);
            }
          }
        };
        this.inputText();
      },
      endMonth() {
        this.startTimes = {
          disabledDate: (time) => {
            if (this.ruleForm.date2 === '' || this.ruleForm.date2 === null) {
              return time.getTime() < Date.now();
            } else {
              return time.getTime() > new Date(this.ruleForm.date2).getTime() - (86400000 * 6) || time.getTime() < Date.now() || time.getTime() < new Date(this.ruleForm.date2).getTime() - (86400000 * 30);
            }
          }
        };
        this.inputText();
      },
      inputText() {
        let day = '';
        if (this.ruleForm.date1 !== '' && this.ruleForm.date2 !== '' && this.ruleForm.date1 !== null && this.ruleForm.date2 !== null) {
          day = (new Date(this.ruleForm.date2).getTime() - new Date(this.ruleForm.date1).getTime()) / 86400000 + 1;
        }
        this.ruleForm.num = Math.floor(day);
      },
    },

    watch: {
      'ruleForm.date1'(newValue, oldValue) {
        /*console.log(newValue);
        console.log(newValue.toLocaleDateString());
        console.log(oldValue);*/
        this.ruleForm.date1 = newValue.toLocaleDateString() + ' 00:00:00';
        // this.ruleForm.date1=newValue +' 00:00:00';
        /* console.log(newValue, "%%%%%%%%%%%%%%%%%");
         console.log(oldValue, "%%%%%%%%%%%%%%%%%");*/
      },
      'ruleForm.date2'(newValue, oldValue) {
        //console.log(newValue);
        //console.log(oldValue);
        this.ruleForm.date2 = newValue.toLocaleDateString() + ' 23:59:59';
      },
    },

    created() {
      if (this.$route.query.id === undefined) {
        this.id = 0;
        console.log("-----")
      } else {
        this.id = this.$route.query.id;
      }
      this.getBuyProductGetProductInfo();
      //this.getFullBuyGiftActivityList();
      this.getCategory();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";

</style>
