<template>
  <div class="addDiscount_box">

    <div class="title_box">
      <ul>
        <li class="active" v-if="pageName === 0">
          <template v-if="pageType === 'add'">添加折扣</template>
          <template v-if="pageType === 'edit'">编辑折扣</template>
          <template v-if="pageType === 'detail'">查看折扣</template>
        </li>
        <li class="active" v-if="pageName === 1">
          <template v-if="pageType === 'add'">添加满折</template>
          <template v-if="pageType === 'edit'">编辑满折</template>
          <template v-if="pageType === 'detail'">查看满折</template>
        </li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="title" label-width="100px">
        <el-input style="width: 400px;" v-model="ruleForm.title"
                  :disabled="pageType === 'detail' ? true : false"></el-input>
        <span class="add_font">（限20字）</span>
      </el-form-item>

      <el-form-item label="活动时间" required label-width="100px">
        <div class="add_line">
          <span>
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                :disabled="pageType === 'detail' ? true : false"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="startMonthOption" @change="selectStartMonth"
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
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="endMonthOption" @change="selectEndMonth"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span">共</span>
          <el-input style="width: 100px;" disabled v-model="ruleForm.dayNum"></el-input>
          <span class="add_span">天</span>
          <i>（活动时间7-30天，从开始日00:00:00生效，结束日23:59:59失效）</i>
        </div>
      </el-form-item>

      <el-form-item label="活动规则" label-width="100px" v-if="pageName === 1">
        <div class="add_prepend">
          <el-input style="width: 260px;" v-if="pageType !== 'detail'" type="number"
                    v-model.number="fullDiscount.meetPrice">
            <template slot="prepend">购物满</template>
            <template slot="append">元</template>
          </el-input>
          <el-input style="width: 260px; margin-left: -5px;" v-if="pageType !== 'detail'" type="number"
                    v-model.number="fullDiscount.discount" @blur="m1">
            <template slot="prepend">打</template>
            <template slot="append">折</template>
          </el-input>
          <span v-if="pageType !== 'detail'" @click="addfullDiscount">+ 添加</span>
          <i>（满金额最高1000元，折扣最高9.9折）</i>
        </div>

        <div class="add_tag">
          <el-tag
            v-for="(tag,index) in tags"
            :key="index"
            :closable="pageType === 'detail' ? false : true"
            @close="fullDiscountClose(index)"
            :type="tag.type">
            {{tag.name}}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="每人限购" label-width="100px" v-if="pageName === 0">
        <el-input style="width: 150px;" v-model.number="ruleForm.limitNum"
                  :disabled="pageType === 'detail' ? true : false"></el-input>
        件
        <span class="add_font">（超过限购数量按原价计算，同商品多规格不同价格时，买家购买时限购数量优先计算价格较高规格）</span>
      </el-form-item>

      <!--<el-form-item label="活动折扣" label-width="100px" v-if="pageName === 0">
        <el-input style="width: 270px;" type="number" v-model.number="ruleForm.discount"
                  :disabled="pageType === 'detail' ? true : false" @blur="m2"></el-input>
        <span class="add_font">（0.1~9.9折）</span>
      </el-form-item>-->

      <el-form-item label="活动范围" label-width="100px">
        <div>
          <el-button :type="isAllProduct === 1 ? 'primary' : 'default'" @click="getGoods(1)"
                     :disabled="pageType === 'detail' ? true : false">全店商品
          </el-button>
          <el-button :type="isAllProduct === 2 ? 'primary' : 'default'" @click="getGoods(2)"
                     :disabled="pageType === 'detail' ? true : false">部分商品
          </el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="add_top" v-if="pageType !== 'detail'">
          <el-button type="primary" size="small" v-if="isAllProduct === 2" @click="toAddGoods">+ 继续添加</el-button>
          <el-button type="primary" size="small" v-if="pageName === 0" @click="setDiscount">批量设置折扣</el-button>
          <el-button type="danger" size="small" v-if="isAllProduct === 2" @click="delBatchGoods">批量移除</el-button>
        </div>

        <!--添加/编辑时的表格 start-->
        <div class="table table1" style="height: 450px; overflow: auto;" v-if="pageType !== 'detail'">
          <div style="margin-bottom: 10px;" class="add_tips_p" v-if="isAllProduct === 1">
            选择全店商品时，活动结束前发布的新商品，将会默认加入优惠活动。
          </div>
          <el-table
            ref="multipleTableSelected"
            :data="selectGoods"
            border
            tooltip-effect="dark"
            style="width: 100%;"
            @selection-change="handleSelectionChangeSelected">
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>

            <el-table-column
              label="商品图片"
              align="center">
              <template slot-scope="scope">
                <viewer :images="[scope.row.imgUrl]">
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
                    <a href="javascript: void(0);" @click="goDetail(scope.row.articleId)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="销售价(元)">
              <template slot-scope="scope">
                <div v-if="scope.row.minPrice === scope.row.maxPrice">￥{{scope.row.sellPrice}}</div>
                <div v-else>￥{{scope.row.minPrice}} - {{scope.row.maxPrice}}</div>
              </template>
            </el-table-column>

            <el-table-column v-if="pageName === 0"
                             align="center"
                             label="折扣">
              <template slot-scope="scope">
                <div>
                  <el-input type="number" :disabled="isAllProduct === 1 ? true : false"
                            v-model.number="selectGoods[scope.$index].discount" @blur="m3(scope.$index)"></el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-if="pageName === 0"
                             align="center"
                             label="折扣后价格">
              <template slot-scope="scope">
                <!--<div v-if="scope.row.minPrice === scope.row.maxPrice">￥{{ruleForm.discount && scope.row.sellPrice * ruleForm.discount * 0.1}}</div>-->
                <!--<div v-else>￥</div>-->
                <div v-if="scope.row.minPrice === scope.row.maxPrice">
                  <div v-if="selectGoods[scope.$index].discount">{{(selectGoods[scope.$index]['sellPrice'] *
                    selectGoods[scope.$index].discount * 0.1).toFixed(2)}}
                  </div>
                </div>
                <div v-else>
                  <div v-if="selectGoods[scope.$index].discount">{{(scope.row.minPrice *
                    selectGoods[scope.$index].discount * 0.1).toFixed(2)}} - {{(scope.row.maxPrice *
                    selectGoods[scope.$index].discount * 0.1).toFixed(2)}}
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-if="pageName === 1"
                             align="center"
                             label="库存(件)">
              <template slot-scope="scope">
                <div>{{scope.row.stockQuantity}}</div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="delGoods(scope.row.articleId)" v-if="isAllProduct === 2">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--添加/编辑时的表格 end-->

        <!--详情的表格 start-->
        <div class="table table1" style="height: 450px; overflow: auto;" v-if="pageType === 'detail'">
          <div style="margin-bottom: 10px;" class="add_tips_p" v-if="isAllProduct === 1">
            选择全店商品时，活动结束前发布的新商品，将会默认加入优惠活动。
          </div>
          <el-table
            :data="selectGoods"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="num"
              type="index"
              label="序号"
              align="center"
              width="55">
            </el-table-column>

            <el-table-column
              label="商品图片"
              align="center">
              <template slot-scope="scope">
                <viewer :images="[scope.row.imgUrl]">
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
                    <a href="javascript: void(0);" @click="goDetail(scope.row.articleId)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="销售价(元)">
              <template slot-scope="scope">
                <div v-if="scope.row.minPrice === scope.row.maxPrice">￥{{scope.row.sellPrice}}</div>
                <div v-else>￥{{scope.row.minPrice}} - {{scope.row.maxPrice}}</div>
              </template>
            </el-table-column>

            <el-table-column v-if="pageName === 0"
                             align="center"
                             label="折扣">
              <template slot-scope="scope">
                <div>{{selectGoods[scope.$index].discount}}</div>
              </template>
            </el-table-column>

            <el-table-column v-if="pageName === 0"
                             align="center"
                             label="折扣后价格">
              <template slot-scope="scope">
                <div v-if="scope.row.minPrice === scope.row.maxPrice">
                  <div v-if="selectGoods[scope.$index].discount">{{(selectGoods[scope.$index]['sellPrice'] *
                    selectGoods[scope.$index].discount * 0.1).toFixed(2)}}
                  </div>
                </div>
                <div v-else>
                  <div v-if="selectGoods[scope.$index].discount">{{(scope.row.minPrice *
                    selectGoods[scope.$index].discount * 0.1).toFixed(2)}} - {{(scope.row.maxPrice *
                    selectGoods[scope.$index].discount * 0.1).toFixed(2)}}
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-if="pageName === 1"
                             align="center"
                             label="库存(件)">
              <template slot-scope="scope">
                <div>{{scope.row.stockQuantity}}</div>
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
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>-->
        <!--页码结束-->
      </el-form-item>

      <el-form-item label-width="80px" style="margin-top: 60px;">
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="pageType !== 'detail'">确 定</el-button>
        <el-button v-if="pageType !== 'detail'" @click="calcle">返 回</el-button>
        <el-button v-if="pageType === 'detail'" @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>

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
            <el-input placeholder="请输入商品名称" v-model="goodsName"></el-input>
          </span>

          <span>
            <el-button type="primary" @click="searchGoods">搜索商品</el-button>
          </span>

          <span>
            <el-button type="primary" @click="saveSelectGoods">确定</el-button>
          </span>
        </div>
  <!--<div>
    <span v-for="item in multipleSelection">{{item.title.substring(0,5)}} &#45;&#45; </span>
    <br>
    <span v-for="item in multipleAll">{{item.title.substring(0,5)}} && </span>
  </div>-->
        <!--表格 start-->
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="shopGoodsTable.list"
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
              width="80">
              <template slot-scope="scope">
                <viewer :images="[scope.row.imgUrl]">
                  <img class="pic" :src="scope.row.imgUrl" alt="" title="点击查看大图">
                  <!--<img class="vue-lazyload pic" v-lazy="scope.row.imgUrl" alt="" title="点击查看大图">-->
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
                    <a href="javascript: void(0);" @click="goDetail(scope.row.articleId)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="原价(元)">
              <template slot-scope="scope">
                <div v-if="scope.row.minPrice === scope.row.maxPrice">￥{{scope.row.sellPrice}}</div>
                <div v-else>￥{{scope.row.minPrice}} - {{scope.row.maxPrice}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--表格 end-->

        <!--页码开始-->
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="shopGoodsPageIndex"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="shopGoodsPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="shopGoodsTable.totalCount">
          </el-pagination>
        </div>
        <!--页码结束-->

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSelectGoods">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="sureDialogVisible"
      width="500px">
      <div>
        <p>活动将在开始时间自动发布，发布后将不能修改，确认添加？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sureDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
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

    <!--批量设置折扣弹框 start-->
    <el-dialog
      title="批量设置折扣"
      :visible.sync="setDiscountVisible"
      width="500px">
      <div class="discount_dialog" style="text-align: center;">
        <span>折扣 &nbsp;&nbsp;</span>
        <span>
          <el-input placeholder="请输入折扣力度" style="width: 350px;" type="number" v-model.number="ruleForm.discount" @blur="m2"></el-input>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDiscountVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDiscountSave">确 定</el-button>
      </span>
    </el-dialog>
    <!--批量设置折扣弹框 end-->
  </div>
</template>

<script>
  import goodsBriefInfoByPage from '../../../../../src/api/ShopActivity/goodsBriefInfoByPage.js'
  import addDiscount from '../../../../../src/api/ShopActivity/addDiscount.js'
  import addMeetDiscount from '../../../../../src/api/ShopActivity/addMeetDiscount.js'
  import getDiscountAcivity from '../../../../../src/api/ShopActivity/getDiscountAcivity.js'
  import getMeetDiscountAcivity from '../../../../../src/api/ShopActivity/getMeetDiscountAcivity.js'
  import getCategory from '../../../../../src/api/ShopActivity/getCategory.js'
  import goodsClassList from '../../../../../src/api/goods/goodsClassList'

  export default {
    mounted() {
      // let nowDate = new Date();
      if (this.pageType !== 'detail') {
        this.goodsBriefInfoByPage();
        this.changePage = false;
        this.goodsClassList();
      }
      if (this.pageId !== undefined) {
        if (this.pageName === 0) {
          //折扣
          getDiscountAcivity.call(this, `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&activityId=${this.pageId}`).then(res => {
            if (res.data.code === 1) {
              //成功
              let _data = res.data.data;
              let _goodsList = _data.goodsList;
              //组装商品list
              _goodsList.map(item => {
                item.articleId = item.article_id;
                //img_url market_price maxmarket_price maxsell_price stock_quantity sell_price
                item.imgUrl = item.img_url;
                item.marketPrice = item.market_price;
                item.maxmarketPrice = item.maxmarket_price;
                item.maxsellPrice = item.maxsell_price;
                item.stockQuantity = item.stock_quantity;
                item.sellPrice = item.sell_price;
              });
              this.selectGoods = _goodsList;
              let _discountInfo = _data.discountInfo;
              if (_discountInfo != null && _discountInfo != undefined && _discountInfo != '') {
                this.ruleForm.discount = parseFloat(_data.discountInfo.substring(0, _discountInfo.length - 1));
              }
              this.isAllProduct = _data.isAllProduct;
              if (this.isAllProduct === 1) {
                this.getGoods(1);
              }
              this.ruleForm.title = _data.title;
              let _beginTime = _data.beginTime;
              this.ruleForm.date1 = _beginTime.split(" ")[0];
              let _endTime = _data.endTime;
              this.ruleForm.date2 = _endTime.split(" ")[0];
              this.ruleForm.limitNum = _data.limitInfo.limitNum;
              //计算时间
              this.calculatingTime();
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
          });
        } else if (this.pageName === 1) {
          //满折
          getMeetDiscountAcivity.call(this, `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&activityId=${this.pageId}`).then(res => {
            if (res.data.code === 1) {
              //成功
              let _data = res.data.data;
              let _goodsList = _data.goodsList;
              //组装商品list
              _goodsList.map(item => {
                item.articleId = item.article_id;
                //img_url market_price maxmarket_price maxsell_price stock_quantity sell_price
                item.imgUrl = item.img_url;
                item.marketPrice = item.market_price;
                item.maxmarketPrice = item.maxmarket_price;
                item.maxsellPrice = item.maxsell_price;
                item.stockQuantity = item.stock_quantity;
                item.sellPrice = item.sell_price;
              });
              this.selectGoods = _goodsList;
              this.isAllProduct = _data.isAllProduct;
              this.ruleForm.title = _data.title;
              let _beginTime = _data.beginTime;
              this.ruleForm.date1 = _beginTime.split(" ")[0];
              let _endTime = _data.endTime;
              this.ruleForm.date2 = _endTime.split(" ")[0];
              let _tags = new Array();
              _data.meetDiscount.map(item => {
                _tags.push({
                  name: `满${item.meetPrice}打${item.discount}折`,
                  type: '',
                  meetPrice: item.meetPrice,
                  discount: item.discount
                })
              });
              this.tags = _tags;
              //计算时间
              this.calculatingTime();
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
          });
        }
      }
    },
    data() {
      return {
        pageName: parseInt(this.$route.query.name), // 0是折扣，1是满折
        pageType: this.$route.query.type,
        pageId: this.$route.query.id,
        sureDialogVisible: false, // 点击确定的提示框
        cancleDialogVisible: false, // 点击取消的提示框
        ruleForm: {
          title: '',
          date1: '',
          date2: '',
          dayNum: '',
          limitNum: '',
          discount: ''
        },
        rules: {
          title: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          date1: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ]
        },
        tags: [
          /*{name: '买100返5块 | 100张', type: ''}*/
        ],//满折列表json
        // fullDiscountListJson: [{}], //满折列表json
        fullDiscount: {
          discount: '',
          meetPrice: ''
        },
        multipleSelection: [], // 表格全选参数
        multipleAll: [],  //上面选中商品 集合
        shopDataVisible: false,
        shopOptions: [], //搜索条件 商家自定义分类
        goodsName: '', //商品搜索 名称
        selectedShopOptions: [], //商家选择的分类
        shopProps: {
          value: 'id',
          label: 'title',
          children: 'cateogryChildren'
        },//分类级联  属性设置
        shopGoodsTable: {},//选择商品列表
        multipleSelectionSelected: [], //已选择商品  多选按钮
        changePage: false,
        shopGoodsPageSize: 10,
        shopGoodsPageIndex: 1,
        selectGoods: [],//商家选择的商品
        totalCount: 9999,//记录有多少商品
        isAllProduct: 2,// 1全部商品  2部分商品
        startMonthOption: {
          disabledDate(time) {
            // 一天是24*60*60*1000 = 86400000 = 8.64e7
            return time.getTime() < Date.now();
          }
        },
        endMonthOption: {
          disabledDate(time) {
            return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
          }
        },
        setDiscountVisible: false, // 批量设置折扣
      }
    },
    methods: {
      /**
       * 批量设置折扣
       */
      setDiscount() {
        this.setDiscountVisible = true;
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sureDialogVisible = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      save() {
        this.sureDialogVisible = false;
        // this.$message('save');
        let _input = {
          clientVersion: '1.0.0',
          clientTimespan: '2019-05-16 11:13:00'
        };
        let _successMsg = '活动修改成功！';
        if (this.pageType === 'edit') {
          //修改
          _input.type = 1;
        } else if (this.pageType === 'add') {
          //新增
          _input.type = 0;
          _successMsg = '优惠活动已创建成功，订单正在向您靠近！';
        }
        if (this.selectGoods.length <= 0) {
          this.$message.warning('您还没有选中商品!');
          return;
        }
        // 0是折扣，1是满折
        if (this.pageName === 0) {
          //折扣
          let _goodsListInfo = new Array();
          let _discountAll = false;
          this.selectGoods.map(good => {
            _goodsListInfo.push({
              articleId: good.articleId,
              discount: good.discount
            });
            if (good.discount === undefined || good.discount === null || good.discount === '') {
              _discountAll = true;
            }
          });
          if (_discountAll) {
            this.$message.warning('有商品没有设置折扣,请设置后再提交');
            return;
          }
          let _discountactivity = {
            goodsListInfo: _goodsListInfo,
            title: this.ruleForm.title,
            beginTime: this.ruleForm.date1 + ' 00:00:00',
            endTime: this.ruleForm.date2 + ' 23:59:59',
            isAllProduct: this.isAllProduct,
            shopId: JSON.parse(sessionStorage.getItem('tokenInfo')).shopId,
            id: this.pageId
          };
          if (this.ruleForm.limitNum !== '') {
            _discountactivity.limitInfo = {
              limitNum: this.ruleForm.limitNum
            };
          }
          if (this.isAllProduct === 1) {
            _discountactivity.discount = this.selectGoods[0].discount;
          }
          _input.discountactivity = _discountactivity;
          // console.log('折扣对象: ',_input);
          //保存折扣
          addDiscount.call(this, _input).then(res => {
            if (res.data.code === 1) {
              //成功
              this.$message.success(_successMsg);
              this.$router.push({
                name: 'GoodsDiscount',
                params: {name: this.pageName}
              });
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
          });
        } else if (this.pageName === 1) {
          //满折
          let _goodsListInfo = new Array();
          this.selectGoods.map(good => {
            _goodsListInfo.push({
              articleId: good.articleId
            })
          });
          let _fullDiscountListJson = new Array();
          if (this.tags.length === 0) {
            this.$message.warning('请设置至少一个活动规则！');
            return;
          }
          this.tags.map(item => {
            _fullDiscountListJson.push({
              meetPrice: item.meetPrice,
              discount: item.discount
            })
          });
          let _meetDiscountModel = {
            goodsListInfo: _goodsListInfo,
            meetDiscount: _fullDiscountListJson,
            title: this.ruleForm.title,
            beginTime: this.ruleForm.date1 + ' 00:00:00',
            endTime: this.ruleForm.date2 + ' 23:59:59',
            isAllProduct: this.isAllProduct,
            shopId: JSON.parse(sessionStorage.getItem('tokenInfo')).shopId,
            id: this.pageId
          };
          _input.meetdiscount = _meetDiscountModel;
          // console.log('满折对象: ',_input);
          addMeetDiscount.call(this, _input).then(res => {
            if (res.data.code === 1) {
              //成功
              this.$message.success(_successMsg);
              this.$router.push({
                name: 'GoodsDiscount',
                params: {name: this.pageName}
              });
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
          });
        }
      },
      calcle() {
        this.cancleDialogVisible = true;
      },

      goBack() {
        this.$router.go(-1);
      },

      /**
       * 表格全选功能   选择商品的时候
       * @param val
       */
      handleSelectionChange(val) {
        // console.log(this.changePage, val, '111111111111111', this.multipleAll, this.multipleSelection);
        if (this.changePage && this.multipleSelection.length > 0) {
          this.multipleSelection = val;
          //手动触发
          this.changePage = false;
        } else {
          //手动触发
          this.changePage = false;
          let _multipleAll = JSON.parse(JSON.stringify(this.multipleAll));
          this.multipleSelection.map(item => {
            let _index = -1;
            _multipleAll.map((it, index) => {
              if (item.articleId === it.articleId) {
                _index = index;
              }
            });
            if (_index > -1) {
              _multipleAll.splice(_index, 1);
            }
          });
          val.map(item => {
            let _flag = true;
            _multipleAll.map(ii => {
              if (item.articleId === ii.articleId) {
                _flag = false;
              }
            });
            if (_flag) {
              _multipleAll.push(item);
            }
          });
          this.multipleAll = _multipleAll;
          this.multipleSelection = val;
        }
      },
      /**
       * 下面已选商品  多选
       */
      handleSelectionChangeSelected(val) {
        this.multipleSelectionSelected = val;
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

      handleSizeChange1(val) {
        this.shopGoodsPageSize = val;
        this.shopGoodsPageIndex = 1;
        this.goodsBriefInfoByPage();
      },
      handleCurrentChange1(val) {
        this.shopGoodsPageIndex = val;
        this.goodsBriefInfoByPage();
      },

      /**
       * 跳转到商品详情页
       */
      goDetail(id) {
        this.$router.push({name: 'GoodsDetail',query: {
            goodsId: id
          }});
      },
      selectStartMonth() {
        this.endMonthOption = {
          disabledDate: (time) => {
            if (this.ruleForm.date1 === '' || this.ruleForm.date1 === null) {
              return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
            } else {
              return time.getTime() < new Date(this.ruleForm.date1).getTime() + (86400000 * 5) || time.getTime() > new Date(this.ruleForm.date1).getTime() + (86400000 * 29);
            }
          }
        };
        this.calculatingTime();
      },
      selectEndMonth() {
        this.startMonthOption = {
          disabledDate: (time) => {
            if (this.ruleForm.date2 === '' || this.ruleForm.date2 === null) {
              return time.getTime() < Date.now();
            } else {
              return time.getTime() > new Date(this.ruleForm.date2).getTime() - (86400000 * 6) || time.getTime() < Date.now() || time.getTime() < new Date(this.ruleForm.date2).getTime() - (86400000 * 30);
            }
          }
        };
        this.calculatingTime();
      },
      calculatingTime() {
        let day = '';
        if (this.ruleForm.date1 !== '' && this.ruleForm.date2 !== '' && this.ruleForm.date1 !== null && this.ruleForm.date2 !== null) {
          day = (new Date(this.ruleForm.date2).getTime() - new Date(this.ruleForm.date1).getTime()) / 86400000 + 1;
        }
        this.ruleForm.dayNum = day;
      },
      // 满折列表 添加
      addfullDiscount() {
        if (this.fullDiscount.discount === '' || this.fullDiscount.meetPrice === '') {
          this.$message.warning('金额或者折扣不能为空！');
        }else if (this.fullDiscount.discount < 0.1 || this.fullDiscount.discount > 9.9) {
          this.$message.warning('折扣必须在0.1~9.9之间！');
        }else if (this.fullDiscount.meetPrice <= 0 || this.fullDiscount.meetPrice > 1000) {
          this.$message.warning('满金额大于0，最高1000元！');
        }else {
          this.tags.push({
            name: `满${this.fullDiscount.meetPrice}打${this.fullDiscount.discount}折`,
            type: '',
            meetPrice: this.fullDiscount.meetPrice,
            discount: this.fullDiscount.discount
          });
          this.fullDiscount.discount = '';
          this.fullDiscount.meetPrice = '';
        }
      },
      fullDiscountClose(index) {
        this.tags.splice(index, 1);
      },
      //满折列表折扣  1位小数  四舍五入
      m1() {
        let _discunt = this.fullDiscount.discount;
        if (_discunt >= 0.1 && _discunt <= 9.9) {
          _discunt = parseFloat(_discunt.toFixed(1));
        } else {
          _discunt = '';
          this.$message.warning('请输入0.1~9.9之间的数字');
        }
        this.fullDiscount.discount = _discunt;
      },
      //单个折扣
      m2() {
        let _discunt = this.ruleForm.discount;
        // console.log(index,_discunt,9.56.toFixed(1));
        if (_discunt >= 0.1 && _discunt <= 9.9) {
          _discunt = parseFloat(_discunt.toFixed(1));
        } else {
          _discunt = '';
          this.$message.warning('请输入0.1~9.9之间的数字');
        }
        this.ruleForm.discount = _discunt;
      },
      m3(index) {
        let _discunt = this.selectGoods[index].discount;
        if (_discunt !== undefined && _discunt >= 0.1 && _discunt <= 9.9) {
          _discunt = parseFloat(_discunt.toFixed(1));
        } else {
          _discunt = undefined;
          this.$message.warning('请输入0.1~9.9之间的数字');
        }
        if (_discunt === undefined) {
          //删除该属性
          delete this.selectGoods[index].discount;
        } else {
          this.selectGoods[index].discount = _discunt;
        }
        this.selectGoods = [...this.selectGoods];
      },
      //获取商品
      goodsBriefInfoByPage() {
        //重新渲染  不改变选中
        this.changePage = true;
        let _path = `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&pageIndex=${this.shopGoodsPageIndex}&pageSize=${this.shopGoodsPageSize}`;
        if (this.goodsName !== '' && this.goodsName !== null) {
          _path += `&articleName=${this.goodsName}`;
        }
        if (this.selectedShopOptions !== null && this.selectedShopOptions.length > 0) {
          let _index = this.selectedShopOptions.length - 1;
          _path += `&categroyId=${this.selectedShopOptions[_index]}`;
        }
        goodsBriefInfoByPage.call(this, _path).then(res => {
          if (res.data.code === 1) {
            //成功
            if (res.data.data != null) {
              this.shopGoodsTable = res.data.data;
              this.totalCount = res.data.data.totalCount;
            }
            let _indexList = new Array();
            this.multipleAll.map(selectGood => {
              this.shopGoodsTable.list.map((room, index) => {
                if (selectGood.articleId === room.articleId) {
                  _indexList.push(index);
                }
              })
            });
            //确定 触发回显
            this.$nextTick(() => {
              this.toggleSelection(_indexList);
            });
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        })
      },
      //获取分类
      goodsClassList() {
        getCategory.call(this, '?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00').then(res => {
          if (res.data.code === 1) {
            //成功
            let _classList = res.data.data;
            if (_classList != null) {
              this.shopOptions = _classList;
            }
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        })
      },
      searchGoods() {
        this.shopGoodsPageIndex = 1;
        this.goodsBriefInfoByPage();
      },
      saveSelectGoods() {
        this.shopDataVisible = false;
        let _selectGoods = this.multipleAll;
        //删除没勾选的
        _selectGoods.map(item =>{
          let _discount = undefined;
          this.selectGoods.map(it =>{
            if (item.articleId === it.articleId) {
              _discount = it.discount;
            }
          });
          if (_discount !== undefined){
            item.discount = _discount;
          }
        });
        this.selectGoods = _selectGoods;
      },
      toAddGoods() {
        this.shopDataVisible = true;
        this.multipleAll = JSON.parse(JSON.stringify(this.selectGoods));
        let _indexList = new Array();
        this.selectGoods.map(selectGood => {
          this.shopGoodsTable.list.map((room, index) => {
            if (selectGood.articleId === room.articleId) {
              _indexList.push(index);
            }
          })
        });
        //确定 触发回显
        this.$nextTick(() => {
          this.toggleSelection(_indexList);
        })
        //
      },
      getGoods(isAllProduct) {
        this.isAllProduct = isAllProduct;
        if (isAllProduct === 2) {
          //全部转部分时候 清空选中的
          this.selectGoods = [];
        } else if (isAllProduct === 1) {
          //全部商品
          let _path = `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&pageIndex=1&pageSize=${this.totalCount}`;
          goodsBriefInfoByPage.call(this, _path).then(res => {
            if (res.data.code === 1) {
              //成功
              if (res.data.data != null) {
                this.selectGoods = res.data.data.list;
                if (this.ruleForm.discount !== '') {
                  this.selectGoods.map(item => {
                    item.discount = this.ruleForm.discount;
                  });
                  this.selectGoods = [...this.selectGoods]
                  this.ruleForm.discount = '';
                }
              }
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
          })
        }
      },
      //回显勾选
      toggleSelection(rows) {
        if (this.$refs.multipleTable){
          this.$refs.multipleTable.clearSelection();
        }
        rows.forEach(index => {
          this.$refs.multipleTable.toggleRowSelection(this.shopGoodsTable.list[index],true);
        });
      },
      //删除选择的商品
      delGoods(id) {
        this.$confirm('确定删除该商品？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectGoods.map((good, index) => {
            if (good.articleId === id) {
              this.selectGoods.splice(index, 1);
            }
          })
        }).catch(() => {
        });
      },
      delBatchGoods() {
        if (this.multipleSelectionSelected.length === 0) {
          this.$message.warning('您还没选择要移除的商品!');
          return;
        }
        this.$confirm('确定删除已选择商品？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleSelectionSelected.map(item => {
            this.selectGoods.map((good, index) => {
              if (good.articleId === item.articleId) {
                this.selectGoods.splice(index, 1);
              }
            })
          })
        }).catch(() => {

        });
      },
      //批量设置折扣保存
      setDiscountSave() {
        this.setDiscountVisible = false;
        let _selectGoods = JSON.parse(JSON.stringify(this.selectGoods));
        _selectGoods.map(item => {
          item.discount = this.ruleForm.discount;
        });
        this.selectGoods = _selectGoods;
        this.selectGoods = [...this.selectGoods];
        this.ruleForm.discount = '';
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
