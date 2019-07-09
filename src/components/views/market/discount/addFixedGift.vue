<template>
  <div class="addDiscount_box">
    <div class="title_box">
      <ul>
        <li class="active"><span v-if="pageType === 'add'">添加</span><span v-if="pageType === 'edit'">编辑</span><span
          v-if="pageType === 'detail'">查看</span>指定赠活动
        </li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name" label-width="100px">
        <el-input style="width: 400px;" v-model="ruleForm.name"
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
                :picker-options="startTimes" @change="startMonth"
                type="datetime"
                value-format='yyyy-MM-dd'
                format="yyyy-MM-dd"
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
                type="datetime"
                value-format='yyyy-MM-dd'
                format="yyyy-MM-dd"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span">共</span>
          <el-input style="width: 100px;" v-model="ruleForm.name1"
                    :disabled="pageType === 'detail' ? true : (pageType==='add' ? true : (pageType==='edit'? true:false))"
                    @blur="DateDiff(ruleForm.date1,ruleForm.date2)"></el-input>
          <span class="add_span">天</span>
          <i>（活动时间7-30天，从开始日00:00:00生效，结束日23:59:59失效）</i>
        </div>
      </el-form-item>

      <el-form-item label="活动范围" label-width="100px" v-if="pageType !== 'detail'">
        <div>
          <el-button type="primary" @click="shopDataVisible = true,tianjia()">+ 添加主商品</el-button>
        </div>
      </el-form-item>

      <el-form-item style="text-align: right;">
        <el-button type="primary" @click="removeSelectAll">批量移除</el-button>
        <!--添加/编辑的表格 start-->
        <div class="table table1" v-if="pageType !== 'detail'">
          <el-table
            ref="multipleTable"
            :data="tableData"
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
                <viewer>
                  <img class="pic" :src="scope.row.imgUrl" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
            >
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail(scope.row.article_id)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="赠品"
              width="600">
              <template slot-scope="scope">
                <div class="gift_box">
                  <ul>

                    <li v-for="(item,index) in scope.row.giftProducts" :key='index'>
                      <div class="left">
                        <img :src="item.img_url" alt="">
                      </div>
                      <div class="right">
                        <p>{{item.title}}</p>
                        <div>
                          <span @click="yichuzeng(scope.row,item)">移除</span>
                        </div>
                      </div>
                    </li>

                  </ul>

                  <div class="textLeft">
                    <el-button type="default" size="small" @click='shopDataVisible1=true,addGiftAndGoods(scope.row)'>+ 添加赠品
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="yichu(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--添加/编辑的表格 end-->

        <!--删除的表格 start-->
        <div class="table table1" v-if="pageType === 'detail'">
          <el-table
            :data="tableData1"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="sort"
              label="序号"
              fixed
              type='index '
              align="center"
              width="55">
            </el-table-column>

            <el-table-column
              label="商品图片"
              fixed
              align="center"
              width="80">
              <template slot-scope="scope">
                <viewer>
                  <img class="pic" :src="scope.row.img_url" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
              prop="title"
            >
              <template slot-scope="scope">
                <div class="shopName">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail(scope.row.article_id)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="赠品"
              width="600">
              <template slot-scope="scope">
                <div class="gift_box">
                  <ul>
                    <li v-for="(item,index) in scope.row.giftProducts" :key="index">
                      <div class="left">
                        <img v-lazy="item.img_url" alt="">
                      </div>
                      <div class="right">
                        <p>{{item.title}}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--删除的表格 end-->

        <!--页码开始-->
        <!--<div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </div>-->
        <!--页码结束-->
      </el-form-item>

      <el-form-item label-width="80px" style="margin-top: 60px;">
        <el-button type="primary" v-if="pageType !== 'detail'" @click="isCondition">确定</el-button>
        <el-button v-if="pageType !== 'detail'" @click="calcle">返 回</el-button>
        <el-button v-if="pageType === 'detail'" @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加主商品模态框 -->
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
            <el-input placeholder="请输入商品名称" v-model="sousuotitle"></el-input>
          </span>

          <span>
            <el-button type="primary" @click="serchproduct()">搜索商品</el-button>
          </span>

          <span>

          </span>
        </div>

        <!--表格 start-->
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="tableData2"
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
                <img class="pic" :src="scope.row.imgUrl || pics[scope.$index]" alt="" title="点击查看大图">
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
              width="320"
            >
              <template slot-scope="scope">
                <div class="shopName">
                  {{scope.row.title}}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="原价(元)">
              <template slot-scope="scope">
                <div>{{scope.row.sellPrice}}</div>
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
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
        <!--页码结束-->

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="shopDataVisible = false,quedingadd()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加赠品品模态框 -->
    <el-dialog
      title="选择赠品"
      :visible.sync="shopDataVisible1"
      width="60%">
      <div>

        <div class="dialog_span">
          <span>
            <el-select style="width: 140px" v-model="shopStateValue" @change="changeStatus"
                       placeholder="请选择" >
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
            <el-input placeholder="请输入名称" v-model="sousuotitle"></el-input>
          </span>

          <span>
            <el-button type="primary" @click="searchGoodsOrGift">搜索赠品</el-button>
          </span>
          <span>

          </span>
        </div>

        <!--表格 start-->
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="tableData3"
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
              label="赠品图片"
              fixed
              align="center"
              width="80">
              <template slot-scope="scope">
                <viewer>
                  <img class="pic" v-lazy="scope.row.pics || pics[scope.$index]" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="赠品名称"
              align="center"
              width="320"
            >
              <template slot-scope="scope">
                <div class="shopName">
                  {{scope.row.title}}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="原价(元)">
              <template slot-scope="scope">
                <div>{{scope.row.price}}</div>
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
            :current-page="currentPage3"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pageSize3"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total3">
          </el-pagination>
        </div>
        <!--页码结束-->

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDataVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="shopDataVisible1 = false,addzeng()">确 定</el-button>
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
        <el-button @click="sureDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
  import GetAppointGift from '../../../../api/giftPromotion/GetAppointGift.js' // 指定赠查询详情 get
  import InsertAppointGift from '../../../../api/giftPromotion/InsertAppointGift.js'//指定赠添加或修改 post
  import GetGiftProductList from '../../../../api/giftPromotion/GetGiftProductList.js' // 赠品列表
  import DelectGift from '../../../../api/giftPromotion/delectGift.js'//删除赠品
  import GetGoodsBriefInfoByPage from '../../../../api/giftPromotion/GetGoodsBriefInfoByPage.js'
  import GetCategory from '../../../../../src/api/ShopActivity/getCategory.js';       //分类查询

  export default {
    mounted() {
      this.getCategory();
    },
    data() {
      return {
        pageType: this.$route.query.type,
        selectid: 0,
        sureDialogVisible: false, // 点击确定的提示框
        cancleDialogVisible: false, // 点击取消的提示框
        clientTimespan: new Date().toLocaleString(),//当前时间
        ruleForm: {
          name: '',
          name1: '',
          date1: '',
          date2: '',
        },
        Products: [],
        Listdata: {},

        time: '',
        Zengpin: [],//添加赠品数据
        zengpin: {},
        c: {},
        rules: {
          name: [
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
        sousuotitle: '',
        fromid: 300020,//赠品
        giftfrom: 1,
        tableData: [],//表格数据
        tableData1: [],//商品列表表格
        tableData2: [],
        tableData3: [],//赠品添加表格
        multipleSelection: [], // 表格全选参数
        currentPage: 1,
        pageSize: 10,
        total: 0,
        total1: 0,
        currentPage3: 1,
        pageSize3: 10,
        total3: 0,
        shopDataVisible: false,
        shopDataVisible1: false,
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
        shopProps: {
          value: 'id',
          label: 'title',
          children: 'cateogryChildren'
        },//分类级联  属性设置
        selectedShopOptions: [], //商家选择的分类
        shopOptions: [{ // 搜索条件-商品分类的选项
          id: 'wristWatch',
          title: '腕表眼镜',
          cateogryChildren: [{
            id: 'zhongbiao',
            title: '钟表',
            cateogryChildren: [{
              id: 'huaibiao',
              title: '怀表'
            }]
          }, {
            id: 'peijian',
            title: '配件',
            cateogryChildren: [{
              id: 'biaohe',
              title: '表盒表带'
            }]
          }]
        }, {
          id: 'xiangbao',
          title: '服饰箱包',
          cateogryChildren: [{
            id: 'fushi',
            title: '服饰配件',
            cateogryChildren: [{
              id: 'xiukou',
              title: '袖扣'
            }, {
              id: 'lingdaitou',
              title: '领带夹'
            }]
          }]
        }, {
          id: 'xiexue',
          title: '精品鞋靴',
          cateogryChildren: [{
            id: 'lvTongXie',
            title: '运动鞋'
          }]
        }],
        fixedGiftToGoods: {},//一个或多个赠品对应的商品
        shopStateOptions: [{//添加赠品时选择商品或赠品
          value: 0,
          label: '商品'
        }, {
          value: 1,
          label: '赠品'
        }],
        shopStateValue: 0,//选择结果
        clientTimespan1: new Date().toLocaleString(),
        clientVersion: '1',
      }
    },
    methods: {
      submitForm() {
        this.sureDialogVisible = false;

        console.log('列表里面的数据', this.tableData);
        //判断活动名称长度

        this.InsertAppointGift();
      },

      //判断是否符合提交条件
      isCondition(){

        let flag = true;
        let title = this.ruleForm.name.split('');
        if (title.length < 1||title.length>20) {
          this.$message.error('名称不合法');
          return flag=false;
        }

        if (this.tableData.length < 1) {
          this.$message.error('请添加商品');
          return flag=false;
        }
        this.tableData.forEach(t => {
          if (t.giftProducts.length < 1) {
            this.$message.error(t.title + '未添加赠品');
            return flag=false;
          }
        });

        if (flag){
          this.sureDialogVisible=true;
        }
      },


      calcle() {
        this.cancleDialogVisible = true;
      },

      //不返回，直接跳到指定赠页面
      goBack() {
        this.$router.push({name: 'GiftPromotion', query: {activityName: '指定赠'}});
      },

      /**
       * 表格全选功能
       * @param val
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        if (this.shopDataVisible){
          this.pageSize = val;
          this.tianjia();
        }

        if (this.shopDataVisible1) {
          this.pageSize3 = val;
          this.searchGoodsOrGift();
        }
      },
      startMonth() {
        this.endTimes = {
          disabledDate: (time) => {
            if (this.ruleForm.date1 === '' || this.ruleForm.date1 === null) {
              return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
            } else {
              return time.getTime() < new Date(this.ruleForm.date1).getTime() + (86400000 * 5) || time.getTime() > new Date(this.ruleForm.date1).getTime() + (86400000 * 29);
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
        this.ruleForm.name1 = day;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        if (this.shopDataVisible){
          this.currentPage=val;
          this.tianjia();
        }

        if (this.shopDataVisible1) {
          this.currentPage3=val;
          this.searchGoodsOrGift();
        }
      },
      // 确定添加商品
      quedingadd() {
        if (this.tableData.length < 1) {
          //this.tableData = this.multipleSelection;
          this.multipleSelection.forEach(m => {
            this.tableData.push(m);
          });
          this.multipleSelection = [];
        } else {
          let mdata = this.multipleSelection;
          let tdata = this.tableData;
          for (let i = 0; i < mdata.length; i++) {
            let flag = this.Addshop(tdata, mdata[i].articleId);
            if (!flag) {
              console.log('主商品格式', mdata[i]);
              tdata.push(mdata[i]);
              this.$message.success('商品添加成功');
            } else {
              this.$message.error('该商品已经添加过');
            }
          }
          this.multipleSelection = [];
        }
        this.total1 = this.tableData.length
      },
      Addshop(arr, articleId) {
        let flag = false;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].articleId === articleId) {
            flag = true;
            break;
          }
        }
        return flag;
      },
      // 添加赠品
      addzeng() {
        // alert(11)
        // console.log(this.multipleSelection)
        let Mu = this.multipleSelection
        //判断第一次跟不是第一次添加数据
        let gift = this.fixedGiftToGoods.giftProducts;//商品里面的赠品列表
        if (gift.length === 0) {
          for (let i = 0; i < Mu.length; i++) {
            this.c = {
              img_url: Mu[i].pics,
              id: Mu[i].id,
              price: Mu[i].price,
              shop_id: Mu[i].shop_id,
              title: Mu[i].title,
              gift_from:Mu[i].gift_from,
            };
            gift.push(this.c)
          }
        } else {
          for (let i = 0; i < Mu.length; i++) {
            let flag = this.isAddGift(gift, Mu[i].id);
            if (!flag) {
              this.$message.error(Mu[i].title + '已添加过');
            } else {
              this.c = {
                img_url: Mu[i].pics,
                id: Mu[i].id,
                price: Mu[i].price,
                shop_id: Mu[i].shop_id,
                title: Mu[i].title,
                gift_from:Mu[i].gift_from,
              };
              gift.push(this.c)
            }
          }
        }

        console.log('商品里面对应的赠品列表', gift);

        /*if (this.pageType === 'edit') {
          let Mu = this.multipleSelection
          for (let i = 0; i < Mu.length; i++) {
            this.c = {
              img_url: Mu[i].pics,
              id: Mu[i].id,
              price: Mu[i].price,
              shop_id: Mu[i].shop_id,
              title: Mu[i].title
            }
            this.zengpin.shuzu.push(this.c)
          }
        }*/
      },
      //根据id判断是否已经添加了该赠品
      isAddGift(arr, id) {
        let flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            flag = false;
            break;
          }
        }
        return flag;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.tianjia()

      },
      DateDiff(sDate1, sDate2) {
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为yyyy-MM-dd格式
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
        return iDays;  //返回相差天数
      },

      //移除某个赠品方法
      yichuzeng(row, item) {
        let index = row.giftProducts.indexOf(item);
        row.giftProducts.splice(index, 1);
        console.log('从这个商品中移除某个赠品', row);
      },
      // 搜索赠品
     /* serchzeng() {
        GetGiftProductList.call(this, `?input.title=${this.sousuotitle}&input.pageSize=${this.pageSize3}&input.pageIndex=${this.currentPage3}&input.clientTimespan=${this.clientTimespan}`)
          .then(res => {
            console.log(res)
            if (res.data.code === 1) {
              this.tableData3 = res.data.data.giftProduct
              this.total3 = res.data.data.totalCount
            }
          })
      },*/

     //当属性栏改变，根据选择不同来展示商品或者赠品
      changeStatus(){
        this.selectedShopOptions=[];
        this.sousuotitle='';
        this.searchGoodsOrGift();
      },

      //点击添加赠品按钮
      addGiftAndGoods(data){
        this.fixedGiftToGoods = data;
        this.selectedShopOptions=[];
        this.sousuotitle='';
        this.shopStateValue=0;
        this.searchGoods();
      },

      //点击添加赠品里面的搜索,根据选择不同来判断
      searchGoodsOrGift(){
        if (this.shopStateValue){
          this.searchGift();
        } else {
          this.searchGoods();
        }
      },

      //选择赠品列表
      searchGift() {
        this.tableData3=[];
        GetGiftProductList.call(this, `?input.title=${this.sousuotitle}&input.pageSize=${this.pageSize3}&input.pageIndex=${this.currentPage3}&input.clientTimespan=${this.clientTimespan}`)
          .then(res => {
            if (res.data.code === 1) {
              let giftProduct = res.data.data.giftProduct;
              for (let i = 0; i < giftProduct.length; i++) {
                this.$set(giftProduct[i],'gift_from',2);
              }
              this.tableData3=giftProduct;
              this.total3 = res.data.data.totalCount;
            }else {
              this.$message.error('查询赠品列表失败');
            }

          })
      },

      //查询商品并改变属性
      searchGoods(){
        this.tableData3=[];
          let categroyId = 0;
          if (this.selectedShopOptions != null && this.selectedShopOptions.length > 0) {
            categroyId = this.selectedShopOptions[this.selectedShopOptions.length - 1];
          }
          GetGoodsBriefInfoByPage.call(this, `?articleName=${this.sousuotitle}&pageSize=${this.pageSize3}&pageIndex=${this.currentPage3}&clientTimespan=${this.clientTimespan}&categroyId=`+categroyId)
            .then(res => {
              if (res.data.code === 1) {
                //改变商品属性与赠品属性一样
                let list = res.data.data.list;
                let temp = {};
                for (let i = 0; i < list.length; i++) {
                  temp = {
                    id:list[i].articleId ,
                    shop_id:list[i].shopId ,
                    title:list[i].title ,
                    descr:list[i].categoryAll ,
                    price:list[i].sellPrice ,
                    pics:list[i].imgUrl ,
                    gift_from:1,
                  };
                  this.tableData3.push(temp);
                }
                this.total3 = res.data.data.totalCount
              }else {
                this.$message.error('商品列表查询失败');
              }
            })
      },

      //商品分类查询
      getCategory() {
        GetCategory.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan1)
          .then(
            res => {
              if (res.data.code === 1) {
                //console.log('商品分类栏目', res.data.data);
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

      // 指定赠查询详情
      GetAppointGift() {
        GetAppointGift.call(this, `?input.activityId=${this.selectid}&input.clientTimespan=${this.clientTimespan}`)
          .then(res => {
            console.log(res)
            let datatime = this.DateDiff(res.data.data.begin_time, res.data.data.end_time);
            this.ruleForm.name1 = datatime + 1;
            if (res.data.code === 1) {
              this.ruleForm.name = res.data.data.title;
              this.ruleForm.date1 = res.data.data.begin_time.split(' ')[0];
              this.ruleForm.date2 = res.data.data.end_time.split(' ')[0];
              //查看页
              this.tableData1 = res.data.data.products;//列表表格
              console.log('查看页数据', this.tableData1);
              //编辑页
              //修改属性名批评为主商品列表的属性名
              //this.tableData = res.data.data.products
              let temp_products = {};
              let temp_gift = {};
              let p = res.data.data.products;
              for (let i = 0; i < p.length; i++) {
                let giftProducts = [];
                let g = p[i].giftProducts;
                if (g.length > 0) {
                  for (let j = 0; j < g.length; j++) {
                    temp_gift = {
                      id: g[j].from_id,
                      title: g[j].title,
                      img_url: g[j].img_url,
                      price: g[j].sell_price,//销售价格
                      gift_from:g[j].gift_from,
                    };
                    giftProducts.push(temp_gift);
                  }
                }
                temp_products = {
                  articleId: p[i].article_id,
                  title: p[i].title,
                  imgUrl: p[i].img_url,
                  market_price: p[i].market_price,
                  sell_price: p[i].sell_price,
                  giftProducts: giftProducts,
                };
                this.tableData.push(temp_products);
              }

              console.log('编辑页数据', this.tableData);
              // this.total1 = res.data.data.products.length


              /* let d = this.tableData
               for (let i = 0; i < d.length; i++) {

                 this.zengpin = {
                   shuzu: d[i].giftProducts
                 }
                 console.log(this.zengpin.shuzu)
                 this.Shopid.push(this.shopid)
                 d[i].giftProducts.map(item => {
                   this.Listdata = {
                     from_id: item.from_id,
                     gift_from: item.gift_from,
                   }
                   this.Products.push(this.Listdata)
                 })
               }*/
            }
          })

      },
      serchproduct() {
        this.tianjia();
      },
      /**
       * 跳转到商品详情页
       */
      goDetail(id) {
        //alert(id);
        this.$router.push({name: 'GoodsDetail', goodsId: id});
      },
      // 指定赠添加或者修改
      InsertAppointGift() {
        let type = (this.pageType === 'add' ? 0 : 1);
        let product = [];//商品id
        let temp_gift = {};//装赠品
        let temp_goods = {};//商品
        let d = this.tableData;
        //debugger;
        for (let i = 0; i < d.length; i++) {
          let giftProducts = [];//赠品
          let gift = d[i].giftProducts;
          for (let j = 0; j < gift.length; j++) {
            temp_gift = {
              from_id: gift[j].id,
              gift_from: gift[j].gift_from,
            };
            giftProducts.push(temp_gift);
          }
          //单个商品与多个赠品对应
          temp_goods = {
            article_id: d[i].articleId,
            giftProducts: giftProducts,
          };
          // }
          product.push(temp_goods);
        }
        console.log('发送的商品对应赠品', product);
        InsertAppointGift.call(this, {
          type: type,
          apponintGift: {
            id: this.selectid,
            title: this.ruleForm.name,
            begin_time: this.ruleForm.date1 + ' 00:00:00',
            end_time: this.ruleForm.date2 + ' 23:59:59',
            products: product,
          },
          clientTimespan: this.clientTimespan
        })
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('添加成功');
              this.$router.push({name: 'GiftPromotion', query: {activityName: '指定赠'}});
            } else {
              this.$message.error('添加失败' + res.data.desc);
            }
          })
        /*if(this.pageType==='edit'){
            let product = []
            let Products = []
            let temp = {}
            let Listdata = {}
            let d = this.tableData
            for(let i=0;i<d.length;i++){
              temp={
                id:d[i].article_id
              }
              product.push(temp)
            }
        InsertAppointGift.call(this,{
            type:1,
            apponintGift:{
              id:this.selectid,
              title:this.ruleForm.name,
              begin_time:this.ruleForm.date1 + ' ' + '00:00:00',
              end_time:this.ruleForm.date2 + ' ' + '23:59:59',
              products:[
                {article_id:product,giftProducts:this.Products}
              ]
            },
            clientTimespan:this.clientTimespan
          })
          .then(res=>{
            console.log(res)
             if(res.data.code===1){
               this.$message.success('保存成功');
               this.$router.push({name: 'GiftPromotion',query: {activityName: '指定赠'}});
             }
          })
        }*/
      },
      // 移除
      yichu(data) {
        let index = this.tableData.indexOf(data);
        this.tableData.splice(index, 1);
      },

      //批量移除方法
      removeSelectAll() {
        let temp = [];
        this.tableData.forEach(t => {
          if (this.multipleSelection.indexOf(t) === -1) {
            temp.push(t);
          }
        });
        this.tableData = temp;
        this.multipleSelection = [];
      },

      // 主商品查询列表
      tianjia() {
        this.tableData2=[];
        let categroyId = 0;
        if (this.selectedShopOptions != null && this.selectedShopOptions.length > 0) {
          categroyId = this.selectedShopOptions[this.selectedShopOptions.length - 1];
        }
        GetGoodsBriefInfoByPage.call(this, `?articleName=${this.sousuotitle}&pageSize=${this.pageSize}&pageIndex=${this.currentPage}&clientTimespan=${this.clientTimespan}&categroyId=`+categroyId)
          .then(res => {
            //console.log(res)
            if (res.data.code === 1) {
              this.tableData2 = res.data.data.list;
              //为主商品列表添加属性，添加和查询属性对应
              for (let i = 0; i < this.tableData2.length; i++) {
                this.$set(this.tableData2[i], 'giftProducts', []);
              }
              this.total = res.data.data.totalCount
            }
          })
      }
    },
    watch: {
      shopDataVisible:function () {
        if (!this.shopDataVisible) {
          this.sousuotitle = '';
          this.selectedShopOptions = [];
        }
      }
    },

    created() {
      if (this.$route.query.id !== undefined) {
        this.selectid = this.$route.query.id;
        this.GetAppointGift();
      }

      // this.InsertAppointGift()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
