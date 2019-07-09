<template>
  <div class="addDiscount_box">
    <div class="title_box">
      <ul>
        <li class="active"><span v-if="pageType === 'add'">添加</span><span v-if="pageType === 'edit'">编辑</span><span v-if="pageType === 'detail'">查看</span>满赠活动</li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="title" label-width="100px">
        <el-input style="width: 400px;" :disabled="pageType === 'detail' ? true : false" v-model="ruleForm.title"></el-input>
        <span class="add_font">（限20字）</span>
      </el-form-item>

      <el-form-item label="活动时间" required label-width="100px">
        <div class="add_line">
          <span>
            <el-form-item prop="begin_time" >
              <el-date-picker
                v-model="ruleForm.begin_time"
                :disabled="pageType === 'detail' ? true : false"
                :picker-options="startTimes" @change="startMonth"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span"> 至 </span>
          <span>
            <el-form-item prop="end_time">
              <el-date-picker
                v-model="ruleForm.end_time"
                :disabled="pageType === 'detail' ? true : false"
                :picker-options="endTimes" @change="endMonth"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span">共</span>
          <el-input style="width: 100px;" v-model="numDay" :disabled="pageType === 'detail' ? true : (pageType==='add' ? true : (pageType==='edit'? true:false))" @blur="DateDiff(ruleForm.begin_time,ruleForm.end_time)"></el-input>
          <span class="add_span">天</span>
          <i>（活动时间7-30天，从开始日00:00:00生效，结束日23:59:59失效）</i>
        </div>
      </el-form-item>

      <el-form-item label="活动规则" label-width="100px">
        <div class="add_prepend">
          <el-input style="width: 260px;" v-model="ruleForm.meet_price" placeholder="输入金额" :disabled="pageType === 'detail' ? true : false">
            <template slot="prepend">购物满</template>
            <template slot="append">元</template>
          </el-input>
          <i style="margin: 0 5px;">可选择赠品</i>
          <el-input v-model="ruleForm.optional_num" style="width: 160px;" :disabled="pageType === 'detail' ? true : false">
            <template slot="append">件</template>
          </el-input>
          <i>（满赠额度最高100元）</i>
        </div>
      </el-form-item>

      <el-form-item label="赠品设置" label-width="100px" v-if="pageType !== 'detail'">
        <div>
          <el-button type="primary" size="small" @click="shopDataVisible = true,initTableDataByGoods()">+ 选择赠品</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="add_top" v-if="pageType !== 'detail'">
          <el-button type="danger" size="small" @click="delBatchGoods()">批量移除</el-button>
        </div>

        <!--添加/编辑的表格 start-->
        <div class="table table1" v-if="pageType !== 'detail'">
          <el-table
            ref="multipleTable"
            :data="editortableData"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeSelected">
            <el-table-column
              type="selection"
              align="center"
              width="80">
            </el-table-column>

            <el-table-column
              label="商品图片"
              align="center">
              <template slot-scope="scope">
                <viewer :images="[scope.row.imgUrl || scope.row.pics]">
                  <img class="pic" :src="scope.row.imgUrl || scope.row.pics.split(',')[0]" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center">
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <span>{{scope.row.title}}</span>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="市场价格(元)">
              <template slot-scope="scope">
                <div>{{scope.row.marketPrice || scope.row.price}}</div>
              </template>
            </el-table-column>

            <!-- <el-table-column
              align="center"
              label="库存(件)">
              <template slot-scope="scope">
                <div>100</div>
              </template>
            </el-table-column> -->

            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteVisible = true ,delGoods(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--添加/编辑的表格 end-->

        <!--查看详情的表格 start-->
        <div class="table table1" v-if="pageType === 'detail'">
          <el-table
            :data="dttailtableData"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="sort"
              label="序号"
              align="center"
              width="80">
              <template slot-scope="scope">{{(scope.$index)+1}}</template>
            </el-table-column>

            <el-table-column
              label="商品图片"
              align="center">
              <template slot-scope="scope">

                  <img class="vue-lazyload pic" v-lazy="scope.row.img_url" alt="" title="点击查看大图">
                  <!-- <viewer :images="scope.row.img_url">
                </viewer> -->
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center">
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <span>{{scope.row.title}}</span>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="市场价格(元)">
              <template slot-scope="scope">
                <div>{{scope.row.market_price}}</div>
              </template>
            </el-table-column>

            <!-- <el-table-column
              align="center"
              label="库存(件)">
              <template slot-scope="scope">
                <div>100</div>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <!--=查看详情的表格 end-->

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
        <el-button v-if="pageType !== 'detail'" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button v-if="pageType !== 'detail'" @click="calcle">返 回</el-button>
        <el-button v-if="pageType === 'detail'" @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="选择商品"
      :visible.sync="shopDataVisible"
      width="65%">
      <div>
        <!-- {{this.choosegiftsAll}}------------------------------------
        {{this.multipleAll}} -->
        <div class="dialog_span">
          <span>
            <el-select style="width: 140px" clearable v-model="shopStateValue" @change="initTableDataByGoods(true)" placeholder="请选择" @current-change="choose">
              <el-option
                v-for="item in shopStateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>

          <span>
            <el-cascader
              :options="shopOptions"
              v-model="selectedShopOptions"
              :props="shopProps"
              clearable
              :disabled="shopStateValue == 1? true : false"
              :show-all-levels="false">
            </el-cascader>
          </span>

          <span>
            <el-input placeholder="请输入商品名称"  v-model="activitytitle"></el-input>
          </span>

          <span>
            <el-button type="primary" @click="initTableDataByGoods(true)">搜索商品</el-button>
          </span>

          <span>
            <el-button type="primary">确定</el-button>
          </span>
        </div>
        <!--表格 start-->
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="goodstableData"
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
               <img class="pic" :src="scope.row.imgUrl || pics[scope.$index] " alt title="点击查看大图">
                <!-- <viewer :images="scope.row.pics">
              </viewer> -->
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
              width="320">
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <span>{{scope.row.title}}</span>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="市场价格(元)">
              <template slot-scope="scope">
                <div>{{scope.row.price}}{{scope.row.marketPrice}}</div>
              </template>
            </el-table-column>

            <!-- <el-table-column
              align="center"
              label="库存(件)">
              <template slot-scope="scope">
                <div>100</div>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <!--表格 end-->

        <!--页码开始-->
        <div class="page">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="shopDataVisible = false;saveSelectGoods()">确 定</el-button>
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
        <el-button type="primary" @click="sureDialogVisible = false;InsertFullGift()">确 定</el-button>
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
import GetFullGiftProductActivity from '../../../../../src/api/giftPromotion/GetFullGiftProductActivity'; //查询满赠详情
import GetGiftProductList from '../../../../api/giftPromotion/GetGiftProductList';   //查询赠品列表；
import goodsBriefInfoByPage from '../../../../../src/api/ShopActivity/goodsBriefInfoByPage';   //查询商品列表
import getCategory from '../../../../../src/api/ShopActivity/getCategory.js';       //分类查询
import InsertFullGiftAcitivity from '../../../../../src/api/giftPromotion/InsertFullGiftAcitivity.js';        //添加或者修改满赠

  export default {
    mounted () {
      if(this.pageType!="add"){
        this.fulllGiftInfo();
      }
      if(this.pageType!="detail"){
        this.goodsClassList();
      }
    },
    data () {
      return {
        pageType: this.$route.query.type,
        sureDialogVisible: false, // 点击确定的提示框
        cancleDialogVisible: false, // 点击取消的提示框
        activityId:this.$route.query.id,      //查询满赠详情id
        ruleForm: {
          title: '',
          date1: '',
          date2: '',
        },
        activitytitle:'',     //选择赠品中搜索赠品名称
        giftstableData: [],       //查询出来的  赠品信息
        goodstableData:[],      //赠品商品搜索表格
        editortableData: [],    //查询出来的  商品信息
        multipleSelection: [], // 所有已选商品
        multipleAll: [],       //本次选中的商品 集合
        choosegifts:[],       //所有已选赠品  集合
        choosegiftsAll:[],    //本次已选赠品  集合
        total:100,    //记录赠品/商品总条数
        pageSizes: [4, 8, 16,24],
        pageNum: 1, //当前页
        itemNum: 4, //每页多少条
        total: 100,
        numDay:'',
        changePage: false,
        shopProps: {
          value: 'id',
          label: 'title',
          children: 'cateogryChildren'
        },//分类级联  属性设置
        selectGoods: [],//商家选择的商品
        pics:[],      //搜索的赠品图片集合。
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ]
        },
        tableData: [{ // 表格数据
          sort: '1',
          pic: 'https://picsum.photos/id/237/200/300',
        }],
        dttailtableData: [{ // 表格数据
          sort: '1',
          pic: 'https://picsum.photos/id/237/200/300',
        }],


        shopDataVisible: false,
        multipleSelectionSelected: [], //已选择商品  多选按钮
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
        shopStateOptions: [{
          value: 0,
          label: '商品'
        }, {
          value: 1,
          label: '赠品'
        }],
        shopStateValue: '',
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
       setTheGiftList: function(){     //赠品列表查询
        this.clientTimespan = new Date().toLocaleString();
        GetGiftProductList.call(this, `?input.title=${this.activitytitle}&input.pageSize=${this.itemNum}&input.pageIndex=${this.pageNum}&input.clientTimespan=${this.clientTimespan}`).then(res => {
          if(res.data.code===1){
              this.goodstableData=res.data.data.giftProduct;
              this.total = res.data.data.totalCount;
              this.pics=[];
              for(let i=0;i<res.data.data.giftProduct.length;i++){
                this.pics.push(res.data.data.giftProduct[i].pics.split(",")[0]);
              }
              let _indexList = new Array();
                  this.choosegiftsAll.map(selectGood => {
                    this.goodstableData.map((room, index) => {
                      if (selectGood.id === room.id) {
                        _indexList.push(index);
                      }
                    })
                  });
                  //确定 触发回显
                  this.$nextTick(() => {
                    this.toggleSelection(_indexList);
                  });
              console.log(this.pics);
          }else{
            this.$message.error("查询赠品列表失败！");
          }
        })
      },
      fulllGiftInfo(){    //满赠详情方法
        GetFullGiftProductActivity.call(this,`?input.activityId=${this.activityId}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          console.log(res.data);
          this.ruleForm=res.data.data;
           let datatime= this.DateDiff(res.data.data.begin_time,res.data.data.end_time);      //计算活动天数
           this.numDay=datatime+1;   //活动天数
          this.dttailtableData=res.data.data.products;      //赠品详情
          if(this.pageType!="detail"){    //当不是查看进来时   给添加/修改 已选赠品
            const products=res.data.data.products;      //赠品详情
            const edit = products.filter(val => val.gift_from === 1)
            const gift = products.filter(val => val.gift_from === 2)
            const edit1 = edit.map(val => {
              return {
                articleId: val.from_id,
                imgUrl: val.img_url,
                marketPrice: val.market_price,
                sellPrice: val.sell_price,
                title: val.title
              }
            })
            this.multipleAll.push(...edit1)
            const gift1 = gift.map(val => {
              return {
                id: val.from_id,
                pics: val.img_url,
                price: val.market_price,
                price: val.sell_price,
                title: val.title
              }
            })
            this.choosegiftsAll.push(...gift1)
            // products.map(pro =>{
            //   if(pro.gift_from==1){     //商品类型为商品
            //     this.editortableData=products;      //渲染到商品集合数组内
            //     this.multipleAll.push(...this.editortableData)
            //     this.AlleditortableData = [...this.editortableData]
            //   }else{       //否则为赠品类型
            //     this.giftstableData=products;     //渲染到赠品集合
            //   }
            // })
            this.editortableData = [...this.multipleAll, ...this.choosegiftsAll]
          }
        })
      },
      initTableDataByGoods: function(val){   //查询商品/赠品列表
      if(val){
        this.changePage = true;
      }
        console.log(this.shopStateValue);
        if(this.shopStateValue==0){
          let _path = `?clientVersion=1.0.0&clientTimespan=${this.$Tool.formatDate(new Date())}&pageIndex=${this.pageNum}&pageSize=${this.itemNum}`;
        if (this.activitytitle !== '' && this.activitytitle !== null) {
          _path += `&articleName=${this.activitytitle}`;
        }
        if (this.selectedShopOptions !== null && this.selectedShopOptions.length > 0) {
          let _index = this.selectedShopOptions.length - 1;
          _path += `&categroyId=${this.selectedShopOptions[_index]}`;
        }
            goodsBriefInfoByPage.call(this, _path).then(res => {
              console.log(res)
                if (res.data.code === 1) {
                //成功
                if (res.data.data != null) {
                  this.goodstableData = res.data.data.list;
                  this.total = res.data.data.totalCount;
                  let _indexList = new Array();
                  this.multipleAll.map(selectGood => {
                    this.goodstableData.map((room, index) => {
                      if (selectGood.articleId === room.articleId) {
                        _indexList.push(index);
                      }
                    })
                  });
                  //确定 触发回显
                  this.$nextTick(() => {
                    this.toggleSelection(_indexList);
                  });
                }
              } else {
                //失败
                this.$message.error(res.data.desc);
              }
          })
        }else{
          this.setTheGiftList();
        }

      },
       //获取分类
      goodsClassList() {

        getCategory.call(this, `?clientVersion=1.0.0&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
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
        console.log("------:"+this.shopOptions);
      },
      choose(){

      },
      calcle() {
        this.cancleDialogVisible = true;
      },

      goBack() {
        this.$router.go( -1 );
      },
      //回显勾选
      toggleSelection(rows) {
        if (this.$refs.multipleTable){
          this.$refs.multipleTable.clearSelection();
        }
        rows.forEach(index => {
          this.$refs.multipleTable.toggleRowSelection(this.goodstableData[index],true);
        });
      },
      /**
       * 表格全选功能
       * @param val
       */
      handleSelectionChange(val) {
        console.log(this.changePage,val,this.choosegiftsAll,this.multipleAll,'23333');
        if(this.shopStateValue==0){
          console.log("选择商品",this.multipleSelection);
          if (this.changePage && this.multipleSelection.length > 0) {
            this.multipleSelection = val;
            this.changePage = false;
          } else {
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
          console.log("已选商品",this.multipleAll);
        }else{
          //choosegifts:[],       //所有已选赠品  集合
          //choosegiftsAll:[],    //本次已选赠品  集合
          console.log(val,'zp');

          if (this.changePage && this.choosegifts.length > 0) {
            this.choosegifts = val;
            this.changePage = false;
          } else {
            let choosegiftsAll = JSON.parse(JSON.stringify(this.choosegiftsAll));
            this.choosegifts.map(item => {
              let _index = -1;
              choosegiftsAll.map((it, index) => {
                if (item.id === it.id) {
                  _index = index;
                }
              });
              if (_index > -1) {
                choosegiftsAll.splice(_index, 1);
              }
            });
            val.map(item => {
              let _flag = true;
              choosegiftsAll.map(ii => {
                if (item.id === ii.id) {
                  _flag = false;
                }
              });
              if (_flag) {
                choosegiftsAll.push(item);
              }
            });
          this.choosegiftsAll = choosegiftsAll;
          this.choosegifts = val;
        }
          console.log("已选赠品",this.choosegiftsAll);
        }

      },
      handleSelectionChangeSelected(val) {
        this.multipleSelectionSelected = val;
        console.log("移除选择："+this.multipleSelectionSelected);
      },
      //删除选择的商品
      delGoods({articleId, id}) {
        this.$confirm('确定删除该商品？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (articleId) {
            this.multipleAll = this.multipleAll.filter(res => res.articleId != articleId)
          } else if (id) {
            this.choosegiftsAll = this.choosegiftsAll.filter(res => res.id != id)
          }
          this.editortableData = [...this.multipleAll, ...this.choosegiftsAll]
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      //批量移除
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
          this.multipleSelectionSelected.forEach(item => {
            if (item.articleId) {
              this.multipleAll = this.multipleAll.filter(res => res.articleId != item.articleId)
            } else if (item.id) {
              this.choosegiftsAll = this.choosegiftsAll.filter(res => res.id != item.id)
            }
          })
          this.editortableData = [...this.multipleAll, ...this.choosegiftsAll]
        }).catch(() => {

        });
      },
      saveSelectGoods() {
        this.shopDataVisible = false;
        // let _selectGoods = this.multipleAll;    //已选商品集合
        // let _choosegiftsAll=this.choosegiftsAll;    //已选赠品集合

        console.log("_choosegiftsAll:",this.choosegiftsAll);

        console.log("_selectGoods:",this.multipleAll);
        this.editortableData = [...this.multipleAll, ...this.choosegiftsAll]
        console.log(this.editortableData)
      },
      DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式
          var aDate, oDate1, oDate2, iDays;
          aDate = sDate1.split("-");
          oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为yyyy-MM-dd格式
          aDate = sDate2.split("-");
          oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
          iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
          return iDays;  //返回相差天数
      },
      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        this.changePage=true;
        this.itemNum = val;
        console.log(`每页 ${val} 条`);
         this.initTableDataByGoods();

      },
      handleCurrentChange(val) {
        this.changePage=true;
        console.log(`当前页: ${val}`);
        this.pageNum = val;
        this.initTableDataByGoods();
      },
      InsertFullGift(){             //添加或者修改提交满赠信息
      let fullGiftinfo={};
      let fullGiftAll={};
      const edit1 = this.editortableData.map(val => {
              return {
                from_id:val.articleId || val.id,
                gift_from: val.articleId ? 1 : 2
              }
            })
          if(this.pageType==="edit"){       //修改时的参数
            this.ruleForm.begin_time=this.ruleForm.begin_time.split(" ")[0];
            this.ruleForm.end_time=this.ruleForm.end_time.split(" ")[0];
            fullGiftinfo = {
                id:parseInt(this.activityId),
                title: this.ruleForm.title,
                begin_time: this.ruleForm.begin_time+ ' 00:00:00',
                end_time: this.ruleForm.end_time+ ' 23:59:59',
                meet_price:this.ruleForm.meet_price,
                optional_num:this.ruleForm.optional_num,
                products:edit1
              };
              fullGiftAll = {
                  fullGift:fullGiftinfo,
                  type:1,
                  clientVersion:"1.0.0",
                  clientTimespan:this.$Tool.formatDate(new Date())
              };
          }else{        //添加
              fullGiftinfo = {
                title: this.ruleForm.title,
                begin_time: this.ruleForm.begin_time+ ' 00:00:00',
                end_time: this.ruleForm.end_time+ ' 23:59:59',
                meet_price:this.ruleForm.meet_price,
                optional_num:this.ruleForm.optional_num,
                products:edit1
              };
              fullGiftAll = {
                  fullGift:fullGiftinfo,
                  type:0,
                  clientVersion:"1.0.0",
                  clientTimespan:this.$Tool.formatDate(new Date())
              };
          }
        console.log(fullGiftAll);
         InsertFullGiftAcitivity.call(this,fullGiftAll).then(res =>{
            if (res.data.code === 1) {
              //成功
              this.$message.success(res.data.desc);
              this.goBack();
            } else {
              //失败
              this.$message.error(res.data.desc);
            }
         })
      },
      /**
       * 跳转到商品详情页goDetail() {
        this.$router.push({ name: 'GoodsDetail' });
      },
       */

      //添加时默认时间方法
      startMonth() {
        this.endTimes = {
          disabledDate: (time) => {
            if (this.ruleForm.begin_time === '' || this.ruleForm.begin_time === null) {
              return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
            } else {
              return time.getTime() < new Date(this.ruleForm.begin_time).getTime() + (86400000 * 5) || time.getTime() > new Date(this.ruleForm.begin_time).getTime() + (86400000 * 29);
            }
          }
        };
        this.inputText();
      },
      endMonth() {
        this.startTimes = {
          disabledDate: (time) => {
            if (this.ruleForm.end_time === '' || this.ruleForm.end_time === null) {
              return time.getTime() < Date.now();
            } else {
              return time.getTime() > new Date(this.ruleForm.end_time).getTime() - (86400000 * 6) || time.getTime() < Date.now() || time.getTime() < new Date(this.ruleForm.end_time).getTime() - (86400000 * 30);
            }
          }
        };
        this.inputText();
      },
      inputText() {
        let day = '';
        if (this.ruleForm.begin_time !== '' && this.ruleForm.end_time !== '' && this.ruleForm.begin_time !== null && this.ruleForm.end_time !== null) {
          day = (new Date(this.ruleForm.end_time).getTime() - new Date(this.ruleForm.begin_time).getTime()) / 86400000 + 1;
          console.log(('aaa'));
        }
        this.numDay = day;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
