<template>
  <div class="addDiscount_box">
    <div class="title_box">
      <ul>
        <li class="active">折扣券</li>
      </ul>
      <div class="ribbon"></div>

    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name" label-width="100px">
        <el-input style="width: 400px;" v-model="ruleForm.name" maxlength="21"></el-input>
        <span class="add_font"> 0/20 </span>
      </el-form-item>

      <el-form-item label="满减金额" label-width="100px">
        <div class="add_prepend">
          <el-input style="width: 200px;" v-model="ruleForm.gwm" maxlength="9" placeholder="输入金额">
            <template slot="prepend">购物满</template>
          </el-input>
          <el-input style="width: 200px; margin-left: -5px;" v-model="ruleForm.zk" maxlength="3" placeholder="请输入折扣">
            <template slot="prepend">折扣</template>
          </el-input>
          <el-input style="width: 220px; margin-left: -5px;" v-model="ruleForm.ffsl" maxlength="9" placeholder="输入数量">
            <template slot="prepend">发放数量</template>
          </el-input>
          <span @click="add()" >+ 添加</span>
          <i>（满金额最高100元，折扣最高为9.9）</i>
        </div>

        <div class="add_tag">
          <el-tag
            v-for="tag in tags"
            :key="tag.id"
            closable
            :type="tag.type" @close="handleClose(tag)">
            {{tag.name}}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="领券时间" required label-width="100px">
        <div class="add_line">
          <span>
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                :picker-options="startMonthOption" @change="selectStartMonth"
                placeholder="请选择开始时间" format="yyyy-MM-dd 00:00:00">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span"> 至 </span>
          <span>
            <el-form-item prop="date2">
              <el-date-picker
                v-model="ruleForm.date2"
                type="date"
                :picker-options="endMonthOption" @change="selectEndMonth"
                placeholder="请选择结束时间" format="yyyy-MM-dd 23:59:59">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span">共</span>
          <el-input style="width: 100px;" :readonly="true" v-model="ruleForm.day"></el-input>
          <span class="add_span">天</span>
          <i>（活动时间7-30天，从开始日00:00:00生效，结束日23:59:59失效）</i>
        </div>
      </el-form-item>

      <el-form-item label="有效时间" required label-width="100px">
        <div class="add_line">
          <i>领券时间起</i>
          <el-input style="width: 160px; margin: 0 5px;" v-model="ruleForm.day2" placeholder="请输入天数"></el-input>
          <i>天内有效</i>
          <i>（券的有效期30-60天）</i>
        </div>
      </el-form-item>

      <el-form-item label="活动范围" label-width="100px">
        <div>
          <el-button :type="isAllProduct === 1?'primary':'default'" @click="changeGoods('all')">全店商品</el-button>
          <el-button :type="isAllProduct === 2?'primary':'default'" @click="showPartGoods">部分商品</el-button>
        </div>
      </el-form-item>

      <!--选择全店商品时的显示 start-->
      <el-form-item v-show="isAllProduct === 1">
        <div class="add_tips_p">选择全店商品时，活动结束前发布的新商品，将会默认加入优惠活动。</div>

        <!--表格 start-->
        <div class="table table1" style="height: 450px; overflow: auto;">
          <el-table
            :data="allGoodsList"
            border
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              fixed
              align="center"
              width="80">
            </el-table-column>

            <el-table-column
              label="商品图片"
              fixed
              align="center"
              width="120">
              <template slot-scope="scope">
                <viewer :images="scope.row.imgUrl == null ? '' : scope.row.imgUrl">
                  <img class="vue-lazyload pic" v-lazy="scope.row.imgUrl == null ? '':scope.row.imgUrl" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
              width="320">
              <template slot-scope="scope">
                <div class="title">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail(scope.row.articleId)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="商品价格(元)">
              <template slot-scope="scope">
                {{scope.row.sellPrice | moneyFormat}}
              </template>
            </el-table-column>

          </el-table>
        </div>
        <!--表格 end-->
      </el-form-item>
      <!--选择全店商品时的显示 end-->

      <!--选择部分商品时的显示 start-->
      <el-form-item v-show="isAllProduct === 2">
        <div class="add_top">
          <el-button type="primary" size="small" @click="changeGoods('part')">+ 继续添加</el-button>
          <el-button type="danger" size="small" @click="delBatchGoods()">批量移除</el-button>
        </div>

        <!--表格 start-->
        <div class="table table1" style="height: 450px; overflow: auto;">
          <el-table
            ref="multipleTable"
            :data="goodsList"
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
              fixed
              align="center"
              width="120">
              <template slot-scope="scope">
                <viewer :images="scope.row.imgUrl == null ? '':scope.row.imgUrl">
                  <img class="pic" :src="scope.row.imgUrl == null ? '':scope.row.imgUrl" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
              width="320">
              <template slot-scope="scope">
                <div class="title">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail(scope.row.articleId)">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="商品价格(元)">
              <template slot-scope="scope">
                {{scope.row.sellPrice | moneyFormat}}
              </template>
            </el-table-column>

            <el-table-column
              prop="opera"
              align="center"
              label="操作"
              width="100">
              <temlpate slot-scope="scope">
                <el-button type="text" @click="delGoods(scope.row.articleId)">移除</el-button>
              </temlpate>
            </el-table-column>

          </el-table>
        </div>
        <!--表格 end-->
      </el-form-item>
      <!--选择部分商品时的显示 end-->

      <el-form-item label-width="80px" style="margin-top: 60px;">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="calcle">返 回</el-button>
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
              v-model="selectValue"
              :options="shopOptions"
              clearable
              :show-all-levels="false">
            </el-cascader>
          </span>

          <span>
            <el-input placeholder="请输入商品名称" v-model="goodsTitle"></el-input>
          </span>

          <span style="float: left;">
            <el-button type="primary" @click="GetPartGoodsList">搜索商品</el-button>
          </span>

          <!--<span>
            <el-button type="primary">确定</el-button>
          </span>-->
        </div>

        <!--表格 start-->
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="parGoodsList"
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
                <viewer :images="scope.row.imgUrl">
                  <!--<img class="vue-lazyload pic" v-lazy="scope.row.imgUrl" alt="" title="点击查看大图">-->
                  <img class="pic" :src="scope.row.imgUrl" alt="" title="点击查看大图">
                </viewer>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              align="center"
              width="320">
              <template slot-scope="scope">
                <div class="title">
                  <p style="text-align: left;">
                    <a href="javascript: void(0);" @click="goDetail">{{scope.row.title}}</a>
                  </p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="市场价格(元)">
              <template slot-scope="scope">
                <div>￥{{intervalPrice(scope.row.article_goods)}}</div>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="库存(件)">
              <template slot-scope="scope">
                <div>{{scope.row.stockQuantity}}</div>
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
            :page-size="1000"
            layout="total, sizes, prev, pager, next, jumper"
            :total="parTotalCount">
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
        <el-button type="primary" @click="addDiscountPost()">确 定</el-button>
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
        <el-button type="primary" @click="addDiscountPost()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="batchDeleteVisible"
      width="500px">
      <div>
        <p style="font-size: 18px; color: #333;">确定移除吗？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchDeleteVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import GetGoodsBriefInfoByPage from '../../../../api/ShopActivity/GetGoodsBriefInfoByPage.js'
  import getCategory from '../../../../api/ShopActivity/getCategory.js'
  import InsertDiscountCouponActivity from '../../../../api/ShopActivity/InsertDiscountCouponActivity.js'
  import GetDiscountMeetCouponDetail from '../../../../api/ShopActivity/GetDiscountMeetCouponDetail.js'
  export default {
    mounted () {

    },
    data () {
      return {
        sureDialogVisible: false, // 点击确定的提示框
        cancleDialogVisible: false, // 点击取消的提示框
        batchDeleteVisible: false, // 批量移除的提示框
        ruleForm: {
          name: '',
          date1: '',
          date2: '',
          day:'',
          day2:'',
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          date1: [

          ],
          date2: [

          ],
        },

        tags: [
          /*{ name: '买100返5块 | 100张', type: '' },
          { name: '买100返5块 | 100张', type: '' },
          { name: '买100返5块 | 100张', type: '' }*/
        ],
        tableData: [{ // 表格数据
          pic: 'https://picsum.photos/id/237/200/300',
          price: '200.00',
        }],
        multipleSelection: [], // 表格全选参数
        currentPage: 1,
        shopDataVisible: false,
        shopOptions:[],
        pageSize:5,//分页数
        pageIndex:1,//页码
        allGoodsList:[],
        allTotalCount:0,
        parGoodsList:[],
        parTotalCount:0,
        allPageSize:100000,//全部商品最大值,
        goodsList:[],
        totalCount:0,
        selectValue:[],
        goodsTitle:'',
        isAllProduct:2,
        type:'add',
        id:0,
        multipleAll:[],
        changePage: false,
        multipleSelectionSelected:[],
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
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.type)
            if(this.type === 'add') {
              this.sureDialogVisible = true;
            }
            if(this.type === 'edit') {
              this.cancleDialogVisible = true;
            }
            return
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //添加折扣劵
      addDiscountPost(){
        if(this.tags === null || this.tags.length <= 0){
          this.$message({
            message: '满折规则未添加!',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }
        if(this.ruleForm.date1 === '' || this.ruleForm.date2 === ''){
          this.$message({
            message: '请选择开始时间和结束时间',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }

        if(this.ruleForm.day === ''){
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }
        if(this.ruleForm.day === ''){
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }
        if(this.goodsList.length === 0){
          this.$message({
            message: '没有商品信息',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }
        if(this.ruleForm.day2 === ''){
          this.$message({
            message: '请填写券的有效期30-60天',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }
        if(this.ruleForm.day2 < 30){
          this.$message({
            message: '劵的有效时间不能小于30天',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }
        if(this.ruleForm.day2 > 60){
          this.$message({
            message: '劵的有效时间不能大于霍等于61天',
            type: 'warning'
          });
          this.sureDialogVisible = false;
          return
        }
        let goodsList = []
        for(let i = 0;i<this.goodsList.length;i++){
          goodsList.push({activity_id:0,id:this.goodsList[i].articleId,discount:0,specid:0,discountPrice:0})
        }
        let date1 = this.formatDate(this.ruleForm.date1,'yyyy-MM-dd');
        let date2 = this.formatDate(this.ruleForm.date2,'yyyy-MM-dd');
        console.log(date1)
        console.log(date2)
        let type = 0
        if(this.type === 'add'){
          type = 0
        }else if(this.type === 'edit'){
          type = 1
        }
        //提交数据
        let data = {
          "type": type,
          "discountcoupon": {
            "meetDiscount":this.tags,
            "id": this.id,
            "title": this.ruleForm.name,
            "beginTime": date1+' 00:00:00',
            "endTime": date2+' 23:59:59',
            "isAllProduct": this.isAllProduct,
            "effective_day": this.ruleForm.day2,
            "goodsListInfo": goodsList
          },
          "clientVersion": "v1",
          "clientTimespan": new Date().toLocaleString()
        }
        console.log(JSON.stringify(data))
        InsertDiscountCouponActivity.call(this,data).then(res=>{
          if(res.data.code === 1){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.sureDialogVisible = false
            this.goBack()
          }else{
            this.sureDialogVisible = false
            this.$message.error(res.data.desc);

          }
        })
      },
      calcle() {
        this.cancleDialogVisible = true;
      },

      goBack() {
        this.$router.go( -1 );
      },
      saveSelectGoods() {
        this.shopDataVisible = false;
        let _selectGoods = this.multipleAll;
        //删除没勾选的
       /* _selectGoods.map(item =>{
          let _discount = undefined;
          this.selectGoods.map(it =>{
            if (item.articleId === it.articleId) {
              _discount = it.discount;
            }
          });
          if (_discount !== undefined){
            item.discount = _discount;
          }
        });*/
        this.goodsList = _selectGoods;
      },
      /**
       * 下面已选商品  多选
       */
      handleSelectionChangeSelected(val) {
        this.multipleSelectionSelected = val;
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
            this.goodsList.map((good, index) => {
              if (good.articleId === item.articleId) {
                this.goodsList.splice(index, 1);
              }
            })
          })
          this.multipleAll = this.goodsList
        }).catch(() => {

        });
      },
      //删除选择的商品
      delGoods(id) {
        this.$confirm('确定删除该商品？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.goodsList.map((good, index) => {
            if (good.articleId === id) {
              this.goodsList.splice(index, 1);
            }
          })
          this.multipleAll = this.goodsList
          console.log(this.multipleAll)
        }).catch(() => {
        });
      },
      /**
       * 表格全选功能
       * @param val
       */
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
          console.log(this.multipleAll)
          console.log(val)
        }
      },
      //回显勾选
      toggleSelection(rows) {
        if (this.$refs.multipleTable){
          this.$refs.multipleTable.clearSelection();
        }
        rows.forEach(index => {
          this.$refs.multipleTable.toggleRowSelection(this.parGoodsList[index],true);
        });
      },
      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageIndex = val
        this.GetPartGoodsList()
      },

      /**
       * 跳转到商品详情页
       */
      goDetail(goodsId) {
        this.$router.push({ name: 'GoodsDetail',query:{ goodsId:goodsId } });
      },
      handleClose(tag){
        let array = this.tags
        for (let i = 0;i<array.length;i++) {
          if(array[i].id === `${tag.id}`){
            delete array[i]
            array.splice(i,1)
          }
        }
        this.tags = []
        this.tags = array
        console.log(JSON.stringify(array))
      },
      add(){
        if(this.ruleForm.gwm === ''){
          this.$message({
            message: '满折金额不能为空!',
            type: 'warning'
          })
          return
        }
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(this.ruleForm.gwm) || regNeg.test(this.ruleForm.gwm)){
        }else{
          this.$message({
            message: '满折金额必须是数字!',
            type: 'warning'
          })
          return
        }
        if(parseInt(this.ruleForm.gwm) <= 0){
          this.$message({
            message: '满折金额必须是大于0!',
            type: 'warning'
          })
          return
        }

        if(regPos.test(this.ruleForm.zk) || regNeg.test(this.ruleForm.zk)){
        }else{
          this.$message({
            message: '折扣必须是数字!',
            type: 'warning'
          })
          return
        }
        if(parseFloat(this.ruleForm.zk) <= 0){
          this.$message({
            message: '折扣必须是大于0!',
            type: 'warning'
          })
          return
        }
        if(parseFloat(this.ruleForm.zk) > 9.9){
          this.$message({
            message: '折扣不得高于9.9折!',
            type: 'warning'
          })
          return
        }

        if(regPos.test(this.ruleForm.ffsl) || regNeg.test(this.ruleForm.ffsl)){
        }else{
          this.$message({
            message: '发放数量必须是数字!',
            type: 'warning'
          })
          return
        }
        if(parseInt(this.ruleForm.ffsl) <= 0){
          this.$message({
            message: '发放数量必须是大于0!',
            type: 'warning'
          })
          return
        }
        if(parseInt(this.ruleForm.ffsl) >= 100000000){
          this.$message({
            message: '发放数量不能是大于100000000!',
            type: 'warning'
          })
          return
        }
        for (let i = 0;i<this.tags.length;i++) {
          if(this.tags[i].id === `${parseFloat(this.ruleForm.gwm)}${parseFloat(this.ruleForm.zk)}`){
            this.$message({
              message: '折扣劵存在、请重新输入!',
              type: 'warning'
            })
            return
          }
        }
        this.tags.push({id:`${parseFloat(this.ruleForm.gwm)}${parseFloat(this.ruleForm.zk)}`,
          name: `满${parseFloat(this.ruleForm.gwm)}打${parseFloat(this.ruleForm.zk)}折 | ${this.ruleForm.ffsl}张`
          ,meet_price:parseFloat(this.ruleForm.gwm)
          ,discount:parseFloat(this.ruleForm.zk)
          ,limit_number:this.ruleForm.ffsl
          })
        this.ruleForm.gwm = ''
        this.ruleForm.zk = ''
        this.ruleForm.ffsl = ''
      },
      GetAllGoodsList(){
        this.time = new Date().toLocaleString()
        //input.articleName=&input.categroyId=&input.isGlobal=&
        GetGoodsBriefInfoByPage.call(this,`?&input.pageSize=${this.allPageSize}&input.pageIndex=${this.pageIndex}&input.clientVersion=v1&input.clientTimespan=${this.time}`).then(res=>{
           if(res.data.code === 1){
             let data = res.data.data
             if(data !== null && data !== '' && data !== undefined){
               this.allGoodsList = data.list
               this.allTotalCount = data.totalCount
             }
           }else{
             this.$message.error(res.data.desc)
           }
        })
      },
      GetPartGoodsList(){
        this.time = new Date().toLocaleString()
        let categroyId = 0
        if(this.selectValue != null && this.selectValue.length > 0){
          let array = this.selectValue
          categroyId = array[array.length - 1];
        }else{
          categroyId = 0
        }

        GetGoodsBriefInfoByPage.call(this,`?input.articleName=${this.goodsTitle}&input.categroyId=${categroyId}&input.isGlobal=&input.pageSize=${this.pageSize}&input.pageIndex=${this.pageIndex}&input.clientVersion=v1&input.clientTimespan=${this.time}`).then(res=>{
          if(res.data.code === 1){
            let data = res.data.data
            if(data !== null && data !== '' && data !== undefined){
              this.parGoodsList = data.list
              this.parTotalCount = data.totalCount
              let _indexList = new Array();
              this.changePage = true;
              console.log(this.multipleAll)
              this.multipleAll.map(selectGood => {
                this.parGoodsList.map((room, index) => {
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
          }else{
            this.$message.error(res.data.desc)
          }
        })
      },
      GetCategory(){
        this.time = new Date().toLocaleString()
        getCategory.call(this,`?input.clientVersion=v1&input.clientTimespan=${this.time}`).then(res=>{
          if(res.data.code === 1){
            var data = res.data.data
            if(data !== null && data !== undefined && data !== ''){
               let json = JSON.stringify(data)
               json = json.replace(/cateogryChildren/g,'children').replace(/id/g,'value').replace(/title/g,'label')
               this.shopOptions = JSON.parse(json)
            }
          }else{
            this.$message.error(res.data.desc)
          }
        })
      },
      changeGoods(val){
        if(val === 'part'){
          this.shopDataVisible = true
          if(this.goodsList === null ){
            this.totalCount = 0
          }
          this.multipleAll = JSON.parse(JSON.stringify(this.goodsList));
          let _indexList = new Array();
          this.goodsList.map(selectGood => {
            this.parGoodsList.map((room, index) => {
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
        }
        else if(val === 'all'){
          this.isAllProduct = 1
        }
      },

      /**
       * 切换到部分商品的显示
       */
      showPartGoods() {
        this.isAllProduct = 2;
      },

      intervalPrice(list){
        if(list !== null && list !== undefined){
          if(list.length === 1){
            return list[0].market_price
          }
          let min = this.min(list)
          let max = this.max(list)
          if(min === max){
            return min;
          }
          return `${min} - ${max}`
        }
      },
      min(array){
        var min = array[0].market_price;
        var len = array.length;
        for(var i=1; i<len; i++){
          if(array[i].market_price < min){
            min = array[i];
          }
        }
        return min;
      },
      max(array){
        var max = array[0].market_price;
        var len = array.length;
        for(var i=1; i<len; i++){
          if(array[i].market_price > max){
            max = array[i];
          }
        }
        return max;
      },
      uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
      },
      selectStartMonth() {

        if(this.ruleForm.date2 !== '' || this.ruleForm.date2 !== null){
          if(new Date(this.ruleForm.date2).getTime() < new Date(this.ruleForm.date1).getTime()){
            this.ruleForm.date2 = ''
            this.ruleForm.day = ''
          }
        }

        this.endMonthOption = {
          disabledDate: (time) => {
            if (this.ruleForm.date1 === '' || this.ruleForm.date1 === null) {
              return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
            } else {
              return time.getTime() < new Date(this.ruleForm.date1).getTime() + (86400000 * 6) || time.getTime() > new Date(this.ruleForm.date1).getTime() + (86400000 * 29);
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
        if(day !== ''){
          if(parseInt(day) < 7 || parseInt(day) > 30){
            this.ruleForm.date2 = ''
            this.ruleForm.day = ''
            return
          }
          this.ruleForm.day = parseInt(day);
        }else{
          this.ruleForm.day = ''
        }

      },
      timeChange1(){
        if(this.ruleForm.date1 !== '' && this.ruleForm.date1 !== null){
          var ret = this.contrastTime(this.ruleForm.date1);//获取返回值
          if(ret == 1){
            this.$message({
              message: '开始时间不能小于等于当天',
              type: 'warning'
            })
            this.ruleForm.date1 = ''
            return
          }
        }
        if(this.ruleForm.date2 !== '' ){
          let count = this.datedifference(this.ruleForm.date1,this.ruleForm.date2) + 1
          if(count < 0){
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'warning'
            })
            return
          }
          if(count < 7){
            this.$message({
              message: '开始时间和结束时间间隔不能小于7天',
              type: 'warning'
            })
            this.ruleForm.date1 = ''
            this.ruleForm.day = ''
            return
          }
          if(count > 30){
            this.$message({
              message: '开始时间和结束时间间隔不能大于30天',
              type: 'warning'
            })
            this.ruleForm.date1 = ''
            this.ruleForm.day = ''
            return
          }
          this.ruleForm.day = count
        }
      },
      contrastTime(startDate) {
        let evalue = startDate;
        let dB = new Date(evalue);//获取当前选择日期
        let d = new Date();
        let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();//获取当前实际日期
        if (Date.parse(dB) < Date.parse(str)) {//时间戳对比
          return 1;
        }
        if (Date.parse(str) === Date.parse(dB)) {//时间戳对比
          return 1;
        }
        return 0;
      },
      timeChange2(){
        if(this.ruleForm.date1 === '' ){
          this.$message({
            message: '请选择开始时间',
            type: 'warning'
          })
          this.ruleForm.date2 = ''
          this.ruleForm.day = ''
          return
        }
        let count = this.datedifference(this.ruleForm.date1,this.ruleForm.date2)+1
        if(count < 0){
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'warning'
          })
          this.ruleForm.date2 = ''
          this.ruleForm.day = ''
          return
        }
        if(count < 7){
          this.$message({
            message: '开始时间和结束时间间隔不能小于7天',
            type: 'warning'
          })
          this.ruleForm.date2 = ''
          this.ruleForm.day = ''
          return
        }
        if(count > 30){
          this.$message({
            message: '开始时间和结束时间间隔不能大于30天',
            type: 'warning'
          })
          this.ruleForm.date2 = ''
          this.ruleForm.day = ''
          return
        }
        this.ruleForm.day = count
      },
      datedifference(sDate1, sDate2) {

        var dateSpan,
          tempDate,
          iDays;
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        if(sDate1 >= sDate2)
        {
          return -1
        }
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays
      },
      formatDate(value,fmt) {
        let getDate = new Date(value);
        let o = {
          'M+': getDate.getMonth() + 1,
          'd+': getDate.getDate(),
          'h+': getDate.getHours(),
          'm+': getDate.getMinutes(),
          's+': getDate.getSeconds(),
          'q+': Math.floor((getDate.getMonth() + 3) / 3),
          'S': getDate.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt;
      }
    },
    created:async function(){
      let type = this.$route.query.type
      let activityId = this.$route.query.activityId
      if(type === 'edit' && activityId !== '' && activityId !== undefined){
        this.type = 'edit'
        this.time = new Date().toLocaleString()
        GetDiscountMeetCouponDetail.call(this,`?input.activityId=${activityId}&input.clientVersion=v1&input.clientTimespan=${this.time}`).then(res=>{
          if(res.data.code === 1){
             var data = res.data.data
             if(data !== null){
                this.id = data.id
                this.ruleForm.name = data.title
                this.ruleForm.date1 = data.begin_time
                this.ruleForm.date2 = data.end_time
                this.ruleForm.day = data.effective_day
                this.ruleForm.day2 = data.effective_day
                for(let i = 0;i< data.rules.length;i++){
                  console.log(data.rules.length)
                  this.tags.push({id:`${parseFloat(data.rules[i].meet_price)}${parseFloat(data.rules[i].discount)}`,
                   name: `满${parseFloat(data.rules[i].meet_price)}打${parseFloat(data.rules[i].discount)}折 | ${data.rules[i].give_number}张`
                   ,meet_price:parseFloat(data.rules[i].meet_price)
                   ,discount:parseFloat(data.rules[i].discount)
                   ,limit_number:data.rules[i].give_number
                  })
                }
                for(let i = 0;i< data.products.length;i++){
                  this.goodsList.push({articleId:data.products[i].article_id,imgUrl:data.products[i].img_url,title:data.products[i].title,sellPrice:data.products[i].sell_price})
                }
                this.totalCount = data.products.length
                this.isAllProduct = data.isAllProduct
             }
            this.GetAllGoodsList()
            this.GetPartGoodsList()
            this.GetCategory()
            if( this.isAllProduct === 1){
              this.goodsList = []
            }
          }else{
            this.$message.error(res.data.desc)
          }
        })
      }else{
        this.type = 'add'
        this.GetAllGoodsList()
        this.GetPartGoodsList()
        this.GetCategory()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
